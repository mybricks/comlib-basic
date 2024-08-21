import React, {
  CSSProperties,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { dragable } from './../../utils'
import css from './runtime.less'

const BorderRadiusHandleGap = 6
// 圆角控制器本身的宽度
const BorderRadiusClientWidth = 8
const BorderRadiosClientWidthHalf = BorderRadiusClientWidth / 2
// 阻尼倍数
const MoveRatio = 0.7

/** 计算两点之间的距离 */
function distance(a, b) {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2))
}

export default function ({ data, slots, style, env }) {
  const middleNodeRef = useRef<HTMLDivElement>(null),
    borderTopLeftRef = useRef<HTMLDivElement>(null),
    borderTopRightRef = useRef<HTMLDivElement>(null),
    borderBottomLeftRef = useRef<HTMLDivElement>(null),
    borderBottomRightRef = useRef<HTMLDivElement>(null)

  const [movingDirection, setMovingDirection] = useState('')

  const scale = useMemo(() => {
    return env.canvas?.scale ?? 1
  }, [env.canvas.scale])

  const radiusEditVisible = useMemo(() => {
    const min = Math.min(style.width, style.height)
    return min > 60
  }, [style.width, style.height])

  const getMaxBorderRadiusLimit = useCallback(() => {
    const shortSideLength =
      style.width > style.height ? style.height : style.width
    return (shortSideLength - parseFloat(data?.style?.borderLeftWidth ?? 0) * 2) / 2
  }, [data?.style?.borderTopLeftWidth])

  const getTranslate = useCallback(() => {
    const borderRadius = data?.style?.borderTopLeftRadius
      ? parseFloat(data.style.borderTopLeftRadius)
      : 0
    const maxBorderRadius = getMaxBorderRadiusLimit()
    const finalRadius = Math.min(maxBorderRadius, Math.max(0, borderRadius))

    return Math.max(
      0,
      finalRadius - BorderRadiusHandleGap - (BorderRadiosClientWidthHalf)
    )
  }, [style.width, style.height, data?.style?.borderTopLeftRadius])

  const moveInfoRef = useRef<{
    middle: { x: number; y: number }
    last: { x: number; y: number }
  }>({} as any)

  const handleDragBorderRadius = useCallback((e, borderRadiusDirection) => {
    let borderRadiusRef
    switch (borderRadiusDirection) {
      case 'borderTopLeftRadius':
        borderRadiusRef = borderTopLeftRef
        break
      case 'borderTopRightRadius':
        borderRadiusRef = borderTopRightRef
        break
      case 'borderBottomLeftRadius':
        borderRadiusRef = borderBottomLeftRef
        break
      case 'borderBottomRightRadius':
        borderRadiusRef = borderBottomRightRef
        break
    }

    dragable(e, ({ dpo, origin }, state) => {
      if (state === 'start' && middleNodeRef.current) {
        const rect = middleNodeRef.current.getBoundingClientRect()
        // 记录中心点
        moveInfoRef.current.middle = {
          x: rect.x,
          y: rect.y,
        }

        
        const startRect = borderRadiusRef.current.getBoundingClientRect()
        // 记录起始xy
        moveInfoRef.current.last = {
          x: startRect.x,
          y: startRect.y,
        }
      }

      if (state === 'ing') {
        setMovingDirection(borderRadiusDirection)

        // --- 计算往内还是往外，决定是 增加 还是 减少 ---
        const moveTarget = {
          x: moveInfoRef.current.last.x + dpo.dx,
          y: moveInfoRef.current.last.y + dpo.dy,
        }
        // 往外还是往内，
        const moreInner =
          distance(moveInfoRef.current.middle, moveInfoRef.current.last) >
          distance(moveInfoRef.current.middle, moveTarget)
        // 记录上一次的xy
        moveInfoRef.current.last = moveTarget
        // --- 计算往内还是往外，决定是 增加 还是 减少 ---

        let dx = Math.abs(dpo.dx)
        let dy = Math.abs(dpo.dy)

        // 这是计算目前移动的距离公式
        const modifyBorderRadius = Math.sqrt(dx * dx + dy * dy) / (env.canvas?.scale ?? 1);

        const lastBorderRadius = data?.style?.borderTopLeftRadius
          ? parseFloat(data.style.borderTopLeftRadius)
          : 0
        const maxBorderRadius = getMaxBorderRadiusLimit()

        let finnalRadius: any = moreInner
          ? Math.round(lastBorderRadius + modifyBorderRadius)
          : Math.round(lastBorderRadius - modifyBorderRadius)
        finnalRadius =
          Math.min(maxBorderRadius, Math.max(0, finnalRadius)) + 'px'


        if (!data.style) {
          data.style = {}
        }

        data.style.borderTopLeftRadius = finnalRadius
        data.style.borderTopRightRadius = finnalRadius
        data.style.borderBottomLeftRadius = finnalRadius
        data.style.borderBottomRightRadius = finnalRadius
      }

      if (state === 'finish') {
        setMovingDirection('')
      }
    })
    e.stopPropagation()
  }, [])

  const borderTranslate = getTranslate()

  return (
    <div
      className={`${css.rectangle} ${!!movingDirection ? css.show : ''}`}
      style={{ ...(data?.style ?? {}) }}
    >
      {radiusEditVisible ? (
        <>
          <div
            ref={borderTopLeftRef}
            className={`${css.borderTopLeftRadius} ${
              movingDirection === 'borderTopLeftRadius' ? css.moving : ''
            }`}
            style={{
              transform: `translate(${borderTranslate + 'px'},${
                borderTranslate + 'px'
              } ) scale(${1 / scale})`,
              top: BorderRadiusHandleGap,
              left: BorderRadiusHandleGap,
            }}
            data-text={`圆角${data.style.borderTopLeftRadius}`}
            // @ts-ignore
            onMouseDown={(e) =>
              handleDragBorderRadius(e, 'borderTopLeftRadius')
            }
          />
          <div
            ref={borderTopRightRef}
            className={`${css.borderTopRightRadius} ${
              movingDirection === 'borderTopRightRadius' ? css.moving : ''
            }`}
            style={{
              transform: `translate(-${borderTranslate + 'px'},${
                borderTranslate + 'px'
              } ) scale(${1 / scale})`,
              top: BorderRadiusHandleGap,
              right: BorderRadiusHandleGap,
            }}
            data-text={`圆角${data.style.borderTopRightRadius}`}
            // @ts-ignore
            onMouseDown={(e) =>
              handleDragBorderRadius(e, 'borderTopRightRadius')
            }
          />
          <div
            ref={borderBottomLeftRef}
            className={`${css.borderBottomLeftRadius} ${
              movingDirection === 'borderBottomLeftRadius' ? css.moving : ''
            }`}
            style={{
              transform: `translate(${borderTranslate + 'px'},-${
                borderTranslate + 'px'
              } ) scale(${1 / scale})`,
              bottom: BorderRadiusHandleGap,
              left: BorderRadiusHandleGap,
            }}
            data-text={`圆角${data.style.borderBottomLeftRadius}`}
            // @ts-ignore
            onMouseDown={(e) =>
              handleDragBorderRadius(e, 'borderBottomLeftRadius')
            }
          />
          <div
            ref={borderBottomRightRef}
            className={`${css.borderBottomRightRadius} ${
              movingDirection === 'borderBottomRightRadius' ? css.moving : ''
            }`}
            style={{
              transform: `translate(-${borderTranslate + 'px'},-${
                borderTranslate + 'px'
              } ) scale(${1 / scale})`,
              bottom: BorderRadiusHandleGap,
              right: BorderRadiusHandleGap,
            }}
            data-text={`圆角${data.style.borderBottomRightRadius}`}
            // @ts-ignore
            onMouseDown={(e) =>
              handleDragBorderRadius(e, 'borderBottomRightRadius')
            }
          />
          <div className={css.middlePoint} ref={middleNodeRef}></div>
        </>
      ) : null}
      <div
        className={`${css.innerText} mybricks-rectangle-text`}
        style={data.textStyle}
      >
        {data.text}
      </div>
      {data.asSlot ? slots['container'].render() : null}
    </div>
  )
}
