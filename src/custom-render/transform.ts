import { CSS_LANGUAGE } from './types'
import { getParamsType } from './constants';

const transform = (code: string) => {
  const options = {
    presets: ['env', 'react'],
    plugins: [
      ['proposal-decorators', { legacy: true }],
      'proposal-class-properties',
      [
        'transform-typescript',
        {
          isTSX: true
        }
      ]
    ]
  };
  if (!window.Babel) {
    loadBabel()
    throw Error('当前环境 BaBel编译器 未准备好');
  }
  return window.Babel.transform(code, options).code;
};

const transformTsx = async (code): Promise<string> => {
  if(code.includes('var _RTFN_')) {
    return Promise.resolve(encodeURIComponent(code))
  }

  return new Promise((resolve, reject) => {
    code = `var _RTFN_ = ${code.trim().replace(/;$/, '')} `;
    let transformCode
    try {
      transformCode = transform(code);
    } catch (error) {
      reject(error)
    }
    transformCode = `(function() {\n${transformCode}\nreturn _RTFN_; })()`
    return resolve(encodeURIComponent(transformCode))
  })
}

const genLibTypes = async (schema: Record<string, any>) => {
  const SchemaToTypes = window.jstt;
  if(!SchemaToTypes) return;
  schema.title = 'Props';
  const propTypes = await SchemaToTypes.compile(schema, '', {
    bannerComment: '',
    unknownAny: false,
    format: false
  }).then((ts) => {
    return ts.replace('export ', '');
  });
  return `
    ${propTypes}\n
    ${getParamsType('Props')}
  `;
};

const transformCss = async (code, type: CSS_LANGUAGE = CSS_LANGUAGE.Css, context: { id: string }): Promise<string> => {
  if (type === CSS_LANGUAGE.Css) {
    return Promise.resolve(encodeURIComponent(addIdScopeToCssRules(code.replace(/\s+/g, ' ').trim(), context.id)));
  }

  if (type === CSS_LANGUAGE.Less) {
    return new Promise((resolve, reject) => {
      let res = ''
      try {
        if (window?.less) {
          window.less.render(code, {}, (error, result) => {
            if (error) {
              console.error(error)
              res = ''
              throw new Error(`Less 代码编译失败: ${error.message}`);
            } else {
              res = result?.css
            }
          })
        } else {
          loadLess(); // 重试下
          throw new Error('当前环境无 Less 编译器，请联系应用负责人')
        }
      } catch (error) {
        reject(error)
      }
      return resolve(encodeURIComponent(addIdScopeToCssRules(res.replace(/\s+/g, ' ').trim(), context.id)));
    })
  }

  return Promise.reject(new Error(`不支持的样式代码语言 ${type}`))
}

function addIdScopeToCssRules(cssText, id) {
  const regex = /([^{]*)(\{[^}]*\})/g;

  const prefixedCssText = cssText.replace(regex, (match, selectorGroup, ruleBody) => {
    const selectors = selectorGroup.split(',').map(selector => {
      selector = selector.trim();
      if (selector) {
        return `#${id} ${selector}`;
      }
      return selector;
    });

    return `${selectors.join(', ')}${ruleBody}`;
  });

  return prefixedCssText;
}

async function requireFromCdn (cdnUrl) {
  return new Promise((resolve, reject) => {
    const el = document.createElement('script');
    el.src = cdnUrl
    document.body.appendChild(el)
    el.onload = () => {
      resolve(true)
    }
    el.onerror = () => {
      reject(new Error(`加载${cdnUrl}失败`))
    }
  })
}

async function loadLess () {
  if (window?.less) {
    return
  }
  await requireFromCdn('https://f2.beckwai.com/udata/pkg/eshop/fangzhou/asset/less/4.2.0/less.js')
}

async function loadBabel () {
  if (window?.Babel) {
    return
  }
  await requireFromCdn('https://f2.beckwai.com/udata/pkg/eshop/fangzhou/asset/babel/standalone/7.24.7/babel.min.js')
}

export { genLibTypes, transformCss, transformTsx, loadLess, loadBabel };