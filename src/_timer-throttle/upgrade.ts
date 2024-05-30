import { Data } from "./constants";

export default function ({
  data,
  output,
  input,
  style,
}: UpgradeParams<Data>): boolean {
  /**
   * @description 1.0.0->1.0.1 新增执行时机控制
   */
  if (data.leading === undefined) {
    data.leading = true;
  }
  if (data.trailing === undefined) {
    data.trailing = true;
  }

  return true;
}
