import { CSS_LANGUAGE } from './types'
import { getParamsType, requireScriptFromUrl } from './helper';

function supportLessCssModules(code) {
  let res
  res = code.replace(`import css from 'index.less'`, 'const css = new Proxy({}, { get(target, key) { return key } })');

  return res
}

const transformTsx = async (code, context: { id: string }) => {
  return new Promise((resolve, reject) => {
    let transformCode
    try {
      const options = {
        presets: [
          [
            "env",
            {
              "modules": "umd"
            }
          ],
          'react'
        ],
        moduleId: `mbcrjsx_${context.id}`,
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
      }

      if (!window.Babel) {
        loadBabel()
        throw Error('当前环境 BaBel编译器 未准备好')
      } else {
        transformCode = window.Babel.transform(supportLessCssModules(code), options).code
      }

    } catch (error) {
      reject(error)
    }

    return resolve(encodeURIComponent(transformCode))
  })
}

const genLibTypes = async (schema: Record<string, any>) => {
  const SchemaToTypes = window.jstt;
  if (!SchemaToTypes) return;
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

async function loadLess() {
  if (window?.less) {
    return
  }
  await requireScriptFromUrl('https://f2.beckwai.com/udata/pkg/eshop/fangzhou/asset/less/4.2.0/less.js')
}

async function loadBabel() {
  if (window?.Babel) {
    return
  }
  await requireScriptFromUrl('https://f2.beckwai.com/udata/pkg/eshop/fangzhou/asset/babel/standalone/7.24.7/babel.min.js')
}

export { genLibTypes, transformCss, transformTsx, loadLess, loadBabel };