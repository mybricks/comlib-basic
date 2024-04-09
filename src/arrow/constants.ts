export interface ArrowProps {
  type: "both" | "left" | "right";
  color: string;
  arrowHeight: number;
  arrowWidth: number;
  arrowBodyHeight: number; // 箭体宽度
  angle?: number; // 可选的旋转角度
}
