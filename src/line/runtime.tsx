import React, { useMemo } from "react";
import { LineProps } from "./constants";

const getLineStyle = (
  type: string,
  color: string,
  angle: number | string,
  linewidth: number
) => {
  const style: React.CSSProperties = {
    transform: `rotate(${angle}deg)`,
    borderBottom: `${type} ${color} ${linewidth}px`,
  };

  return style;
};

export default function ({ data }: RuntimeParams<LineProps>) {
  const { type, color, angle, direction, linewidth } = data;
  const lineStyle = useMemo(
    () => getLineStyle(type, color, angle, linewidth),
    [type, color, angle, linewidth, direction]
  );

  return <div style={lineStyle} />;
}
