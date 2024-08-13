import React, { CSSProperties, MouseEvent, useCallback, useMemo, useRef, useState } from "react";
import { dragable } from './../../utils'
import css from "./runtime.less";

const BorderRadiusHandleGap = 6;
const BorderRadiusClientWidth = 10;
const BorderRadiosClientWidthHalf = BorderRadiusClientWidth / 2;

/** 计算两点之间的距离 */
function distance(a, b) {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
}

export default function ({ data, slots, style, env }) {
  const middleNodeRef = useRef<HTMLDivElement>(null),
    borderTopLeftRef = useRef<HTMLDivElement>(null),
    borderTopRightRef = useRef<HTMLDivElement>(null),
    borderBottomLeftRef = useRef<HTMLDivElement>(null),
    borderBottomRightRef = useRef<HTMLDivElement>(null);

  const getMaxBorderRadiusLimit = useCallback(() => {
    const shortSideLength = style.width > style.height ? style.height : style.width;
    return shortSideLength / 2
  }, [])

  const getTranslate = useCallback(() => {
    const borderRadius = data?.style?.borderTopLeftRadius ? parseFloat(data.style.borderTopLeftRadius) : 0;
    const maxBorderRadius = getMaxBorderRadiusLimit();
    const finalRadius = Math.min(maxBorderRadius, Math.max(0, borderRadius))
    return Math.max(0, finalRadius - BorderRadiusHandleGap - BorderRadiosClientWidthHalf);
  }, [style.width, style.height, data?.style?.borderTopLeftRadius]);

  const moveInfoRef = useRef<{
    middle: { x: number, y: number },
    last: { x: number, y: number }
  }>({} as any);

  const handleDragBorderRadius = useCallback((e, borderRadiusDirection) => {
    let borderRadiusRef;
    switch (borderRadiusDirection) {
      case "borderTopLeftRadius":
        borderRadiusRef = borderTopLeftRef;
        break;
      case "borderTopRightRadius":
        borderRadiusRef = borderTopRightRef;
        break;
      case "borderBottomLeftRadius":
        borderRadiusRef = borderBottomLeftRef;
        break;
      case "borderBottomRightRadius":
        borderRadiusRef = borderBottomRightRef;
        break;
    }

    dragable(e, ({ dpo, origin }, state) => {
      if (state === 'start' && middleNodeRef.current) {
        const rect = middleNodeRef.current.getBoundingClientRect();
        // 记录中心点
        moveInfoRef.current.middle = {
          x: rect.x,
          y: rect.y
        }
        const startRect = borderRadiusRef.current.getBoundingClientRect();
        // 记录起始xy
        moveInfoRef.current.last = {
          x: startRect.x,
          y: startRect.y
        }
      }

      if (state === 'ing') {
        // --- 计算往内还是往外，决定是 增加 还是 减少 ---
        const moveTarget = {
          x: moveInfoRef.current.last.x + dpo.dx,
          y: moveInfoRef.current.last.y + dpo.dy,
        }
        // 往外还是往内，
        const moreInner = distance(moveInfoRef.current.middle, moveInfoRef.current.last) > distance(moveInfoRef.current.middle, moveTarget)
        // 记录上一次的xy
        moveInfoRef.current.last = moveTarget
        // --- 计算往内还是往外，决定是 增加 还是 减少 ---

        let dx = Math.abs(dpo.dx);
        let dy = Math.abs(dpo.dy);

        dx < dy ? (dx = dy) : (dy = dx);
  
        const mdoifyBorderRadius = Math.sqrt(dx * dx + dy * dy);

        const borderRadius = data?.style?.borderTopLeftRadius ? parseFloat(data.style.borderTopLeftRadius) : 0;
        const maxBorderRadius = getMaxBorderRadiusLimit();
        const lastBorderRadius = Math.min(maxBorderRadius, Math.max(0, borderRadius))

        const finnalRadius = moreInner ? `${lastBorderRadius + mdoifyBorderRadius}px` : `${lastBorderRadius - mdoifyBorderRadius}px`

        if (!data.style) {
          data.style = {}
        }

        data.style.borderTopLeftRadius = finnalRadius
        data.style.borderTopRightRadius = finnalRadius
        data.style.borderBottomLeftRadius = finnalRadius
        data.style.borderBottomRightRadius = finnalRadius
      }
    })
    e.stopPropagation();
  }, [])

  const borderTranslate = getTranslate();

  return (
    <div className={css.rectangle} style={{ ...(data?.style ?? {}) }}>
      <div
        ref={borderTopLeftRef}
        className={css.borderTopLeftRadius}
        style={{
          transform: `translate(${
            borderTranslate + "px"
          },${borderTranslate + "px"} )`,
          top: BorderRadiusHandleGap,
          left: BorderRadiusHandleGap,
        }}
        // @ts-ignore
        onMouseDown={(e) => handleDragBorderRadius(e, "borderTopLeftRadius")}
      />
      <div
        ref={borderTopRightRef}
        className={css.borderTopRightRadius}
        style={{
          transform: `translate(-${
            borderTranslate + "px"
          },${borderTranslate + "px"} )`,
          top: BorderRadiusHandleGap,
          right: BorderRadiusHandleGap
        }}
        // @ts-ignore
        onMouseDown={(e) => handleDragBorderRadius(e, "borderTopRightRadius")}
      />
      <div
        ref={borderBottomLeftRef}
        className={css.borderBottomLeftRadius}
        style={{
          transform: `translate(${
            borderTranslate + "px"
          },-${borderTranslate + "px"} )`,
          bottom: BorderRadiusHandleGap,
          left: BorderRadiusHandleGap
        }}
        // @ts-ignore
        onMouseDown={(e) => handleDragBorderRadius(e, "borderBottomLeftRadius")}
      />
      <div
        ref={borderBottomRightRef}
        className={css.borderBottomRightRadius}
        style={{
          transform: `translate(-${
            borderTranslate + "px"
          },-${borderTranslate + "px"} )`,
          bottom: BorderRadiusHandleGap,
          right: BorderRadiusHandleGap
        }}
        // @ts-ignore
        onMouseDown={(e) => handleDragBorderRadius(e, "borderBottomRightRadius")}
      />
      <div className={css.middlePoint} ref={middleNodeRef}></div>
      <div className={`${css.text} mybricks-rectangle-text`}>{data.text}</div>
      {data.asSlot ? slots["container"].render() : null}
    </div>
  );
}
