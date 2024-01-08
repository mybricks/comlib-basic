import { Data, OutputIds } from "./constants";

export default function ({
  inputs,
  outputs,
  env,
  logger,
  onError,
}: RuntimeParams<Data>) {
  const { runtime } = env;
  try {
    const getOutputVal = (list: any[]) => {
      let res = {};
      list.forEach((val) => {
        if (val && typeof val === "object" && !Array.isArray(val)) {
          res = {
            ...res,
            ...val,
          };
        }
      });
      return res;
    };

    if (runtime) {
      inputs["input"]((val: Record<string, Array<any>>) => {
        let list: any[] = [];
        list = Object.values(val);
        outputs[OutputIds.Output](getOutputVal(list));
      });
    }
  } catch (ex: any) {
    console.error("js计算组件运行错误.", ex);
    logger.error(`${ex}`);
    onError?.(ex);
  }
}
