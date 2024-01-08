import { OutputIds } from "./constants";
import { isSameInputType, objMerge } from "./utils";

export default function ({ env, inputs, outputs }) {
  const { runtime } = env;

  if (runtime) {
    inputs["input"]((val: Record<string, Array<any>>) => {
      let list: any[] = Object.values(val);
      const type = isSameInputType(list);
      if (!!type && type === "Object") {
        outputs[OutputIds.Output](objMerge(list));
      } else {
        outputs[OutputIds.Output](list);
      }
    });
  }
}
