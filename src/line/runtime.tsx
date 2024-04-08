import React, { useMemo } from "react";
import { LineProps } from "./constants";
import Style from "./runtime.less";

const getLineStyle = ({
  type,
  angle,
  color,
  dashedBlankLength,
  dashedColorLength,
}: Partial<LineProps>): React.CSSProperties => {
  const dashed = type === "dashed";
  const style: React.CSSProperties = {
    backgroundColor: dashed ? void 0 : color,
    transform: `rotate(${angle}deg)`,
  };
  if (dashed) {
    style.background = `repeating-linear-gradient(to right, transparent, transparent ${dashedBlankLength}px, ${color} ${dashedBlankLength}px, ${color} ${
      (dashedBlankLength || 0) + (dashedColorLength || 0)
    }px)`;
  }
  return style;
};

export default function ({ data }: RuntimeParams<LineProps>) {
  const {
    type,
    color,
    angle,
    dashedBlankLength,
    dashedColorLength,
  } = data;
  const lineStyle = useMemo(
    () =>
      getLineStyle({
        type,
        angle,
        color,
        dashedBlankLength,
        dashedColorLength,
      }),
    [
      type,
      color,
      angle,
      dashedBlankLength,
      dashedColorLength,
    ]
  );

  return <div style={lineStyle} className={Style.warrper} />;
}
