/**
 * MyBricks Opensource
 * https://mybricks.world
 * This source code is licensed under the MIT license.
 *
 * CheMingjun @2019
 * mybricks@126.com
 */
import css from './css.lazy.less'
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {dragable, getPosition, uuid} from "../../utils";
import { calculateTds, widthTypeConversion, refleshPx, refleshPercent } from "./edtUtils";
import { WidthUnitEnum } from '../const';

export default function ({env, data, style, slots}) {
  const [dragPo, setDragPo] = useState<{ style, colIds }>()
  const layoutEl = useRef<HTMLElement>()

  // useMemo(() => {
  //   env.loadCSSLazy(css)//加载css
  // }, [])

  useEffect(() => {
    if (data._editCol) {
      const ele = layoutEl.current.querySelector(`div[data-col-id]`)
      ele.click()

      env.edit.regBlur(() => {
        data._editCol = void 0
      })
    }
  }, [data._editCol])

  useEffect(() => {
    if (data._editRow) {
      const ele = layoutEl.current.querySelector(`div[data-row-id]`)
      ele.click()

      env.edit.regBlur(() => {
        data._editRow = void 0
      })
    }
  }, [data._editRow])

  const dragTd = useCallback(e => {
    if (env.edit.focusArea) {
      const tableEl = layoutEl.current as HTMLElement
      let tablePo, startPo
      let tStyle
      let editFinish
      dragable(e, ({po, epo, dpo}, state) => {
        if (state === 'start') {
          tablePo = getPosition(tableEl)
          startPo = {x: epo.ex - tablePo.x, y: epo.ey - tablePo.y}
          editFinish = env.edit.focusPaasive()
        } else if (state === 'ing') {
          const finishPo = {x: epo.ex - tablePo.x, y: epo.ey - tablePo.y}

          const po = {x: Math.min(startPo.x, finishPo.x), y: Math.min(startPo.y, finishPo.y)}
          const aw = Math.abs(finishPo.x - startPo.x)
          const ah = Math.abs(finishPo.y - startPo.y)

          tStyle = calculateTds({data}, {po, aw, ah}, tableEl)

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

            const ele = layoutEl.current.querySelector(`div[data-zone]`)
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

  useEffect(() => {
    const { height } = style;
    const rowHeight = data.rows.reduce((c, s) => {
      return c + (s.height || 0)
    }, 0)

    let rstHeight = data.height;

    if (typeof height === 'number' && !isNaN(height)) {
      rstHeight = height;
    }
    if (rowHeight >= data.height ) {
      rstHeight = rowHeight + 100;
    }

    data.height = rstHeight;
    style.height = rstHeight;
  }, [style.height, data.rows]);

  return (
    <div className={css.layout} ref={layoutEl} style={{height: data.height}}>
      {/* <table style={{minHeight: style.height, ...data.style}}>
        <tbody style={{minHeight: style.height}}> */}
      <table style={{...data.style}}>
        <tbody>
        <tr className={css.thead}>
          {
            data.cols.map((col, idx) => {
              const length = data.cols.length
              const style: any = {};
              if (length - 1 !== idx) {
                style.width = data.cellWidthType === WidthUnitEnum.Percent ? col.widthPercent : col.width
              }
              return (
                <td id={`col-${col.id}`} key={col.id}
                    style={style}
                    className={css.td}>
                </td>
              )
            })
          }
        </tr>
        {
          data.rows.map(row => {
            return <Row key={row.id}
                        env={env}
                        data={data}
                        slots={slots}
                        style={style}
                        row={row}
                        dragTd={dragTd}/>
          })
        }
        </tbody>
      </table>

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
      {/*{tips}*/}
    </div>
  )
}


function Row({env, data, slots, style, row, dragTd}) {
  const focusTable = useCallback(e => {

  }, [])

  function getTrProps(row) {
    const props = {}
    if (!(data.rows.length === 1 && data.rows[0].cols.length === 1)) {
      props['data-row-id'] = row.id
    }

    if (row.height) {
      props.style = {height: row.height}
    }

    // if (idx !== row.cols.length - 1) {
    //   tdProps['style'] = {width: col.width}
    // }

    return props
  }

  function getTdProps(row, col, idx) {
    const tdProps = {}
    //if (!(data.rows.length === 1 && data.rows[0].cols.length === 1)) {
    tdProps['data-col-id'] = col.id
    tdProps['data-row-id'] = row.id
    //}

    // if (idx !== row.cols.length - 1) {
    //   tdProps['style'] = {width: col.width}
    // }

    return tdProps
  }

  const dragW = useCallback((e, col) => {
    let defCol = data.cols.find(def => def.id === col.defId)

    if (col.colSpan) {//考虑到跨列的情况
      defCol = data.cols[data.cols.indexOf(defCol) + col.colSpan - 1]
    }

    let width = defCol.width || style.width
    let editFinish
    let allValidWidth = 0
    const { cellWidthType } = data

    dragable(e, ({po, eo, dpo}, state) => {
      if (state === 'start') {
        editFinish = env.edit.focusPaasive()//打开组件，阻止focus样式绘制

        if (!defCol.width) {
          data.cols.forEach(def => {
            if (def.width) {
              allValidWidth += def.width
            }
          })
        } else {
          if (cellWidthType === WidthUnitEnum.Percent) {
            widthTypeConversion({col: defCol, styleWidth: style.width, widthType: cellWidthType})
          }

          // console.log('start')
          // if (data.cellWidthType === WidthUnitEnum.Percent) {
          //   refleshPx({cols: data.cols, styleWidth: style.width})
          // } else {
          //   refleshPercent({cols: data.cols, styleWidth: style.width})
          // }
        }
      } else if (state === 'ing') {
        width += dpo.dx

        if (defCol.width) {
          if (width > 10) {
            defCol.width = width
            if (cellWidthType === WidthUnitEnum.Percent) {
              widthTypeConversion({col: defCol, styleWidth: style.width, widthType: cellWidthType})
            }
            // console.log('ing1')
            // if (data.cellWidthType === WidthUnitEnum.Percent) {
            //   refleshPx({cols: data.cols, styleWidth: style.width})
            // } else {
            //   refleshPercent({cols: data.cols, styleWidth: style.width})
            // }
          }
        } else {
          if (width - allValidWidth > 10) {
            style.width = width
            if (cellWidthType === WidthUnitEnum.Percent) {
              refleshPercent({cols: data.cols, styleWidth: width})
            }
            // console.log('ing2')
            // if (data.cellWidthType === WidthUnitEnum.Percent) {
            //   refleshPx({cols: data.cols, styleWidth: style.width})
            // } else {
            //   refleshPercent({cols: data.cols, styleWidth: style.width})
            // }
          }
        }

      } else if (state === 'finish') {
        if (editFinish) {
          editFinish()
        }
      }
    })
    e.stopPropagation()
  }, [])

  const dragH = useCallback((e, row, col) => {
    let editFinish

    let moveRow = row

    if (col.rowSpan) {//考虑到跨行的情况
      moveRow = data.rows[data.rows.indexOf(row) + col.rowSpan - 1]
    }

    let height = moveRow.height || style.height
    let allValidHeight = 0

    dragable(e, ({po, eo, dpo}, state) => {
      if (state === 'start') {
        editFinish = env.edit.focusPaasive()//打开组件，阻止focus样式绘制

        if (!moveRow.height) {
          data.rows.forEach(row => {
            if (row.height) {
              allValidHeight += row.height
            }
          })
        }
      } else if (state === 'ing') {
        height += dpo.dy

        if (moveRow.height) {
          if (height > 5) {
            moveRow.height = height
          }
        } else {
          if (height - allValidHeight > 10) {
            style.height = height
          }
        }
      } else if (state === 'finish') {
        if (editFinish) {
          editFinish()
        }
      }
    })
    e.stopPropagation()
  }, [])

  const idx = data.rows.indexOf(row)
  const isLastRow = idx === data.rows.length - 1

  return (
    <tr key={row.id} id={`row-${row.id}`} {...getTrProps(row)}>
      {
        row.cols.map((col, idx) => {
          return (
            <td key={col.id}
                id={`col-${col.id}`}
                {...getTdProps(row, col, idx)}
                colSpan={col.colSpan}
                rowSpan={col.rowSpan}
                className={css.td}
                onClick={focusTable}
                onMouseDown={dragTd}
            >
              {slots[col.id].render({style: {...col.style}})}
              {
                idx < row.cols.length - 1 || typeof style.width === 'number' ? (
                  <div className={css.resizeW} onMouseDown={e => dragW(e, col)}>
                  </div>
                ) : null
              }
              {
                !isLastRow || typeof style.height === 'number' ? (
                  <div className={css.resizeH} onMouseDown={e => dragH(e, row, col)}>
                  </div>
                ) : null
              }
            </td>
          )
        })
      }
    </tr>
  )
}