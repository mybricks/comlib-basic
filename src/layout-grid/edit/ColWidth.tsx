import React, { useState } from 'react'
import css from './ColWidth.less'

export enum WidthType {
  CUSTOM = 'custom',
  AUTO = 'auto'
}

export default function ({ data, col, focusArea }) {
  const [_colWidth, setColWidth] = useState(col.width)

  return (
    <div className={css.colWidth}>
      <div className={css.radio}>
        <input
          type="radio"
          value={WidthType.AUTO}
          checked={_colWidth === WidthType.AUTO}
          onChange={(e) => {
            if (e.target.value) {
              col.width = WidthType.AUTO
              setColWidth(WidthType.AUTO)
            }
          }}
        />
        <label>自适应宽度</label>
      </div>
      <div className={css.radio}>
        <input
          type="radio"
          value={WidthType.CUSTOM}
          checked={typeof _colWidth === 'number'}
          onChange={(e) => {
            if (e.target.value === WidthType.CUSTOM) {
              if (!focusArea?.ele?.getBoundingClientRect) {
                return
              }
              const { width } = focusArea?.ele?.getBoundingClientRect()
              col.width = width
              setColWidth(width)
            }
          }}
        />
        <label>固定宽度</label>
      </div>
    </div>
  )
}