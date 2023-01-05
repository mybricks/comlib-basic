import React, {Fragment, useMemo,useCallback} from "react";
import {dragable, getPosition, uuid} from "../../utils";
import { WidthUnitEnum } from '../const';
import {calculateTds, resetLayout, refleshPx, refleshPercent} from "./edtUtils";

import css from './editTips.less'

export function Tips({data, style, slots, element}) {
  useMemo(() => {
    requestAnimationFrame(() => {
      if (data.cellWidthType === WidthUnitEnum.Percent) {
        refleshPx({cols: data.cols, styleWidth: element.parentElement.clientWidth})
      } else {
        refleshPercent({cols: data.cols, styleWidth: element.parentElement.clientWidth})
      }
    })
  }, [])
  return (
    <>
      <ColTips data={data} slots={slots} element={element} style={style}/>
      <RowTips data={data} slots={slots} element={element} style={style}/>
      <Radius data={data}/>
    </>
  )
}

function Radius({data}) {
  const changeRadius = useCallback((e, order) => {
    const ele = e.target

    let dx, dy
    let oriPo
    dragable(e, ({po, epo, dpo}, state) => {
      if (state === 'start') {
        dx = 0
        dy = 0
        if (order === 0) {
          oriPo = {
            left: parseInt(ele.style.left),
            top: parseInt(ele.style.top)
          }
        }

      } else if (state === 'ing') {
        dx += dpo.dx
        dy += dpo.dy

        if (order === 0) {
          ele.style.left = oriPo.left + dx + 'px'
          ele.style.top = oriPo.top + dy + 'px'
        }

        if (dx > 0 && dy > 0) {
          const td = Math.min(dx, dy)

          data.style.borderRadius = Math.round(Math.sqrt(td * td * 2))
        }

        //console.log(dx, dy,data.style.borderRadius)

      } else if (state === 'finish') {

      }
    })
  }, [])

  //const plt = Math.max(data.style.borderRadius, 5)
  return (
    <>
      <div className={css.radius0}
           style={{left: 5, top: 5}}
           data-mybricks-tip={`圆角`}
           onMouseDown={e => changeRadius(e, 0)}></div>
      {/*<div className={css.radius1}*/}
      {/*     style={{right: 5, top: 5}}*/}
      {/*     onMouseDown={e => changeRadius(e, 1)}></div>*/}
      {/*<div className={css.radius2}*/}
      {/*     style={{right: 5, bottom: 5}}*/}
      {/*     onMouseDown={e => changeRadius(e, 2)}></div>*/}
      {/*<div className={css.radius3}*/}
      {/*     style={{left: 5, bottom: 5}}*/}
      {/*     onMouseDown={e => changeRadius(e, 3)}></div>*/}
    </>
  )
}

function RowTips({data, slots, style, element}) {
  const addRow = useCallback((e, row?) => {
    const newRow = _addRow(row, {data, slots, style, element})
    requestAnimationFrame(v => {
      editRow(e, newRow)
    })
  }, [])

  const editRow = useCallback((e, defRow) => {
    let curTop = 0
    data.rows.find(row => {
      if (row.id !== defRow.id) {
        curTop += row.height
      } else {
        return true
      }
    })

    const trEle = element.querySelector(`#row-${defRow.id}`)
    data._editRow = {
      id: defRow.id,
      style: {
        height: trEle.clientHeight,
        top: curTop
      }
    }

    e.stopPropagation()
  }, [])

  const rowTips = []
  const isStyleHeightIsNumber = typeof style.height === 'number'

  let curTop = 0
  data.rows.forEach((row, idx) => {
    const focusNow = data._editRow?.id === row.id

    rowTips.push(
      <div key={`${row.id}-tip`}
           className={css.tip}
           data-mybricks-tip={`{content:'添加行',position:'left'}`}
           style={{left: -10, top: curTop - 3}}
           onClick={e => addRow(e, row)}/>
    )

    if (idx === data.rows.length - 1) {//last col
      rowTips.push(
        <div key={`${row.id}-bar`}
             data-mybricks-tip={`{content:'选择行',position:'left'}`}
             className={`${css.rowBar} ${focusNow ? css.focusBar : ''} ${!row.height ? css.flexBar : ''}`}
             style={{
               top: curTop,
               height: isStyleHeightIsNumber ? style.height - curTop : void 0,
               bottom: isStyleHeightIsNumber ? void 0 : 0
             }}
             onClick={e => editRow(e, row)}/>
      )
    } else {
      rowTips.push(
        <div key={`${row.id}-bar`}
             data-mybricks-tip={`{content:'选择行',position:'left'}`}
             className={`${css.rowBar} ${focusNow ? css.focusBar : ''} ${!row.height ? css.flexBar : ''}`}
             style={{
               top: curTop,
               height: row.height
             }}
             onClick={e => editRow(e, row)}/>
      )
    }

    curTop += row.height || 0
  })

  rowTips.push(
    <div key={'last'}
         className={css.tip}
         data-mybricks-tip={`{content:'添加行',position:'left'}`}
         style={{
           left: -10,
           top: isStyleHeightIsNumber ? style.height - 3 : void 0,
           bottom: isStyleHeightIsNumber ? void 0 : -3
         }}
         onClick={e => addRow(e)}/>
  )

  return (
    <div key={'topRows'} className={css.rowTips}>
      {rowTips}
    </div>
  )
}

function ColTips({data, slots, style, element}) {
  const editCol = useCallback((e, defCol) => {
    let curLeft = 0
    data.cols.find(col => {
      if (col.id !== defCol.id) {
        curLeft += col.width || 0
      } else {
        return true
      }
    })

    const tdEle = element.querySelector(`#col-${defCol.id}`)
    data._editCol = {
      id: defCol.id,
      style: {
        width: tdEle?.clientWidth,
        left: curLeft
      }
    }

    e.stopPropagation()
  }, [])

  const addCol = useCallback((e, col?) => {
    const newCol = _addCol(col, {data, slots, style, element})
    requestAnimationFrame(v => {
      editCol(e, newCol)
    })

  }, [])

  const isStyleWidthIsNumber = typeof style.width === 'number'

  const colTips = []

  let curLeft = 0

  data.cols.forEach((col, idx) => {
    const focusNow = data._editCol?.id === col.id

    colTips.push(
      <div key={`${col.id}-tip`}
           data-mybricks-tip={`{content:'添加列',position:'bottom'}`}
           className={css.tip}
           style={{bottom: -17, left: curLeft - 3}}
           onClick={e => addCol(e, col)}/>
    )

    if (idx === data.cols.length - 1) {//last col
      colTips.push(
        <div key={`${col.id}-bar`}
             data-mybricks-tip={`{content:'选择当前列',position:'bottom'}`}
             className={`${css.colBar} ${focusNow ? css.focusBar : ''} ${!col.width ? css.flexBar : ''}`}
             style={{
               left: curLeft,
               width: isStyleWidthIsNumber ? style.width - curLeft : void 0,
               right: isStyleWidthIsNumber ? void 0 : 0
             }}
             onClick={e => editCol(e, col)}/>
      )
    } else {
      colTips.push(
        <div key={`${col.id}-bar`}
             data-mybricks-tip={`{content:'选择当前列',position:'bottom'}`}
             className={`${css.colBar} ${focusNow ? css.focusBar : ''} ${!col.width ? css.flexBar : ''}`}
             style={
               {
                 left: curLeft, width: col.width
               }
             }
             onClick={e => editCol(e, col)}/>
      )
    }

    curLeft += col.width || 0
  })

  colTips.push(
    <div key={'last'}
         data-mybricks-tip={`{content:'添加列',position:'bottom'}`}
         className={css.tip}
         style={{
           bottom: -17,
           left: isStyleWidthIsNumber ? style.width - 3 : void 0,
           right: isStyleWidthIsNumber ? void 0 : -3
         }}
         onClick={e => addCol(e)}/>
  )

  return (
    <div key={'topCols'} className={css.colTips}>
      {colTips}
    </div>
  )
}

//--------------------------------------------------------------------

function _addCol(col, {data, slots, style, element}) {
  const isLayoutWidthNumber = typeof style.width === 'number'

  let newCol
  if (col) {//before
    const idx = data.cols.indexOf(col)
    newCol = {
      id: uuid(),
      width: 100
    }

    data.cols.splice(idx, -1, newCol)

    data.rows.forEach(row => {
      const cols = row.cols
      const colId = uuid()

      cols.splice(idx, -1, {
        id: colId,
        defId: newCol.id
      })

      slots.add({
        id: colId,
        title: '单元格'
      })
    })
  } else {//last one
    const lastColDef = data.cols[data.cols.length - 1]
    lastColDef.width = element.querySelector(`#col-${lastColDef.id}`).offsetWidth

    newCol = {
      id: uuid()
    }

    data.cols.push(newCol)

    data.rows.forEach(row => {
      const cols = row.cols
      const colId = uuid()

      cols.push({
        id: colId,
        defId: newCol.id
      })

      slots.add({
        id: colId,
        title: '单元格'
      })
    })
  }

  if (isLayoutWidthNumber) {
    style.width += 100
  } else {

  }

  resetLayout({data})

  const styleWidth = element.parentElement.clientWidth;
  if (data.cellWidthType === WidthUnitEnum.Percent) {
    refleshPercent({cols: data.cols, styleWidth, cover: true})
  } else {
    refleshPx({cols: data.cols, styleWidth, cover: true})
  }

  return newCol
}

function _addRow(row, {data, slots, style, element}) {
  const isLayoutWidthNumber = typeof style.width === 'number'

  const newRow = {
    id: uuid(),
    height: 100,
    cols: data.cols.map(defCol => {
      const newCol = {
        id: uuid(),
        defId: defCol.id
      }

      slots.add({
        id: newCol.id,
        title: '单元格'
      })

      return newCol
    })
  }

  if (row) {//before
    const idx = data.rows.indexOf(row)

    data.rows.splice(idx, -1, newRow)
  } else {//last one
    const lastRow = data.rows[data.rows.length - 1]
    lastRow.height = element.querySelector(`#row-${lastRow.id}`).offsetHeight

    data.rows.push(newRow)
  }

  if (isLayoutWidthNumber) {
    style.height += 100
  } else {

  }

  resetLayout({data})

  return newRow
}