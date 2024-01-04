import Sandbox from './sandbox';
import utils from './utils';

interface Props {
  env?: any;
  callback?: () => any;
}
export function runJs(scriptText: string | any, model?: any[], props?: Props) {
  const { env, callback = () => {} } = props || {};
  const isRuntime = env?.runtime && !env?.runtime?.debug;
  if (typeof scriptText === 'object') {
    scriptText = isRuntime ? scriptText?.transformCode || scriptText?.code : scriptText?.code;
  }
  if (!scriptText?.includes('var%20_RTFN_')) {
    scriptText = transform(scriptText)
  }
  let fn: {run: Function}, sandbox: Sandbox;
  if (model && model.length) {
    sandbox = new Sandbox({ module: true });
    let sourceStr = decodeURIComponent(scriptText);
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
    fn = sandbox.compile(`${decodeURIComponent(scriptText)}`);
  }
  fn.run(model, callback)
  return sandbox;
}

export const transform = (scriptText: string): string => {
  scriptText = decodeURIComponent(scriptText)
  try {
    if(!window.Babel) {
      throw Error('Babel was not found in window');
    }
    let { code } = window.Babel.transform(`_RTFN_ = ${scriptText} `, {
      presets: ['env', 'typescript'],
      parserOpts: { strictMode: false },
      comments: false,
      filename: 'types.d.ts',
    })
    code = `(function() { var _RTFN_; \n${code}\n return _RTFN_; })()`
    return encodeURIComponent(code);
  } catch (error) {
    console.error(error)
    return encodeURIComponent(scriptText)
  }
}

export { utils };
export { runExpression } from './expression';
