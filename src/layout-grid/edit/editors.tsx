import {isNumber, uuid} from "../../utils";
import {CellWidthTypeEnum} from "../../layout/const";
import {resetEditCol, resetLayout} from "../../layout/edit/edtUtils";
import ColWidth from "./ColWidth";
import { getColOutputId, getRowOutputId } from './util'
import { CSSProperties } from "react";

export default {
  // '@init'({style}) {
  //   style.height = 50
  //   style.width = 100
  // },
  '@resize': {
    options: ['width', 'height']
  },
  ':root': [
    {
      title: '添加列',
      ifVisible({data}) {
        return data.rows.length === 1
      },
      type: 'button',
      value: {
        set({data, slots}) {
          const row = data.rows[0]
          const id = uuid(), title = `列${row.cols.length + 1}`

          row.cols.push({
            id,
            title
          })
          slots.add({
            id, title
          })
        }
      }
    },
    {
      title: '添加行',
      type: 'button',
      value: {
        set({data, slots}) {
          addRow({ data, slots, rowId: data.rows[data.rows.length - 1].id, type: 'AFTER', title: `行${data.rows.length + 1}` })
        }
      }
    },
    {},
    {
      title: '布局',
      type: 'layout',
      value: {
        get({data, slots, focusArea}) {
          return data.layout
        },
        set({data, slots, focusArea}, ly) {
          data.layout = ly

          data.rows.forEach(row => {
            row.cols.forEach(col => {
              /** 找到最终生效的CSS */
              const finalLayoutCss = { ...(data?.layout ?? {}), ...(row?.layout ?? {}), ...(col?.layout ?? {}) }
              const slot = slots.get(col.id)
              /** 根据最终生效的CSS设置布局 */
              setSlotLayoutByCss(slot, finalLayoutCss)
            })
          })
        }
      }
    },
    {},
    {
      title: '单击',
      type: '_Event',
      options: {
        outputId: 'click'
      }
    }
  ],
  'div[data-col-id]': {
    title: '列',
    items: [
      ({data}) => {
        return <ColWidth/>
      },
      {},
      {
        title: '样式',
        type: 'style',
        options: {
          defaultOpen: true,
          plugins: ['bgcolor']
        },
        value: {
          get({data, slots, focusArea}) {
            const colId = focusArea.dataset.colId
            return getCol(data, colId)?.style ?? {}
          },
          set({data, slots, focusArea}, value) {
            const colId = focusArea.dataset.colId
            const col = getCol(data, colId)
            col.style = value
          }
        }
      },
      {
        title: '布局',
        type: 'layout',
        value: {
          get({data, slots, focusArea}) {
            const colId = focusArea.dataset.colId
            const col = getCol(data, colId)
            return col.layout
          },
          set({data, slots, focusArea}, ly) {
            const colId = focusArea.dataset.colId
            const col = getCol(data, colId)
            col.layout = ly

            /** 设置layout属性 */
            const slot = slots.get(colId)
            setSlotLayoutByCss(slot, ly)
          }
        }
      },
      {},
      {
        title: '前移',
        type: 'button',
        ifVisible({data, focusArea}) {
          const colId = focusArea.dataset.colId
          const row = getRowByColId(data, colId)
          return row?.cols?.[0]?.id !== colId
        },
        value: {
          set({data, slots, focusArea}) {
            const colId = focusArea.dataset.colId
            const row = getRowByColId(data, colId)
            swapCol({ row, colId, type: 'BEFORE' })
          }
        }
      },
      {
        title: '后移',
        type: 'button',
        ifVisible({data, focusArea}) {
          const colId = focusArea.dataset.colId
          const row = getRowByColId(data, colId)
          return row?.cols?.[row?.cols?.length - 1]?.id !== colId
        },
        value: {
          set({data, slots, focusArea}) {
            const colId = focusArea.dataset.colId
            const row = getRowByColId(data, colId)
            swapCol({ row, colId, type: 'AFTER' })
          }
        }
      },
      {
        title: '向前添加一列',
        type: 'button',
        value: {
          set({ data, slots, focusArea }) {
            const colId = focusArea.dataset.colId
            const row = getRowByColId(data, colId)
            addCol({ slots, row, colId, type: 'BEFORE' })
          }
        }
      },
      {
        title: '向后添加一列',
        type: 'button',
        value: {
          set({ data, slots, focusArea }) {
            const colId = focusArea.dataset.colId
            const row = getRowByColId(data, colId)
            addCol({ slots, row, colId, type: 'AFTER' })
          }
        }
      },
      {
        title: '删除',
        type: 'button',
        ifVisible({data, focusArea}) {
          const colId = focusArea.dataset.colId

          const row = data.rows.find(row => {
            if (row.cols.find(col => {
              if (col.id === colId) {
                return true
              }
            })) {
              return true
            }
          })

          if (row && row.cols.length > 1) {
            return true
          } else {
            return false
          }
        },
        value: {
          set({data, slots, focusArea}) {
            const colId = focusArea.dataset.colId

            const row = data.rows.find(row => {
              if (row.cols.find(col => {
                if (col.id === colId) {
                  return true
                }
              })) {
                return true
              }
            })

            row.cols = row.cols.filter((col, idx) => {
              if (col.id === colId) {
                if (idx === row.cols.length - 1) {//最后
                  const prevCol = row.cols[idx - 1]
                  prevCol.width = 'auto'
                } else {
                  const nextCol = row.cols[idx + 1]
                  nextCol.width = 'auto'
                }
              } else {
                return true
              }
            })
          }
        }
      },
      {},
      {
        title: '单击',
        type: '_Event',
        options: ({ data, focusArea, output }) => {
          const colId = focusArea.dataset.colId
          const col = getCol(data, colId)

          if (!output.get(getColOutputId(colId))) {
            output.add(getColOutputId(colId), col.title, { type: "any" });
          }
          return {
            outputId: getColOutputId(colId)
          }
        }
      }
    ]
  },
  'div[data-row-id]': {
    title: '行',
    items: [
      {
        title: '样式',
        type: 'style',
        options: {
          defaultOpen: true,
          plugins: ['bgcolor']
        },
        value: {
          get({data, slots, focusArea}) {
            const rowId = focusArea.dataset.rowId
            return getRow(data, rowId)?.style ?? {}
          },
          set({data, slots, focusArea}, value) {
            const rowId = focusArea.dataset.rowId
            const row = getRow(data, rowId)
            row.style = value
          }
        }
      },
      {
        title: '布局',
        type: 'layout',
        value: {
          get({data, slots, focusArea}) {
            const rowId = focusArea.dataset.rowId
            const row = getRow(data, rowId)
            return row.layout
          },
          set({data, slots, focusArea}, ly) {
            const rowId = focusArea.dataset.rowId
            const row = getRow(data, rowId)

            row.layout = ly

            row.cols.forEach(col => {
              /** 找到最终生效的CSS */
              const finalLayoutCss = { ...(data?.layout ?? {}), ...(row?.layout ?? {}), ...(col?.layout ?? {}) }
              const slot = slots.get(col.id)
              /** 根据最终生效的CSS设置布局 */
              setSlotLayoutByCss(slot, finalLayoutCss)
            })
          }
        }
      },
      {},
      {
        title: '添加列',
        type: 'button',
        value: {
          set({data, slots, focusArea}) {
            const rowId = focusArea.dataset.rowId
            const row = data.rows.find(row => {
              return row.id === rowId
            })

            const id = uuid(), title = `列${row.cols.length + 1}`

            row.cols.push({
              id,
              title
            })

            slots.add({
              id, title
            })
          }
        }
      },
      {
        title: '向上添加一行',
        type: 'button',
        value: {
          set({data, slots, focusArea}) {
            const rowId = focusArea.dataset.rowId
            addRow({ data, slots, rowId, type: 'BEFORE' })
          }
        }
      },
      {
        title: '向下添加一行',
        type: 'button',
        value: {
          set({data, slots, focusArea}) {
            const rowId = focusArea.dataset.rowId
            addRow({ data, slots, rowId, type: 'AFTER' })
          }
        }
      },
      {
        title: '删除',
        type: 'button',
        ifVisible({data, focusArea}) {
          if (data.rows.length > 1) {
            return true
          } else {
            return false
          }
        },
        value: {
          set({data, slots, focusArea}) {
            const rowId = focusArea.dataset.rowId

            data.rows = data.rows.filter((row, idx) => {
              if (row.id === rowId) {
                // if (idx === row.cols.length - 1) {//最后
                //   const prevCol = row.cols[idx - 1]
                //   prevCol.width = 'auto'
                // } else {
                //   const nextCol = row.cols[idx + 1]
                //   nextCol.width = 'auto'
                // }
              } else {
                return true
              }
            })
          }
        }
      },
      {},
      {
        title: '单击',
        type: '_Event',
        options: ({ data, focusArea, output }) => {
          const rowId = focusArea.dataset.rowId
          const row = getRow(data, rowId)

          if (!output.get(getRowOutputId(rowId))) {
            output.add(getRowOutputId(rowId), row.title, { type: "any" });
          }
          return {
            outputId: getRowOutputId(rowId)
          }
        }
      }
    ]
  }
}

function getCol(data, colId) {
  let rtnCol
  data.rows.forEach(row => {
    row.cols.find(col => {
      if (col.id === colId) {
        rtnCol = col
      }
    })
  })

  return rtnCol
}

/**
 * @description 通过rowId找到当前对应的row
 */
function getRow(data, rowId) {
  return data.rows.find(row => row.id === rowId)
}

/**
 * @description 通过colId找到当前对应的父级row
 * @param data 
 * @param colId 
 */
function getRowByColId(data, colId) {
  let rtnRow 
  data.rows.some(row => {
    if (Array.isArray(row.cols) && row.cols.some(col => col.id === colId)) {
      rtnRow = row
    }
  })
  return rtnRow
}

/**
 * @description 向目标col的前方或者后方添加一列
 * @param colId 目标col
 * @param type BEFORE | AFTER
 * @returns 
 */
function addCol({
  slots,
  row,
  colId,
  type,
  title = `列${colId}`
}: {
  slots: any,
  row: any,
  colId: string,
  type: 'BEFORE' | 'AFTER',
  title?: string
}) {
  if (!Array.isArray(row?.cols)) {
    console.warn(`插入col失败，没有目标row`)
    return
  }

  const id = uuid();
  const currentColIndex = row.cols.findIndex(col => col.id === colId)

  row.cols.splice(type === 'BEFORE' ? currentColIndex : currentColIndex + 1, 0, {
    id,
    title
  })
  slots.add({
    id, title
  })
  return
}

/**
 * @description 交换col的位置，type === BEFORE 与前面一位交换，type === AFTER 与后面一位交换
 * @param colId 要移动的colId 
 * @returns 
 */
function swapCol({
  row,
  colId,
  type,
}: {
  row: any,
  colId: string,
  type: 'BEFORE' | 'AFTER'
}) {
  if (!Array.isArray(row?.cols)) {
    console.warn(`移动col失败，没有目标row`)
    return
  }

  const currentColIndex = row.cols.findIndex(col => col.id === colId)
  const targetColIndex = type === 'BEFORE' ? currentColIndex - 1 : currentColIndex + 1;

  if (targetColIndex < 0 || targetColIndex > row.length - 1) {
    console.warn(`移动col失败，越界`)
    return
  }

  [row.cols[currentColIndex], row.cols[targetColIndex]] = [row.cols[targetColIndex], row.cols[currentColIndex]]
}

/**
 * @description 向目标row的前方或者后方添加一行
 * @param rowId 目标row
 * @param type BEFORE | AFTER
 * @returns 
 */
function addRow({
  data,
  slots,
  rowId,
  type,
  title
}: {
  data: any,
  slots: any,
  rowId: string
  type: 'BEFORE' | 'AFTER',
  title?: string
}) {

  const currentRowIndex = data.rows.findIndex(row => row.id === rowId);

  const insertRowId = uuid(), rowTitle = title || `行${insertRowId}`
  const cols: any = []

  data.rows.splice(type === 'BEFORE' ? currentRowIndex : currentRowIndex + 1, 0, {
    id: insertRowId,
    title: rowTitle,
    height: 'auto',
    cols
  })

  const col0Id = uuid(), col0Title = `列1`
  cols.push({
    id: col0Id,
    title: col0Title,
    width: 100
  })

  slots.add({
    id: col0Id, title: col0Title
  })


  const col1Id = uuid(), col1Title = `列2`
  cols.push({
    id: col1Id,
    title: col1Title,
    width: 'auto'
  })

  slots.add({
    id: col1Id, title: col1Title
  })
}

/**
 * 通过layoutEditor返回的CSSProperties设置slot的layout的
 * @param slot 
 * @param cssStyles 
 */
function setSlotLayoutByCss (slot: any, cssStyles: CSSProperties) {
  switch(true) {
    case cssStyles.position === 'absolute': {
      slot.setLayout('absolute')
      break;
    }
    case cssStyles.position !== 'absolute' && cssStyles.display === 'flex': {
      if (cssStyles.flexDirection === 'row') {
        slot.setLayout('flex-row')
      }
      if (cssStyles.flexDirection === 'column') {
        slot.setLayout('flex-column')
      }
      break;
    }
  }
}