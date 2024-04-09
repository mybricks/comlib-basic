import React, { useCallback, useMemo } from "react";
import { ArrowProps } from "./constants";
import Style from "./runtime.less";

const getstyle = (
  type: string,
  color: string,
  arrowHeight: number,
  arrowWidth: number
) => {
  const style: React.CSSProperties = {
    width: 0,
    height: 0,
  };

  const colorSide = `${arrowWidth}px solid ${color}`;
  const transparentSide = `${arrowHeight / 2}px solid transparent`;

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

const Arrow: React.FC<RuntimeParams<ArrowProps>> = ({ data }) => {
  const { type, color, angle, arrowWidth, arrowHeight, arrowBodyHeight } = data;

  const arrowHeadRender = useCallback(
    (type: ArrowProps["type"]) => {
      return (
        <div
          className={Style.arrowHead}
          style={getstyle(type, color, arrowHeight, arrowWidth)}
        />
      );
    },
    [type, color, arrowHeight, arrowWidth]
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
            height: `${arrowBodyHeight}px`,
            width: "100%",
          }}
        ></div>
      </div>
      {(type === "right" || type === "both") && arrowHeadRender("right")}
    </div>
  );
};

export default Arrow;
