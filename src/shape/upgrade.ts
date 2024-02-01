import { ShapeProps, INPUTS } from "./constants";

export default function ({
  input,
  output,
}: UpgradeParams<ShapeProps>): boolean {
  if (!input.get(INPUTS.SetStyle)) {
    input.add(INPUTS.SetStyle, "动态设置样式", {
      type: "object",
      properties: {
        background: {
          type: "string",
        },
      },
    });
  }

  const setStyleComplete = output.get("setStyleComplete");
  if (input.get(INPUTS.SetStyle) && !setStyleComplete) {
    output.add("setStyleComplete", "完成", { type: "any" });
    input.get(INPUTS.SetStyle).setRels(["setStyleComplete"]);
  }
  return true;
}
