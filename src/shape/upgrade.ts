import { ShapeProps, INPUTS } from "./constants";

export default function ({
  input,
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
  return true;
}
