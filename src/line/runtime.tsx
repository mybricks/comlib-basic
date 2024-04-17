import React, { useMemo } from "react";
import { LineProps } from "./constants";
import Style from "./runtime.less";

const getLineStyle = ({
  type,
  angle,
  color,
  lineWidth,
}: Partial<LineProps>): React.CSSProperties => {
  const style: React.CSSProperties = {
    height: 0,
    width: "100%",
    transform: `rotate(${angle}deg)`,
    borderTop: `${lineWidth}px ${type} ${color}`,
  };
  return style;
};

export default function ({ data, style }: RuntimeParams<LineProps>) {
  const { type, color, angle, lineWidth } = data;
  // const lineStyle = useMemo(
  //   () =>
  //     getLineStyle({
  //       type,
  //       angle,
  //       color,
  //       lineWidth
  //     }),
  //   [type, color, angle, lineWidth]
  // );

  // return (
  //   <div className={Style.warrper}>
  //     <div style={lineStyle}></div>
  //   </div>
  // );
  const lineStyle = useMemo(() => {
    const dashed = type === "dashed";
    const newStyle: React.CSSProperties = {
      width: "100%",
      height: style.height,
      backgroundColor: dashed ? void 0 : color,
      transform: `rotate(${angle}deg)`,
    };
    if (dashed) {
      newStyle.background = `repeating-linear-gradient(to right, ${color} 0px, ${color} ${
        2 * lineWidth
      }px, transparent ${2 * lineWidth}px, transparent ${3 * lineWidth}px)`;
    }
    return newStyle;
  }, [type, color, angle, lineWidth]);

  return <div style={lineStyle}></div>;
}
