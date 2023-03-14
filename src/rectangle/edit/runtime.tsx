import React, { CSSProperties, MouseEvent, useRef, useState } from "react";
import css from "./runtime.less";

export default function ({ data, slots, env }) {
  const ref = useRef<HTMLDivElement>(null),
    borderTopLeftRef = useRef<HTMLDivElement>(null),
    borderTopRightRef = useRef<HTMLDivElement>(null),
    borderBottomLeftRef = useRef<HTMLDivElement>(null),
    borderBottomRightRef = useRef<HTMLDivElement>(null);

  const [style, setStyle] = useState<CSSProperties>({
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  });

  const getTranslate = (borderRadius: number) => {
    return Math.sqrt((borderRadius * borderRadius) / 2);
  };

  const onMouseDown = (
    e: MouseEvent<HTMLDivElement, MouseEvent>,
    borderRadiusDirection: string
  ) => {
    e.stopPropagation();
    if (!ref.current || !borderTopLeftRef.current) return;
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

    const { x, y } = borderRadiusRef.current.getBoundingClientRect();
    const { width, height } = ref.current.getBoundingClientRect();

    document.onmousemove = (e) => {
      if (!borderRadiusRef.current) return;

      const { pageX, pageY } = e;

      let dx = Math.abs(pageX - x),
        dy = Math.abs(pageY - y);

      if (width >= height) {
        if (dy > height / 2 - 14 || dx > height / 2 - 14) return;
      } else {
        if (dy > width / 2 - 14 || dx > width / 2 - 14) return;
      }

      dx < dy ? (dx = dy) : (dy = dx);

      const borderRadius = Math.sqrt(dx * dx + dy * dy);

      setStyle({
        borderTopLeftRadius: borderRadius,
        borderTopRightRadius: borderRadius,
        borderBottomLeftRadius: borderRadius,
        borderBottomRightRadius: borderRadius,
      });
    };

    document.onmouseup = (e) => {
      (document.onmousemove = null), (document.onmouseup = null);
    };
  };

  return (
    <div ref={ref} className={css.rectangle} style={style}>
      <div
        ref={borderTopLeftRef}
        className={css.borderTopLeftRadius}
        style={{
          transform: `translate(${
            // @ts-ignore
            getTranslate(style.borderTopLeftRadius) + "px"
            // @ts-ignore
          },${getTranslate(style.borderTopLeftRadius) + "px"} )`,
        }}
        // @ts-ignore
        onMouseDown={(e) => onMouseDown(e, "borderTopLeftRadius")}
      />
      <div
        ref={borderTopRightRef}
        className={css.borderTopRightRadius}
        style={{
          transform: `translate(-${
            // @ts-ignore
            getTranslate(style.borderTopRightRadius) + "px"
            // @ts-ignore
          },${getTranslate(style.borderTopRightRadius) + "px"} )`,
        }}
        // @ts-ignore
        onMouseDown={(e) => onMouseDown(e, "borderTopRightRadius")}
      />
      <div
        ref={borderBottomLeftRef}
        className={css.borderBottomLeftRadius}
        style={{
          transform: `translate(${
            // @ts-ignore
            getTranslate(style.borderBottomLeftRadius) + "px"
            // @ts-ignore
          },-${getTranslate(style.borderBottomLeftRadius) + "px"} )`,
        }}
        // @ts-ignore
        onMouseDown={(e) => onMouseDown(e, "borderBottomLeftRadius")}
      />
      <div
        ref={borderBottomRightRef}
        className={css.borderBottomRightRadius}
        style={{
          transform: `translate(-${
            // @ts-ignore
            getTranslate(style.borderBottomRightRadius) + "px"
            // @ts-ignore
          },-${getTranslate(style.borderBottomRightRadius) + "px"} )`,
        }}
        // @ts-ignore
        onMouseDown={(e) => onMouseDown(e, "borderBottomRightRadius")}
      />
      {data.asSlot ? slots["container"].render() : null}
    </div>
  );
}
