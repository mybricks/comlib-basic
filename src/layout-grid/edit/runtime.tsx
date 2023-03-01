import React, {useCallback, useEffect} from 'react';
import css from './css.less'
import {CellWidthTypeEnum} from "../../layout/const";
import {dragable} from "../../utils";
import {refleshPercent} from "../../layout/edit/edtUtils";
import { getColOutputId, getRowOutputId } from './util'

export default (props: T_Props) => {
  const {env, data, slots, inputs, outputs} = props

  return (
    <div className={css.layout}>
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

  return (
    <div className={css.row} style={style} {...rowProps}>
      {
        cols.map((col, index) => {
          return <Col key={col.id} col={col} row={row}
                      props={props}/>
        })
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

        nextCol = row.cols[row.cols.indexOf(col) + 1]
        nextColEle = e.target.parentNode.nextSibling

        nextWidth = nextColEle.offsetWidth

        editFinish = env.edit.focusPaasive()
      } else if (state === 'ing') {
        //if (nowWidth >= 10) {
        col.width = nowWidth += dpo.dx
        nextCol.width = nextWidth -= dpo.dx
        //}
      } else if (state === 'finish') {
        if (editFinish) {
          editFinish()
        }
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
  
  const isLastOne = row.cols.indexOf(col) === row.cols.length - 1

  return (
    <div className={css.col} style={style} data-col-id={col.id}>
      {
        slots[col.id].render({ style: layoutStyle })
      }
      {
        !isLastOne ? (
          <div className={css.resizeW}
               onMouseDown={e => dragW(e)}>
          </div>
        ) : null
      }
    </div>
  )
}


