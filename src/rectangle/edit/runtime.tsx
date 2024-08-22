import React, {
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
// 圆角控制器的半径
const BorderRadiosClientWidthHalf = BorderRadiusClientWidth / 2

//
const DEFAULT_GAP = 200
const DEFAULT_RADIUS_GAP = calculateHypotenuse(DEFAULT_GAP)

/** 已知直角等腰三角形的等腰边长度，计算它的斜边长度 */
function calculateHypotenuse(equalSide) {
  // 根据公式 c = a * sqrt(2)
  const hypotenuse = equalSide * Math.sqrt(2)
  return hypotenuse
}

/** 已知直角等腰三角形的斜边长度，计算其它两边长度 */
function calculateEqualSides(hypotenuse) {
  // 根据公式 a = c * (sqrt(2) / 2)
  const equalSide = hypotenuse * (Math.sqrt(2) / 2)
  return equalSide
}

/** 计算两点之间的距离 */
function distance(a, b) {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2))
}

/** 寻找鼠标移动方向中最近的点 */
function findClosestVertex(rectanglePoints, mouseMovements) {
  const lastMousePosition = mouseMovements[mouseMovements.length - 1]

  let closestVertex = null
  let minDistance = Infinity

  rectanglePoints.forEach((point) => {
    const dist = distance(point, lastMousePosition)
    if (dist < minDistance) {
      minDistance = dist
      closestVertex = point
    }
  })

  return closestVertex
}

export default function ({ data, slots, style, env }) {
  const tlMiddleRef = useRef<HTMLDivElement>(null),
    tlNodeRef = useRef<HTMLDivElement>(null),
    trNodeRef = useRef<HTMLDivElement>(null),
    blNodeRef = useRef<HTMLDivElement>(null),
    brNodeRef = useRef<HTMLDivElement>(null)

  const [draggingRadius, setDraggingRadius] = useState(0)

  const [movingDirection, setMovingDirection] = useState('')

  const scale = useMemo(() => {
    return env.canvas?.scale ?? 1
  }, [env.canvas?.scale])

  // 高度小于 60 不显示控制器
  const radiusEditVisible = useMemo(() => {
    const min = Math.min(style.width, style.height)
    return min > 60
  }, [style.width, style.height])


  // 控制器最大可以达到的 translate
  const maxTranslateLimit = useMemo(() => {
    const shortSideLength = Math.min(style.width, style.height)
    return (
      (shortSideLength -
        parseFloat(data?.style?.borderLeftWidth ?? 0) * 2 -
        BorderRadiusHandleGap * 2 -
        BorderRadiosClientWidthHalf * 2) /
      2
    )
  }, [data?.style?.borderTopLeftWidth, style.width, style.height])

  // 从当前的半径长度来计算控制器落点的 translate
  const borderTranslate = useMemo(() => {
    return Math.min(
      maxTranslateLimit,
      Math.max(0, calculateEqualSides(draggingRadius))
    )
  }, [draggingRadius, maxTranslateLimit])

  const moveInfoRef = useRef<any>({
    borderRadiusDirection: '',
    corner: null,
    mouseMovements: [],
  })

  const handleDragBorderRadius = useCallback((e) => {
    dragable(e, ({ dpo, origin }, state) => {
      if (state === 'start') {
        // 重置拖动信息
        moveInfoRef.current = {
          borderRadiusDirection: '',
          corner: null,
          count: 0,
          mouseMovements: [],
        }
      }


      if (moveInfoRef.current.count < 5) {
        moveInfoRef.current.mouseMovements.push({ x: origin.x, y: origin.y })
        moveInfoRef.current.count += 1;
      }

      // 说明是第N次进来，可以判断鼠标移动方向了，仅判断一次，决定选择哪个点
      if (moveInfoRef.current.count === 4) {
        const tl = tlNodeRef.current?.getBoundingClientRect()
        const tr = trNodeRef.current?.getBoundingClientRect()
        const bl = blNodeRef.current?.getBoundingClientRect()
        const br = brNodeRef.current?.getBoundingClientRect()
        const point = findClosestVertex(
          [
            {
              type: 'borderTopLeftRadius',
              x: tl?.x,
              y: tl?.y,
            },
            {
              type: 'borderTopRightRadius',
              x: tr?.x,
              y: tr?.y,
            },
            {
              type: 'borderBottomLeftRadius',
              x: bl?.x,
              y: bl?.y,
            },
            {
              type: 'borderBottomRightRadius',
              x: br?.x,
              y: br?.y,
            },
          ],
          moveInfoRef.current.mouseMovements
        )

        if (point?.type) {
          setMovingDirection(point.type)
          switch (point.type) {
            case 'borderTopLeftRadius':
              moveInfoRef.current.corner =
                tlNodeRef.current?.getBoundingClientRect()
              break
            case 'borderTopRightRadius':
              moveInfoRef.current.corner =
                trNodeRef.current?.getBoundingClientRect()
              break
            case 'borderBottomLeftRadius':
              moveInfoRef.current.corner =
                blNodeRef.current?.getBoundingClientRect()
              break
            case 'borderBottomRightRadius':
              moveInfoRef.current.corner =
                brNodeRef.current?.getBoundingClientRect()
              break
          }
        }
      }

      if (state === 'ing' && moveInfoRef.current.corner) {
        const radius = Math.max(
          0,
          distance(moveInfoRef.current.corner, origin) / (env.canvas?.scale ?? 1) - DEFAULT_RADIUS_GAP
        )
        setDraggingRadius(radius)
      }

      if (state === 'finish') {
        // 重置拖动信息
        moveInfoRef.current = {
          borderRadiusDirection: '',
          corner: null,
          count: 0,
          mouseMovements: [],
        }
        setMovingDirection('')
      }
    })
    e.stopPropagation()
  }, [])

  const cornerGap = useMemo(() => {
    return BorderRadiusHandleGap - DEFAULT_GAP
  }, [])

  // 当前形状最大圆角（即半径长度）
  const maxRadiusLendth = useMemo(() => {
    const shortSideLength = Math.min(style.width, style.height)
    return (shortSideLength - parseFloat(data?.style?.borderLeftWidth ?? 0) * 2) / 2
  }, [data?.style?.borderTopLeftWidth, style.width, style.height])

  // 控制器可拖动的半径总长度
  const [draggingRadiusLength, setDraggingRadiusLength] = useState(0)
  useEffect(() => {
    if (!tlMiddleRef.current || !tlNodeRef.current) {
      return
    }
    const draggingRadiusLength =
      distance(
        tlMiddleRef.current.getBoundingClientRect(),
        tlNodeRef.current.getBoundingClientRect()
      ) / (env.canvas?.scale ?? 1) -
      DEFAULT_RADIUS_GAP
      + BorderRadiosClientWidthHalf
      + calculateHypotenuse(BorderRadiusHandleGap)
    setDraggingRadiusLength(draggingRadiusLength)
  }, [env.canvas?.scale])
  // 计算两个长度的比例，用于计算真正的圆角大小
  const lengthRatio = useMemo(() => {
    return draggingRadiusLength / maxRadiusLendth
  }, [maxRadiusLendth, draggingRadiusLength])

  // 拖拽过程中计算真正的圆角数值
  useEffect(() => {
    if (!!!moveInfoRef.current.corner) { // 注意一定是拖拽过程中
      return
    }

    const realRadius = Math.min(
      maxRadiusLendth,
      Math.round(draggingRadius / lengthRatio)
    )

    if (!data.style) {
      data.style = {}
    }

    data.style.borderTopLeftRadius = `${realRadius}px`;
    data.style.borderTopRightRadius = `${realRadius}px`;
    data.style.borderBottomLeftRadius = `${realRadius}px`;
    data.style.borderBottomRightRadius = `${realRadius}px`;
  }, [draggingRadius, lengthRatio, maxRadiusLendth])

  // 各类影响圆角重新计算的触发逻辑，重新计算拖拽控制器的位置
  useEffect(() => {
    if (!!moveInfoRef.current.corner) { // 注意一定是非拖拽过程中计算
      return
    }
    const dragRadius = parseFloat(data.style.borderTopLeftRadius ?? 0) * lengthRatio;
    setDraggingRadius(dragRadius)
  }, [style.width, style.height, lengthRatio, data?.style?.borderTopLeftRadius, data?.style?.borderTopLeftWidth])


  return (
    <div
      className={`${css.rectangle} ${!!movingDirection ? css.show : ''}`}
      style={{ ...(data?.style ?? {}) }}
    >
      {radiusEditVisible ? (
        <>
          <div
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
            onMouseDown={handleDragBorderRadius}
          />
          <div
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
            onMouseDown={handleDragBorderRadius}
          />
          <div
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
            onMouseDown={handleDragBorderRadius}
          />
          <div
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
            onMouseDown={handleDragBorderRadius}
          />
          <div
            className={css.corner}
            ref={tlNodeRef}
            style={{ top: cornerGap, left: cornerGap }}
          />
          <div
            className={css.corner}
            ref={trNodeRef}
            style={{ top: cornerGap, right: cornerGap }}
          />
          <div
            className={css.corner}
            ref={blNodeRef}
            style={{
              bottom: cornerGap,
              left: cornerGap,
            }}
          />
          <div
            className={css.corner}
            ref={brNodeRef}
            style={{
              bottom: cornerGap,
              right: cornerGap,
            }}
          />

          <div
            className={css.tlmiddle}
            ref={tlMiddleRef}
            style={{
              top: maxTranslateLimit,
              left: maxTranslateLimit,
            }}
          />
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
