import { LineProps } from "./constants";

export default function ({
  data,
  output,
  input,
  style,
}: UpgradeParams<LineProps>): boolean {
  if (data?.angle && typeof data.angle === "number") {
    style.transform = `rotate(${data.angle}deg)`;
    data.angle = void 0;
  }

  return true;
}
