/**
 * 数据源
 * @export
 * @interface ShapeProps
 * @param type 形状
 * @param position 三角形底边
 * @param clipPath 三角形样式
 * */
export interface ShapeProps {
  type: ShapeType;
  position: number;
  clipPath: string;
}

export type ShapeType = "circle" | "rectangle" | "triangle";

export const rotateTriangle = (angle: number) => {
  const centerX = 50, centerY = 50;
  const radians = angle * (Math.PI / 180);
  const cosTheta = Math.cos(radians);
  const sinTheta = Math.sin(radians);
  
  const points = [
    [50, 0],   // point1
    [0, 100],  // point2
    [100, 100] // point3
  ];
  
  const rotatedPoints = points.map(([x, y]) => {
    const shiftedX = x - centerX;
    const shiftedY = y - centerY;
  
    const rotatedX = Math.round(shiftedX * cosTheta - shiftedY * sinTheta + centerX);
    const rotatedY = Math.round(shiftedX * sinTheta + shiftedY * cosTheta + centerY);
  
    return [rotatedX, rotatedY];
  });
  
  const [point1, point2, point3] = rotatedPoints;
  
  return `polygon(${point1[0]}% ${point1[1]}%, ${point2[0]}% ${point2[1]}%, ${point3[0]}% ${point3[1]}%)`;
}
