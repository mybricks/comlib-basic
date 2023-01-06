/**
 * MyBricks Opensource
 * https://mybricks.world
 * This source code is licensed under the MIT license.
 *
 * CheMingjun @2019
 * mybricks@126.com
 */
import React from 'react';
import { Tips } from './editTips';
import { refleshPx, resetLayout, refleshPercent } from './edtUtils';
import { CellWidthTypeEnum } from '../const';
import { isNumber } from '../../utils';

interface Result {
  focusArea: any
  slot: any
  data: any
  output: any
  input: any
}

export default {
  '@init'({style, data}) {
    style.width = 200
    style.height = 100
  },
  '@resize': {
    options: ['width', 'height'],
    value: {
      set({data, style, element}, {width, height}) {
        requestAnimationFrame(() => {
          if (data.cellWidthType === CellWidthTypeEnum.Percent) {
            refleshPx({cols: data.cols, styleWidth: element.parentElement.clientWidth})
          } 
          // else {
          //   refleshPercent({cols: data.cols, styleWidth: element.parentElement.clientWidth})
          // }
        })
      }
    }
  },
  ':focus-mask': (arg) => {
    const {data, style, slots, element} = arg
    return <Tips data={data} style={style} element={element} slots={slots}/>
  },
  ':root': ({input, output}, cate1, cate2, cate3) => {
    const allOutPins = output.get()

    cate1.title = '常规';
    cate1.items = [
      {
        title: '单元格宽度类型',
        type: 'select',
        options: [
          {label: '固定宽度', value: CellWidthTypeEnum.Px},
          {label: '百分比', value: CellWidthTypeEnum.Percent}
        ],
        value: {
          get({data, style, slots}) {
            return data.cellWidthType;
          },
          set({data, style, slots}, value) {
            data.cellWidthType = value;

            resetLayout({data})
          }
        }
      },
      {
        title: '背景',
        type: 'colorPicker',
        value: {
          get({data, style, slots}) {
            return data.style.backgroundColor
          },
          set({data, style, slots}, color) {
            data.style.backgroundColor = color
          }
        }
      },
      // {
      //   title: '事件',
      //   items: [
      //     {
      //       title: '单击',
      //       type: '_Event',
      //       options: {
      //         outputId: 'click'
      //       }
      //     },
      //   ]
      // }
    ]
  },
  // '[data-row-id]': [
  //   {
  //     title: '拆分',
  //     type: 'button',
  //     value: {
  //       set({data, slots, focusArea}) {
  //         const colId = focusArea.dataset[`col-id`]
  //         debugger
  //
  //         const newId = uuid()
  //         data.rows[0].cols.push({
  //           id: newId
  //         })
  //         slots.add({id: newId, title: '单元格'})
  //       }
  //     }
  //   }
  // ],
  // '[data-tip-col-id]': [
  //   {
  //     title: '布局',
  //     type: 'button',
  //     value: {
  //       set({data, slots, focusArea}) {
  //         const colId = focusArea.dataset[`col-id`]
  //         debugger
  //
  //       }
  //     }
  //   },
  // ],
  'div[data-col-id]': {
    title: '列',
    items: [
      {
        title: '宽度填充模式',
        type: 'select',
        ifVisible({data, focusArea}) {
          const { cols } = data
          const colId = focusArea.dataset.colId
          const findIndex = cols.findIndex((col) => col.id === colId)
          if (findIndex === (cols.length - 1)) {
            return false
          }

          return true
        },
        options: [
          {label: '固定', value: CellWidthTypeEnum.Stabl},
          {label: '自动填充', value: CellWidthTypeEnum.Auto}
        ],
        value: {
          get({data, focusArea}) {
            const { cols } = data
            const colId = focusArea.dataset.colId
            const colDef = cols.find((col) => col.id === colId)

            return colDef.cellWidthType || 'stabl';
          },
          set({data, focusArea}, value) {
            const { cols } = data
            const colId = focusArea.dataset.colId
            const colDef = cols.find((col) => col.id === colId)

            colDef.cellWidthType = value
          }
        }
      },
      {
        title: '宽度(px)',
        type: 'text',
        ifVisible({ data, focusArea }) {
          const { cols } = data
          const colId = focusArea.dataset.colId
          const findIndex = cols.findIndex((col) => col.id === colId)
          if (findIndex === (cols.length - 1)) {
            return false
          }
          const colDef = cols[findIndex];
          return data.cellWidthType === CellWidthTypeEnum.Px && colDef.cellWidthType !== CellWidthTypeEnum.Auto;
        },
        options: {
          type: 'number'
        },
        value: {
          get({data, focusArea}) {
            const { cols } = data
            const colId = focusArea.dataset.colId
            const colDef = cols.find((col) => col.id === colId)

            return colDef.width;
          },
          set({data, focusArea}, value) {
            const { cols } = data
            const colId = focusArea.dataset.colId
            const colDef = cols.find((col) => col.id === colId) 
            let rstNumber = Number(value)

            if (isNumber(rstNumber)) {
              colDef.width = rstNumber
            }
          }
        }
      },
      {
        title: '百分比(%)',
        type: 'text',
        ifVisible({ data, focusArea }) {
          const { cols } = data
          const colId = focusArea.dataset.colId
          const findIndex = cols.findIndex((col) => col.id === colId)
          if (findIndex === (cols.length - 1)) {
            return false
          }
          const colDef = cols[findIndex];
          return data.cellWidthType === CellWidthTypeEnum.Percent && colDef.cellWidthType !== CellWidthTypeEnum.Auto;
        },
        options: {
          type: 'number'
        },
        value: {
          get({data, focusArea}) {
            const { cols } = data
            const colId = focusArea.dataset.colId
            const colDef = cols.find((col) => col.id === colId)

            console.log(JSON.parse(JSON.stringify(cols)), 'cols')

            return Number(colDef.widthPercent?.replace('%', ''))
          },
          set({data, focusArea}, value) {
            const { cols } = data
            const colId = focusArea.dataset.colId
            const colDef = cols.find((col) => col.id === colId)
            let rstNumber = Number(value)

            if (isNumber(rstNumber)) {
              colDef.widthPercent = `${rstNumber}%`
            }
          }
        }
      },
      {
        title: '布局',
        type: 'layout',
        value: {
          set({data, slots, focusArea}, ly) {
            const colId = focusArea.dataset.colId
            data.rows.forEach(row => {
              row.cols.find(col => {
                if (col.defId === colId) {
                  const slot = slots.get(col.id)
                  col.style = ly
                  if (ly.layout === 'absolute') {
                    slot.setLayout('absolute')
                  } else {
                    slot.setLayout(ly.layout)
                  }
                  return true
                }
              })
            })
          }
        }
      },
      {},
      {
        title: '删除',
        type: 'button',
        ifVisible({data}) {
          if (data.cols.length > 1) {
            return true
          } else {
            return false
          }
        },
        value: {
          set({data, style, slots, focusArea, element}) {
            const colId = focusArea.dataset.colId

            if (typeof style.width === 'number') {
              style.width -= element.querySelector(`#col-${colId}`).offsetWidth
            }

            data.cols = data.cols.filter((col, idx) => col.id !== colId)

            data.rows.forEach(row => {
              row.cols = row.cols.filter((col, idx) => {
                if (col.defId === colId) {
                  slots.remove(col.id)
                } else {
                  return col
                }
              })
            })

            data._editCol = void 0//remove

            resetLayout({data})
          }
        }
      },
    ]
  },
  'div[data-row-id]': {
    title: '行',
    items: [
      {
        title: '布局',
        type: 'layout',
        value: {
          set({data, slots, focusArea}, ly) {
            const rowId = focusArea.dataset.rowId
            const row = data.rows.find(row => row.id === rowId)

            row.cols.forEach(col => {
              const slot = slots.get(col.id)
              col.style = ly
              if (ly.layout === 'absolute') {
                slot.setLayout('absolute')
              } else {
                slot.setLayout(ly.layout)
              }
            })
          }
        }
      },
      // {
      //   title: '均分列宽度',
      //   type: 'button',
      //   value: {
      //     set({data, slots, focusArea}) {
      //
      //     }
      //   }
      // },
      {},
      {
        title: '删除',
        type: 'button',
        ifVisible({data}) {
          if (data.rows.length > 1) {
            return true
          } else {
            return false
          }
        },
        value: {
          set({data, style, slots, focusArea, element}) {
            const rowId = focusArea.dataset.rowId

            if (typeof style.height === 'number') {
              style.height -= element.querySelector(`#row-${rowId}`).offsetHeight
            }

            data.rows = data.rows.filter(row => {
              if (row.id === rowId) {
                row.cols.forEach((col, idx) => {
                  slots.remove(col.id)
                })

              } else {
                return row
              }
            })


            data._editRow = void 0//remove

            resetLayout({data})
          }
        }
      },
    ]
  },
  'div[data-zone]': {
    title: '单元格',
    items: [
      // {
      //   title: "布局",
      //   type: "layout",
      //   options: [],
      //   value: {
      //     set({data, slots, focusArea}, value) {
      //       const {col, slot} = getByFousArea({data, slots, focusArea})

      //       col.style = value
      //       if (value.layout === 'absolute') {
      //         slot.setLayout('absolute')
      //       } else {
      //         slot.setLayout(value.layout)
      //       }
      //     },
      //   },
      // },
      {
        title: "合并",
        type: "button",
        options: [],
        value: {
          set({data, slots, focusArea}, value) {
            const colIds = JSON.parse(focusArea.dataset.zone)

            if (colIds.length > 0) {
              const targetId = colIds[0][0]

              const startCol = searchCol({data}, targetId)
              const startSlot = slots.get(targetId)

              let allColSpan = startCol.colSpan ? startCol.colSpan : 1
              colIds.forEach((row, rix) => {
                row.forEach(colId => {
                  if (colId !== targetId) {
                    let found
                    data.rows.forEach(row => {
                      row.cols = row.cols.filter((col, idx) => {
                        if (col.id === colId) {
                          if (rix === 0) {
                            allColSpan += (col.colSpan || 1)
                          }

                          found = col
                          const slot = slots.get(col.id)
                          const coms = slot.children
                          startSlot.cutInto(coms)//将其子组件剪切到

                          slot.remove()
                        } else {
                          return col
                        }
                      })
                    })
                  }
                })
              })

              startCol.colSpan = allColSpan

              const rowSpan = colIds.length

              if (rowSpan > 1) {
                if (startCol.rowSpan) {
                  startCol.rowSpan = rowSpan + startCol.rowSpan - 1
                } else {
                  startCol.rowSpan = rowSpan
                }
              }
            }

            resetLayout({data})
          },
        },
      }
    ]
  },
  'td[data-col-id]': {
    title: '单元格',
    items: [
      {
        title: '名称',
        type: 'text',
        value: {
          get({data, slots, focusArea}) {
            const {col, slot} = getByFousArea({data, slots, focusArea})
            return col.name || slot.title
          },
          set({data, slots, focusArea}, name) {
            const {col, slot} = getByFousArea({data, slots, focusArea})
            slot.setTitle(name)
            col.name = name
          }
        }
      },
      {},
      {
        title: "布局",
        type: "layout",
        options: [],
        value: {
          get({data, slots, focusArea}) {
            const {col, slot} = getByFousArea({data, slots, focusArea})

            return col.style;
          },
          set({data, slots, focusArea}, value) {
            const {col, slot} = getByFousArea({data, slots, focusArea})

            col.style = Object.assign(col.style || {}, value);
            if (value.layout === 'absolute') {
              slot.setLayout('absolute')
            } else {
              slot.setLayout(value.layout)
            }
          },
        },
      },
      {
        title: '背景',
        type: 'colorPicker',
        value: {
          get({data, style, slots, focusArea}) {
            const {col, slot} = getByFousArea({data, slots, focusArea})
            return col.style?.backgroundColor
          },
          set({data, style, slots, focusArea}, color) {
            const {col, slot} = getByFousArea({data, slots, focusArea})
            if (!col.style) {
              col.style = {}
            }
            col.style.backgroundColor = color
          }
        }
      },
      {},
      // {
      //   title: '添加状态',
      //   type: 'button',
      //   value: {
      //     set() {
      //       alert('TODO')
      //     }
      //   }
      // }
    ]
  }
}

function getByFousArea({data, slots, focusArea}): { col, slot } {
  const rowId = focusArea.dataset[`rowId`]
  const colId = focusArea.dataset[`colId`]

  const row = data.rows.find(row => row.id === rowId)
  const col = row.cols.find(col => col.id === colId)

  const slot = slots.get(col.id)

  return {col, slot}
}

function searchCol({data}, colId) {
  let found
  data.rows.find(row => {
    return row.cols.find(col => {
      if (col.id === colId) {
        found = col
        return true
      }
    })
  })

  return found
}
