import React, { useMemo } from 'react'
import { LineProps } from './constants'
import Style from './runtime.less'

export default function ({ data, style, env }: RuntimeParams<LineProps>) {
  
  const lineWidth = useMemo(() => {
    return data.lineWidth ?? 1;
  }, [data.lineWidth])

  // 画对角线
  const position = useMemo(() => {
    const width = parseFloat(style.width),
      height = parseFloat(style.height)

    // 第二象限
    let x1 = 0,
      y1 = 0,
      x2 = width,
      y2 = height
    // 第四象限
    if (data.heightReverse && data.widthReverse) {
      return [
        [x1, y1],
        [x2, y2],
      ]
    }
    // 第一象限
    if (data.heightReverse) {
      ;(y1 = height), (x2 = width), (y2 = 0)
    }
    // 第三象限
    if (data.widthReverse) {
      ;(y1 = height), (x2 = width), (y2 = 0)
    }
    return [
      [x1, y1],
      [x2, y2],
    ]
  }, [data.widthReverse, data.heightReverse, style.width, style.height])

  // 修正宽 / 高正好等于线宽的情况下，不能使用对角线，而是应该直接画线
  const fixPostion = useMemo(() => {
    const [a, b] = position;
    const xGap = Math.abs(a[0] - b[0]);
    const yGap = Math.abs(a[1] - b[1]);
    if (xGap === lineWidth) {
      return [[xGap / 2, a[1]], [xGap / 2, b[1]]]
    } else if (yGap === lineWidth) {
      return [[a[0], yGap / 2], [b[0], yGap / 2]]
    }
    return position
  }, [position, lineWidth])

  return (
    <div className={Style.warrper}>
      <Line
        width={style.width}
        height={style.height}
        position={fixPostion}
        type={data.type}
        strokeWidth={lineWidth}
        stroke={data.color}
        supportHover={env.edit}
      />
    </div>
  )
}

const Line = ({
  width,
  height,
  position,
  type,
  strokeWidth,
  stroke,
  supportHover = false,
}) => {
  const strokeDasharray = useMemo(() => {
    switch (type) {
      case 'dashed':
        return '6 3'
      case 'dotted':
        return '1 2'
      default:
        return 'none'
    }
  }, [type])

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      <svg
        className={`${supportHover ? Style.supportHover : ''}`}
        style={{ width, height, position: 'absolute', top: 0, left: 0 }}
      >
        {/* 实际线条 */}
        <path
          className={`${Style.line}`}
          d={`M ${parseFloat(position[0][0])} ${parseFloat(
            position[0][1]
          )} L ${parseFloat(position[1][0])} ${parseFloat(position[1][1])}`}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
        />
        {/* hover用的线条，增加hover面积 */}
        <path
          className={Style.hoverLine}
          d={`M ${parseFloat(position[0][0])} ${parseFloat(
            position[0][1]
          )} L ${parseFloat(position[1][0])} ${parseFloat(position[1][1])}`}
          stroke={'transparent'}
          strokeWidth={strokeWidth + 20}
        />
      </svg>
    </div>
  )
}
