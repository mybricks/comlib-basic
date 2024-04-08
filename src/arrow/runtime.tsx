import React, { useCallback, useMemo } from "react";
import { ArrowProps } from "./constants";
import Style from "./runtime.less";

const getstyle = (
  type: string,
  color: string,
  length: number,
  arrowLength: number
) => {
  const style: React.CSSProperties = {
    width: 0,
    height: 0,
  };

  const colorSide = `${arrowLength}px solid ${color}`;
  const transparentSide = `${length / 2}px solid transparent`;

  // 根据箭头方向设置边框样式
  switch (type) {
    case "left":
      style.borderRight = colorSide;
      style.borderTop = transparentSide;
      style.borderBottom = transparentSide;
      break;
    case "right":
      style.borderLeft = colorSide;
      style.borderTop = transparentSide;
      style.borderBottom = transparentSide;
      break;
  }
  return style;
};

const Arrow: React.FC<RuntimeParams<ArrowProps>> = ({ data, style }) => {
  const { type, color, angle, arrowLength, arrowBodyWidth } = data;
  const { height } = style;

  const arrowHeadRender = useCallback(
    (type: ArrowProps["type"]) => {
      return (
        <div
          className={Style.arrowHead}
          style={getstyle(type, color, height, arrowLength)}
        />
      );
    },
    [type, color, height, arrowLength]
  );

  return (
    <div
      className={Style.arrowWarrper}
      style={{ transform: `rotate(${angle}deg)` }}
    >
      {(type === "left" || type === "both") && arrowHeadRender("left")}
      <div className={Style.arrowBody}>
        <div
          style={{
            backgroundColor: color,
            height: `${arrowBodyWidth}px`,
            width: "100%",
          }}
        ></div>
      </div>
      {(type === "right" || type === "both") && arrowHeadRender("right")}
    </div>
  );
};

export default Arrow;
