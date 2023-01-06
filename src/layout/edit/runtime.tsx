/**
 * MyBricks Opensource
 * https://mybricks.world
 * This source code is licensed under the MIT license.
 *
 * CheMingjun @2019
 * mybricks@126.com
 */
import React, {
  useRef,
  useState,
  useEffect,
  useCallback
} from 'react'

import Table from './table'
import { calculateTds } from './edtUtils'
import { isNumber, dragable, getPosition } from '../../utils'

import css from './index.less'

export default function ({env, data, style, slots}): JSX.Element {
  /** 鼠标点中拖动框选单元格信息 */
  const [dragPo, setDragPo] = useState<{ style, colIds }>()
  /** 组件 */
  const layoutEl = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (data._editCol) {
      // 选中列
      const ele = (layoutEl.current as HTMLDivElement).querySelector(`div[data-col-id]`) as HTMLDivElement

      ele.click()
      env.edit.regBlur(() => {
        data._editCol = void 0
      })
    }
  }, [data._editCol])

  useEffect(() => {
    if (data._editRow) {
      // 选中行
      const ele = (layoutEl.current as HTMLDivElement).querySelector(`div[data-row-id]`) as HTMLDivElement

      ele.click()
      env.edit.regBlur(() => {
        data._editRow = void 0
      })
    }
  }, [data._editRow])

  useEffect(() => {
    const { height } = style;
    if (isNumber(height)) {
      let rowsHeight = data.rows.reduce((c, s) => {
        return c + (s.height || 0)
      }, 8)
      rowsHeight = height < rowsHeight ? rowsHeight : height
      style.height = rowsHeight
      data.height = rowsHeight
    }
  }, [style.height])
  /** TODO style内width以及height的变更，不会在editor中响应，(上下两个useEffect是不是可以去掉) */
  useEffect(() => {
    const { width } = style;
    if (isNumber(width)) {
      let colsWidth = data.cols.reduce((c, s) => {
        return c + (s.width || 0)
      }, 8)
      colsWidth = width < colsWidth ? colsWidth : width
      style.width = colsWidth
      data.width = colsWidth
    }
  }, [style.width])

  /**
   * 拖动框选单元格
   */
  const dragTd: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void = useCallback(e => {
    if (env.edit.focusArea) {
      // 需要聚焦后才可以拖动
      const tableEl = layoutEl.current as HTMLElement
      let tablePo, startPo, tStyle, editFinish
      dragable(e, ({po, epo, dpo}, state) => {
        if (state === 'start') {
          tablePo = getPosition(tableEl)
          startPo = { x: epo.ex - tablePo.x, y: epo.ey - tablePo.y }
          editFinish = env.edit.focusPaasive()
        } else if (state === 'ing') {
          const finishPo = { x: epo.ex - tablePo.x, y: epo.ey - tablePo.y }
          const po = { x: Math.min(startPo.x, finishPo.x), y: Math.min(startPo.y, finishPo.y) }
          const aw = Math.abs(finishPo.x - startPo.x)
          const ah = Math.abs(finishPo.y - startPo.y)

          tStyle = calculateTds({ data }, { po, aw, ah }, tableEl)

          const {colIds, left, top, width, height} = tStyle

          setDragPo({
            style: {
              left,
              top,
              width,
              height
            },
            colIds
          })
        } else if (state === 'finish') {
          if (editFinish) {
            editFinish()
          }
          if (tStyle) {
            const po = {x: tStyle.left, y: tStyle.top}
            const {colIds, left, top, width, height} = calculateTds({data}, {
              po,
              aw: tStyle.width,
              ah: tStyle.height
            }, tableEl)

            setDragPo({
              style: {
                left,
                top,
                width,
                height
              },
              colIds
            })

            const ele = (layoutEl.current as HTMLDivElement).querySelector(`div[data-zone]`) as HTMLDivElement

            ele.click()
            env.edit.regBlur(() => {
              setDragPo(void 0)
            })
          }
        }
      })

      e.stopPropagation()
    }
  }, [env.edit.focusArea])

  return (
    <div
      ref={layoutEl}
      className={css.layout}
      style={{
        height: data.height,
        width: style.width === 'fit-content' ? data.width : style.width
      }}
    >
      <Table
        env={env}
        layoutEl={layoutEl}
        data={data}
        slots={slots}
        style={style}
        dragTd={dragTd}
      />

      {
        data._editCol ? (
          <div className={css.showCol}
               style={data._editCol.style}></div>
        ) : null
      }

      {
        data._editRow ? (
          <div className={css.showRow}
               style={data._editRow.style}></div>
        ) : null
      }

      {
        dragPo ? (
          <div className={css.showZone}
               style={dragPo.style}></div>
        ) : null
      }

      <div data-col-id={data._editCol?.id}/>
      <div data-row-id={data._editRow?.id}/>
      <div data-zone={JSON.stringify(dragPo?.colIds)}/>
    </div>
  )
}
