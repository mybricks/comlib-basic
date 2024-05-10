import { runJs } from './com-utils';
import { Data } from './constants';
import { convertObject2Array } from './util';

export default function ({ env, data, inputs, outputs, logger, onError }: RuntimeParams<Data>) {
  const { fns, runImmediate } = data;

  const runJSParams = {
    outputs: convertObject2Array(outputs)
  };

  let sandbox;

  try {
    if (runImmediate) {
      if (env.runtime) {
        sandbox = runJs(fns, [runJSParams], { env });
      }
    }
    inputs['input']((val) => {
      try {
        sandbox = runJs(fns, [
          {
            ...runJSParams,
            inputs: convertObject2Array(val)
          }
        ], { env });
      } catch (ex: any) {
        onError?.(ex);
        console.error('js计算组件运行错误.', ex);
        logger.error(`${ex}`);
      }
    });
    if (typeof env?.runtime?.onComplete === 'function') {
      env.runtime.onComplete(() => {
        sandbox?.dispose()
      })
    }
  } catch (ex: any) {
    onError?.(ex);
    console.error('js计算组件运行错误.', ex);
    logger.error(`${ex}`);
  }

}
