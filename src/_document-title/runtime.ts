import { OutputIds, InputIds } from "./constants";

export default function ({ env, inputs, outputs }) {
  const { runtime } = env;

  if (runtime) {
    inputs[InputIds.SetTitle]((title: string) => {
      if (typeof title === "string") {
        document.title = title;
        outputs[OutputIds.SetTitleDone](title);
      } else {
        console.error("计算组件[设置页面标题]入参不为字符");
      }
    });
  }
}
