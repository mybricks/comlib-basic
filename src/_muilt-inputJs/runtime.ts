import { runJs } from './com-utils';
import { Data } from './constants';

export default function ({ env, data, inputs, outputs, logger, onError }: RuntimeParams<Data>) {
  const { fns, runImmediate } = data;

  const runJSParams = {
    outputs: covertObject2Array(outputs)
  };
  try {
    if (runImmediate) {
      if (env.runtime) {
        runJs(fns, [runJSParams]);
      }
    }
    inputs['input']((val) => {
      try {
        runJs(fns, [
          {
            ...runJSParams,
            inputs: covertObject2Array(val)
          }
        ]);
      } catch (ex: any) {
        onError?.(ex);
        console.error('js计算组件运行错误.', ex);
        logger.error(`${ex}`);
      }
    });
  } catch (ex: any) {
    onError?.(ex);
    console.error('js计算组件运行错误.', ex);
    logger.error(`${ex}`);
  }


  function covertObject2Array(input) {
    let result = [] as any[];
    Object.keys(input).sort((a, b)=>{
      return parseInt(a) - parseInt(b);
    }).forEach((key) => {
      result.push(input[key]);
    });
    return result;
  }

}
