import { LineProps } from "./constants";

export default function ({
  data,
  output,
  input,
}: UpgradeParams<LineProps>): boolean {
  if (data?.angle) {
    data.angle = void 0;
  }

  return true;
}
