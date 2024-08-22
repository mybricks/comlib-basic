import React, { useMemo } from "react";
import { LineProps } from "./constants";
import Style from "./runtime.less";

// const getLineStyle = ({
//   type,
//   color,
//   lineWidth,
// }: Partial<LineProps>): React.CSSProperties => {
//   const style: React.CSSProperties = {
//     borderTop: `${lineWidth}px ${type} ${color}`,
//   };
//   return style;
// };

export default function ({ data, style }: RuntimeParams<LineProps>) {
  const { type, color, lineWidth } = data;
  // const lineStyle = useMemo(
  //   () =>
  //     getLineStyle({
  //       type,
  //       color,
  //       lineWidth,
  //     }),
  //   [type, color, lineWidth]
  // );

  return (
    <div className={Style.warrper}>
      <Line width={style.width} height={style.height} />
    </div>
  );
}

const Line = ({ width, height }) => {
  return (
    <div 
      style={{
        width: '100%', 
        height: '100%', 
        position: 'relative'
      }}
    >
      <svg 
        style={{ width, height, position: 'absolute', top: 0, left: 0 }}
      >
        <line 
          x1="0" 
          y1="0" 
          x2={parseFloat(width)} 
          y2={parseFloat(height)} 
          stroke="black" 
          strokeWidth="1" 
        />
      </svg>
    </div>
  );
};
