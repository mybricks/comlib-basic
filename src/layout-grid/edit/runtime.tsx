import React, {useCallback, useEffect, useMemo} from 'react';
import {CellWidthTypeEnum} from "../../layout/const";
import {dragable} from "../../utils";
import {refleshPercent} from "../../layout/edit/edtUtils";
import { getColOutputId, getRowOutputId } from './util'

import css from './../css.less'

/** edit相关的CSS */
import editCss from './css.less'

export default (props: T_Props) => {
  const {env, data, slots, inputs, outputs} = props

  return (
    <div className={css.layout} style={data.style}>
      {
        data.rows.map((row, index) => {
          return <Row key={row.id} row={row} props={props}/>
        })
      }
    </div>
  )
}

function Row({row, props}: { props: T_Props }) {
  const {data, slots, env, outputs} = props
  const cols = row.cols

  const dragH = useCallback((e) => {
    let editFinish

    let nextRow, nextRowEle, nowHeight, nextHeight
    dragable(e, ({po, eo, dpo}, state) => {
      if (state === 'start') {
        const rowEle = e.target.parentNode
        nowHeight = rowEle.offsetHeight

        // nextRow = data.rows[data.rows.indexOf(row) + 1]
        // nextRowEle = e.target.parentNode.nextSibling

        // nextHeight = nextRowEle.offsetHeight

        editFinish = env.edit.focusPaasive()

        row.isDragging = true
        // nextRow.isDragging = true
      } else if (state === 'ing') {
        //if (nowHeight >= 10) {
        row.height = nowHeight += dpo.dy
        // nextRow.height = nextHeight -= dpo.dy
        //}
      } else if (state === 'finish') {
        if (editFinish) {
          editFinish()
        }
        
        row.isDragging = false
        // nextRow.isDragging = false
      }
    })
    e.stopPropagation()
  }, [])

  /** 与响应式对象解耦，防止修改源对象 */
  const style = JSON.parse(JSON.stringify(row?.style ?? {}))
  if (row.height === 'auto') {
    style.flex = 1
  } else if (typeof row.height === "number") {
    style.height = row.height
  }

  let rowProps = {}
  if (data.rows.length > 1) {
    rowProps['data-row-id'] = row.id
  }

  /** 相同列是否有正在拖动的元素 */
  const hasDragTarget = data.rows.some(_row => _row.isDragging)
  /** 拖动的元素是否是当前元素 */
  const isDragTarget = row.isDragging

  return (
    <div className={css.row} style={style} {...rowProps}>
      {
        cols.map((col, index) => {
          return <Col key={col.id} col={col} row={row}
                      props={props}/>
        })
      }
      <div
        className={editCss.resizeH}
        onMouseDown={e => dragH(e)}>
      </div>
      {
        hasDragTarget && <div className={isDragTarget ? editCss.draggingTipH : `${editCss.draggingTipH} ${editCss.dashed}`}>{row.height}</div>
      }
    </div>
  )
}

function Col({col, row, props}: { props: T_Props }) {
  const {env, slots, data, outputs} = props

  const dragW = useCallback((e) => {
    let editFinish

    let nextCol, nextColEle, nowWidth, nextWidth
    dragable(e, ({po, eo, dpo}, state) => {
      if (state === 'start') {
        const colEle = e.target.parentNode
        nowWidth = colEle.offsetWidth

        // nextCol = row.cols[row.cols.indexOf(col) + 1]
        // nextColEle = e.target.parentNode.nextSibling

        // nextWidth = nextColEle.offsetWidth

        editFinish = env.edit.focusPaasive()

        col.isDragging = true
        // nextCol.isDragging = true
      } else if (state === 'ing') {
        //if (nowWidth >= 10) {
        col.width = nowWidth += dpo.dx
        // nextCol.width = nextWidth -= dpo.dx
        //}
      } else if (state === 'finish') {
        if (editFinish) {
          editFinish()
        }

        col.isDragging = false
        // nextCol.isDragging = false
      }
    })
    e.stopPropagation()
  }, [])


  /** 与响应式对象解耦，防止下方修改源对象 */
  const style = JSON.parse(JSON.stringify(col?.style ?? {}))

  if (col.width === 'auto') {
    style.flex = 1
  } else if (typeof col.width === "number") {
    style.width = col.width
  }

  /** 获取col的布局属性，优先级为col > row > data */
  const layoutStyle = { ...(data?.layout ?? {}), ...(row?.layout ?? {}), ...(col?.layout ?? {}) }

  const colProps = {}
  if (Array.isArray(row.cols) && row.cols.length > 1) {
    colProps['data-col-id'] = col.id
  }

  /** 相同行是否有正在拖动的元素 */
  const hasDragTarget = row.cols.some(_col => _col.isDragging)
  /** 拖动的元素是否是当前元素 */
  const isDragTarget = col.isDragging

  return (
    <div className={css.col} style={style} {...colProps}>
      {
        slots[col.id].render({ style: layoutStyle })
      }
      <div
        className={editCss.resizeW}
        onMouseDown={e => dragW(e)}>
      </div>
      {
        hasDragTarget && <div className={isDragTarget ? editCss.draggingTipW : `${editCss.draggingTipW} ${editCss.dashed}`}>{col.width}</div>
      }
    </div>
  )
}


