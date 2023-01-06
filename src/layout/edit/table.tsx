import React, { useState, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'

import { dragable } from '../../utils'
import { refleshPercent } from './edtUtils'
import { CellWidthTypeEnum } from '../const'

import css from './index.less'

/**
 * 表格
 */
export default function Table ({env, data, slots, style, layoutEl, dragTd}): JSX.Element {
  return (
    <table style={{...data.style}}>
      <tbody>
        <TrHead data={data}/>
        <TrRows
          env={env}
          data={data}
          slots={slots}
          style={style}
          layoutEl={layoutEl}
          dragTd={dragTd}
        />
      </tbody>
    </table>
  )
}

/** 表头 */
function TrHead ({data}): JSX.Element {
  return (
    <tr className={css.thead}>
      {
        data.cols.map((col, idx) => {
          const length = data.cols.length
          const style: any = {}
          if (length - 1 !== idx && col.cellWidthType !== CellWidthTypeEnum.Auto) {
            style.width = data.cellWidthType === CellWidthTypeEnum.Percent ? col.widthPercent : col.width
          }
          return (
            <td
              key={col.id}
              id={`col-${col.id}`}
              style={style}
              className={css.td}
            />
          )
        })
      }
    </tr>
  )
}

/** 内容（行） */
function TrRows ({data, env, slots, style, layoutEl, dragTd}): JSX.Element {
  const lastIdx = data.rows.length - 1
  return (
    <>
      {
        data.rows.map((row, idx) => {
          return (
            <Row
              key={row.id}
              env={env}
              data={data}
              slots={slots}
              style={style}
              row={row}
              layoutEl={layoutEl}
              dragTd={dragTd}
              isLastRow={lastIdx === idx}
            />
          )
        })
      }
    </>
  )
}

function Row({env, data, slots, style, row, dragTd, layoutEl, isLastRow}) {
  const [colSize, setColSize] = useState<{ width, height, po }>()

  /** 行 */
  const getTrProps = useCallback((row) => {
    const props: {[key: string]: any} = {}

    if (!(data.rows.length === 1 && data.rows[0].cols.length === 1)) {
      props['data-row-id'] = row.id
    }
    if (row.height) {
      props.style = {height: row.height}
    }

    return props
  }, [])

  /** 单元格 */
  const getTdProps = useCallback((row, col) => {
    const tdProps = {}

    tdProps['data-col-id'] = col.id
    tdProps['data-row-id'] = row.id

    return tdProps
  }, [])

  /** 拖宽 */
  const dragW = useCallback((e, col) => {
    const styleWidth = layoutEl.current.parentElement.clientWidth
    const { cols, rows, cellWidthType } = data
    const defRow = rows.find(def => {
      return def.cols.find((def) => def.defId === col.defId)
    })

    let defCol = data.cols.find(def => def.id === col.defId)

    if (col.colSpan) {//考虑到跨列的情况
      defCol = data.cols[data.cols.indexOf(defCol) + col.colSpan - 1]
    }

    const tdPo = e.target.parentElement.getBoundingClientRect();

    if (typeof defCol.width === 'undefined') {
      let width = cols.slice(0, cols.length - 1).reduce((c, s) => {
        return c - s.width
      }, styleWidth)
      if (cellWidthType === CellWidthTypeEnum.Percent) {
        width = `${((width / styleWidth) * 100).toFixed(2)}%`
      }
      setColSize({
        width,
        height: defRow?.height || data.height,
        po: {
          left: tdPo.x + (tdPo.width / 2),
          top: tdPo.y + tdPo.height + 10
        }
      })
    } else {
      const width = cellWidthType === CellWidthTypeEnum.Percent ? defCol.widthPercent : defCol.width
      setColSize({
        width,
        height: defRow?.height || data.height,
        po: {
          left: tdPo.x + (tdPo.width / 2),
          top: tdPo.y + tdPo.height + 10
        }
      })
    }

    let width = defCol.width || style.width
    let editFinish
    let allValidWidth = 0

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
          if (cellWidthType === CellWidthTypeEnum.Percent) {
            refleshPercent({cols: data.cols, styleWidth})
          }
        }
      } else if (state === 'ing') {
        width += dpo.dx

        if (defCol.width) {
          if (width > 10) {
            defCol.width = width
            let lastWidth = width
            if (cellWidthType === CellWidthTypeEnum.Percent) {
              refleshPercent({cols: data.cols, styleWidth})
              lastWidth = defCol.widthPercent
            }
            setColSize((colSize) => {
              if (!colSize) return void 0
              const { po, ...other } = colSize;
              return {
                ...other,
                width: lastWidth,
                po: {
                  ...po,
                  left: tdPo.x + (lastWidth / 2),
                }
              }
            })
          }
        } else {
          if (width - allValidWidth > 10) {
            style.width = width
            let lastWidth = cols.slice(0, cols.length - 1).reduce((c, s) => {
              return c - s.width
            }, width)
            if (cellWidthType === CellWidthTypeEnum.Percent) {
              refleshPercent({cols: data.cols, styleWidth: width})
              lastWidth = `${((lastWidth / width) * 100).toFixed(2)}%`
            }
            setColSize((colSize) => {
              if (!colSize) return void 0
              const { po, ...other } = colSize;
              return {
                ...other,
                width: lastWidth,
                po: {
                  ...po,
                  left: tdPo.x + (lastWidth / 2),
                }
              }
            })
          }
        }

      } else if (state === 'finish') {
        setColSize(void 0)
        if (editFinish) {
          editFinish()
        }
      }
    })
    e.stopPropagation()
  }, [])

  /** 拖高 */
  const dragH = useCallback((e, row, col) => {
    const styleWidth = layoutEl.current.parentElement.clientWidth
    const { cols, rows, cellWidthType } = data
    let editFinish

    let moveRow = row

    if (col.rowSpan) {//考虑到跨行的情况
      moveRow = data.rows[data.rows.indexOf(row) + col.rowSpan - 1]
    }

    let defCol = data.cols.find(def => def.id === col.defId)

    if (col.colSpan) {//考虑到跨列的情况
      defCol = data.cols[data.cols.indexOf(defCol) + col.colSpan - 1]
    }

    let height = moveRow.height || style.height
    let allValidHeight = 0

    const tdPo = e.target.parentElement.getBoundingClientRect();

    if (typeof defCol.width === 'undefined') {
      let width = cols.slice(0, cols.length - 1).reduce((c, s) => {
        return c - s.width
      }, styleWidth)
      if (cellWidthType === CellWidthTypeEnum.Percent) {
        width = `${((width / styleWidth) * 100).toFixed(2)}%`
      }
      setColSize({
        width,
        height,
        po: {
          left: tdPo.x + (tdPo.width / 2),
          top: tdPo.y + tdPo.height + 10
        }
      })
    } else {
      const width = cellWidthType === CellWidthTypeEnum.Percent ? defCol.widthPercent : defCol.width
      setColSize({
        width,
        height,
        po: {
          left: tdPo.x + (tdPo.width / 2),
          top: tdPo.y + tdPo.height + 10
        }
      })
    }

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
            setColSize((colSize) => {
              if (!colSize) return void 0
              const { po, ...other } = colSize;
              return {
                ...other,
                height,
                po: {
                  ...po,
                  top: tdPo.y + height + 10,
                }
              }
            })
          }
        } else {
          if (height - allValidHeight > 10) {
            style.height = height
            data.height = height
            
            let lastHeight = rows.slice(0, cols.length - 1).reduce((c, s) => {
              return c - s.height
            }, height)

            setColSize((colSize) => {
              if (!colSize) return void 0
              const { po, ...other } = colSize;
              return {
                ...other,
                height,
                po: {
                  ...po,
                  top: tdPo.y + lastHeight + 10,
                }
              }
            })
          }
        }
      } else if (state === 'finish') {
        setColSize(void 0)
        if (editFinish) {
          editFinish()
        }
      }
    })
    e.stopPropagation()
  }, [])

  return (
    <>
      <tr key={row.id} id={`row-${row.id}`} {...getTrProps(row)}>
        {
          row.cols.map((col, idx) => {
            let defCol = data.cols.find(def => def.id === col.defId)

            if (col.colSpan) {//考虑到跨列的情况 
              defCol = data.cols[data.cols.indexOf(defCol) + col.colSpan - 1]
            }

            return (
              <td 
                key={col.id}
                id={`col-${col.id}`}
                {...getTdProps(row, col)}
                colSpan={col.colSpan}
                rowSpan={col.rowSpan}
                className={css.td}
                onMouseDown={dragTd}
              >
                {slots[col.id].render({style: {...col.style}})}
                {
                  (idx < row.cols.length - 1 || typeof style.width === 'number') && defCol.cellWidthType !== CellWidthTypeEnum.Auto ? (
                    <div className={css.resizeW} onMouseDown={e => dragW(e, col)} onMouseUp={() => setColSize(void 0)}>
                    </div>
                  ) : null
                }
                {
                  !isLastRow || typeof style.height === 'number' ? (
                    <div className={css.resizeH} onMouseDown={e => dragH(e, row, col)} onMouseUp={() => setColSize(void 0)}>
                    </div>
                  ) : null
                }
              </td>
            )
          })
        }
      </tr>
      <ResizeTip colSize={colSize}/>
    </>
  )
}

/** 宽高提示  */
function ResizeTip ({colSize}): JSX.Element {
  const render: JSX.Element = useMemo(() => {
    if (!colSize) return <></>

    const {
      // 展示的数据
      width,
      height,
      // 位置,
      po
    } = colSize

    return (
      createPortal(
        (
          <div
            className={css.resizeTip}
            style={{...po}}
          >{width} x {height}</div>
        ),
        document.body
      )
    )
  }, [colSize])

  return render;
}
