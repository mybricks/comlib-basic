import React, { CSSProperties, MouseEvent, useCallback, useMemo, useRef, useState } from "react";
import { dragable } from './../../utils'
import css from "./runtime.less";

const BorderRadiusHandleGap = 6;
const BorderRadiusClientWidth = 10;
const BorderRadiosClientWidthHalf = BorderRadiusClientWidth / 2;

export default function ({ data, slots, style, env }) {
  const borderTopLeftRef = useRef<HTMLDivElement>(null),
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

  const handleDrgeBorderRadius = useCallback((e, borderRadiusDirection) => {
    dragable(e, ({ dpo, origin }, state) => {
      if (state === 'ing') {
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

        // 往外还是往内，决定是 增加 还是 减少
        let moreInner = false
        switch (borderRadiusDirection) {
          case "borderTopLeftRadius":
            if (dpo.dx > 0 || dpo.dy > 0) {
              moreInner = true
            }
            break;
          case "borderTopRightRadius":
            if (dpo.dx < 0 || dpo.dy > 0) {
              moreInner = true
            }
            break;
          case "borderBottomLeftRadius":
            if (dpo.dx > 0 || dpo.dy < 0) {
              moreInner = true
            }
            break;
          case "borderBottomRightRadius":
            if (dpo.dx < 0 || dpo.dy < 0) {
              moreInner = true
            }
            break;
        }

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
        onMouseDown={(e) => handleDrgeBorderRadius(e, "borderTopLeftRadius")}
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
        onMouseDown={(e) => handleDrgeBorderRadius(e, "borderTopRightRadius")}
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
        onMouseDown={(e) => handleDrgeBorderRadius(e, "borderBottomLeftRadius")}
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
        onMouseDown={(e) => handleDrgeBorderRadius(e, "borderBottomRightRadius")}
      />
      <div className={`${css.text} mybricks-rectangle-text`}>{data.text}</div>
      {data.asSlot ? slots["container"].render() : null}
    </div>
  );
}
