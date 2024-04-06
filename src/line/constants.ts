export interface LineProps {
  type: "solid" | "dashed";
  width: number; // 线的粗细（宽度）
  color: string;
  linewidth: number;
  angle: number;
  direction: "horizontal" | "vertical";
}

export const INPUTS = {
  SetStyle: "setStyle",
};
