import React, {useCallback, useEffect} from 'react';
import css from './css.less'
import {CellWidthTypeEnum} from "../../layout/const";
import {dragable} from "../../utils";
import {refleshPercent} from "../../layout/edit/edtUtils";

export default (props: T_Props) => {
  const {env, data, slots, inputs} = props

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
  const {data, slots} = props
  const cols = row.cols

  const style = {} as any

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
  const {env, slots, data} = props

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


  const style = {} as any

  if (col.width === 'auto') {
    style.flex = 1
  } else if (typeof col.width === "number") {
    style.width = col.width
  }

  const isLastOne = row.cols.indexOf(col) === row.cols.length - 1

  return (
    <div className={css.col} style={style} data-col-id={col.id}>
      {
        slots[col.id].render()
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


