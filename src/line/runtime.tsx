import React, { useMemo } from "react";
import { LineProps } from "./constants";
import Style from "./runtime.less";

const getLineStyle = ({
  type,
  angle,
  color,
  lineWidth
}: Partial<LineProps>): React.CSSProperties => {
  const style: React.CSSProperties = {
    height: 0,
    width: "100%",
    transform: `rotate(${angle}deg)`,
    borderTop: `${lineWidth}px ${type} ${color}`
  };
  return style;
};

export default function ({ data }: RuntimeParams<LineProps>) {
  const { type, color, angle, lineWidth } = data;
  const lineStyle = useMemo(
    () =>
      getLineStyle({
        type,
        angle,
        color,
        lineWidth
      }),
    [type, color, angle, lineWidth]
  );

  return (
    <div className={Style.warrper}>
      <div style={lineStyle}></div>
    </div>
  );
}
