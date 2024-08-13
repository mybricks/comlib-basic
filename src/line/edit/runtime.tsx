import React, { useCallback, useMemo, useRef, useState } from "react";
import { LineProps } from "./../constants";
import { dragable } from './../../utils'
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
export default function ({ data, style }: RuntimeParams<LineProps>) {

  console.log('style', style)

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

  const leftNodeRef = useRef<HTMLDivElement>(null)
  const rightNodeRef = useRef<HTMLDivElement>(null)

  const [_style, setStyle] = useState({ angle: 0 })

  const dragHandle = useCallback((e, pointType) => {
    dragable(e, ({ dpo, origin }, state) => {

      console.log(origin)

      const leftRect = leftNodeRef.current?.getBoundingClientRect();
      const rightRect = rightNodeRef.current?.getBoundingClientRect();


      if (state === "ing" && pointType === 'right' && leftRect) {
        const targetRect = {
          x: origin.pageX,
          y: origin.pageY
        }

        const middlePointRect = {
          x: (targetRect.x + leftRect?.x) / 2,
          y: (targetRect.y + leftRect?.y) / 2,
        }

        console.log(leftRect?.x, origin.pageX, middlePointRect)

        const res = calculateDistanceAndAngle(middlePointRect, targetRect)

        setStyle({ angle: res.angle })

        style.width = res.distance * 2
      }

      // if (rightRect && !isNaN(dpo.dx)) {
      //   rightRect.x += dpo.dx
      // }
      // if (rightRect && !isNaN(dpo.dy)) {
      //   rightRect.y += dpo.dy
      // }

      // const res = calculateDistanceAndAngle(leftRect, rightRect)
      
      // // style.transform = `rotate(${res.angle}deg)`

      // setStyle({ angle: res.angle })

      // style.width = res.distance

      // console.log(res)

      if (state === "start") {
        // const colEle = e.target.parentNode;
        // currentWidth = colEle.offsetWidth;
        // col.isDragging = true;
      }
      if (state === "ing") {
        // col.width = currentWidth += dpo.dx;
        // col.widthMode = WidthUnitEnum.Px;
        // typeof onResize === 'function' && onResize(row, { ...col })
      }
      if (state === "finish") {
        // col.isDragging = false;
      }
    });
    e.stopPropagation();
  }, [])

  return (
    <div className={Style.warrper} style={{ overflow: 'auto !important', transform: `rotate(${_style.angle}deg)`, transformOrigin: 'left top' }}>
      <div ref={leftNodeRef} className={`${Style.handle} ${Style.left}`} onMouseDown={(e) => dragHandle(e, 'left')}></div>
      <div style={lineStyle} className={Style.line}></div>
      <div ref={rightNodeRef} className={`${Style.handle} ${Style.right}`} onMouseDown={(e) => dragHandle(e, 'right')}></div>
    </div>
  );
}

function calculateDistanceAndAngle(pointA, pointB) {
  // 计算距离（线段长度）
  var dx = pointB.x - pointA.x;
  var dy = pointB.y - pointA.y;
  var distance = Math.sqrt(dx * dx + dy * dy) - 8;

  console.log(dy, dx)

  // 计算角度
  var angleInRadians = Math.atan2(dy, dx);
  var angleInDegrees = angleInRadians * (180 / Math.PI); // 将弧度转换为度

  return {
    distance: distance,
    angle: angleInDegrees
  };
}