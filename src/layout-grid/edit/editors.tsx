import {isNumber, uuid} from "../../utils";
import {CellWidthTypeEnum} from "../../layout/const";
import {resetEditCol, resetLayout} from "../../layout/edit/edtUtils";
import ColWidth from "./ColWidth";

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
          const rowId = uuid(), rowTitle = `项目${data.rows.length + 1}`
          const cols = []
          data.rows.push({
            id: rowId,
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


          const col1Id = uuid(), col1Title = `列1`
          cols.push({
            id: col1Id,
            title: col1Title,
            width: 'auto'
          })

          slots.add({
            id: col1Id, title: col1Title
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

            const slot = slots.get(colId)

            if (ly.position === 'absolute') {
              slot.setLayout('absolute')
            } else {
              slot.setLayout(ly.position)
            }
          }
        }
      },
      {},
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
      }
    ]
  },
  'div[data-row-id]': {
    title: '行',
    items: [
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
      {},
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
