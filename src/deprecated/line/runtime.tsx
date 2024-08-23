import React, { useMemo } from "react";
import { LineProps } from "./constants";
import Style from "./runtime.less";

const getLineStyle = ({
  type,
  color,
  lineWidth,
}: Partial<LineProps>): React.CSSProperties => {
  const style: React.CSSProperties = {
    borderTop: `${lineWidth}px ${type} ${color}`,
  };
  return style;
};

export default function ({ data }: RuntimeParams<LineProps>) {
  const { type, color, lineWidth } = data;
  const lineStyle = useMemo(
    () =>
      getLineStyle({
        type,
        color,
        lineWidth,
      }),
    [type, color, lineWidth]
  );

  return (
    <div className={Style.warrper}>
      <div style={lineStyle} className={Style.line}></div>
    </div>
  );
}