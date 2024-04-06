import React, { useMemo } from "react";
import { LineProps } from "./constants";

interface LineStyle {
  borderBottom?: string;
  borderLeft?: string;
}

const getLineStyle = (
  type: string,
  color: string,
  linewidth: number,
  direction: LineProps["direction"]
) => {
  const border = `${type} ${color} ${linewidth}px`;
  const style: LineStyle = {};
  switch (direction) {
    case "horizontal":
      style.borderBottom = border;
      break;
    case "vertical":
      style.borderLeft = border;
      break;
  }

  return style;
};

export default function ({ data }: RuntimeParams<LineProps>) {
  const { type, width, color, angle, direction, linewidth } = data;
  const lineStyle = useMemo(
    () => getLineStyle(type, color, linewidth, direction),
    [type, color, linewidth, direction]
  );

  return <div style={lineStyle} />;
}
