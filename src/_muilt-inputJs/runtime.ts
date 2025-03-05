import { runJs } from './com-utils';
import { Data } from './constants';
import { convertObject2Array } from './util';

const WindowKey = '_muilt-inputJs';

if (!window[WindowKey]) {
  window[WindowKey] = {};
}

export default function ({ id, env, data, inputs, outputs, logger, onError, ...other }: RuntimeParams<Data>) {
  const isRuntime = id && env.runtime && !env.runtime.debug;
  const { fns, runImmediate } = data;

  const runJSParams = {
    outputs: convertObject2Array(outputs)
  };

  let sandbox;

  try {
    if (runImmediate) {
      if (env.runtime) {
        // sandbox = runJs(fns, [runJSParams], { env });
        if (isRuntime && window[WindowKey][id]) {
          window[WindowKey][id].run([runJSParams])
        } else {
          const result = runJs(fns, [runJSParams], { env });
          if (result) {
            sandbox = result.sandbox;
            if (isRuntime) {
              window[WindowKey][id] = result.fn;
            }
          }
        }
      }
    }
    inputs['input']((val) => {
      try {
        // sandbox = runJs(fns, [
        //   {
        //     ...runJSParams,
        //     inputs: convertObject2Array(val)
        //   }
        // ], { env });

        if (isRuntime && window[WindowKey][id]) {
          window[WindowKey][id].run([
            {
              ...runJSParams,
              inputs: convertObject2Array(val)
            }
          ])
        } else {
          const result = runJs(fns, [
            {
              ...runJSParams,
              inputs: convertObject2Array(val)
            }
          ], { env });
  
          if (result) {
            sandbox = result.sandbox;
            if (isRuntime) {
              console.log("result => ", result)
              window[WindowKey][id] = result.fn;
            }
          }
        }
      } catch (ex: any) {
        onError?.(ex);
        console.error('js计算组件运行错误.', ex);
        logger.error(`${ex}`);
      }
    });
    if (typeof env?.runtime?.onComplete === 'function') {
      env.runtime.onComplete(() => {
        sandbox?.dispose()
        if (isRuntime) {
          window[WindowKey][id] = null;
        }
      })
    }
  } catch (ex: any) {
    onError?.(ex);
    console.error('js计算组件运行错误.', ex);
    logger.error(`${ex}`);
  }

}
