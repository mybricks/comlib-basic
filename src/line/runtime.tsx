import React, { useMemo } from 'react'
import { LineProps } from './constants'
import Style from './runtime.less'

export default function ({ data, style, env }: RuntimeParams<LineProps>) {
  const position = useMemo(() => {
    const width = parseFloat(style.width),
      height = parseFloat(style.height)

    let x1 = 0,
      y1 = 0,
      x2 = width,
      y2 = height
    if (data.heightReverse && data.widthReverse) {
      return [
        [x1, y1],
        [x2, y2],
      ]
    }
    if (data.heightReverse) {
      ;(y1 = height), (x2 = width), (y2 = 0)
    }
    if (data.widthReverse) {
      ;(y1 = height), (x2 = width), (y2 = 0)
    }
    return [
      [x1, y1],
      [x2, y2],
    ]
  }, [data.widthReverse, data.heightReverse, style.width, style.height])

  return (
    <div className={Style.warrper}>
      <Line
        width={style.width}
        height={style.height}
        position={position}
        type={data.type}
        strokeWidth={data.lineWidth ?? 1}
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
