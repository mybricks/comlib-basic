import Sandbox from './sandbox';
import utils from './utils';

const safeDecoder = (str: string) => {
  try {
    return decodeURIComponent(str)
  } catch (error) {
    return str
  }
}

const safeEncoder = (str: string) => {
  try {
    return encodeURIComponent(str)
  } catch (error) {
    return str
  }
}

interface Props {
  env?: any;
  callback?: () => any;
}
export function runJs(scriptText: string | any, model?: any[], props?: Props) {
  const { callback = () => { }, env = {} } = props || {};
  if ((env?.toCode || !!env.extractFns) && Number.isInteger(scriptText)) {
    env.extractFns[scriptText](...model)
    return
  }
  if (typeof scriptText === 'object' && scriptText !== null) {
    scriptText = scriptText?.transformCode ?? scriptText?.code;
  }
  if (!scriptText?.includes('var%20_RTFN_')) {
    scriptText = transform(scriptText)
  }
  let fn: { run: Function }, sandbox: Sandbox;
  if (model && model.length) {
    sandbox = new Sandbox({ module: true });
    let sourceStr = safeDecoder(scriptText);
    if (/export\s+default.*async.*function.*\(/g.test(sourceStr)) {
      fn = sandbox.compile(
        `${sourceStr.replace(/export\s+default.*function.*\(/g, 'async function _RT_(')}`
      );
    } else {
      fn = sandbox.compile(
        `${sourceStr.replace(/export\s+default.*function.*\(/g, 'function _RT_(')}`
      );
    }
  } else {
    sandbox = new Sandbox();
    fn = sandbox.compile(`${safeDecoder(scriptText)}`);
  }
  fn.run(model, callback)
  return { sandbox, fn };
}

export const transform = (scriptText: string): string => {
  scriptText = safeDecoder(scriptText)
  try {
    if (!window.Babel) {
      throw Error('Babel was not found in window');
    }
    let { code } = window.Babel.transform(`_RTFN_ = ${scriptText} `, {
      presets: ['env', 'typescript'],
      parserOpts: { strictMode: false },
      comments: false,
      filename: 'types.d.ts',
    })
    code = `(function() { var _RTFN_; \n${code}\n return _RTFN_; })()`
    return safeEncoder(code);
  } catch (error) {
    console.error(error)
    return safeEncoder(scriptText)
  }
}

export { utils };
export { runExpression } from './expression';
