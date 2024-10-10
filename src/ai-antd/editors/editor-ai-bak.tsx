import {transformCss} from "../transform";
import proRender from "./proRender";

export default {
  ':root': {
    active: true,
    role: 'comDev',//定义AI的角色
    // getInitSourceCode({data: model}) {//获取初始的源码
    //   if (model.sourceCode) {
    //     const {data, render, style, editors, inputs, outputs, slots} = model.sourceCode
    //     return {
    //       model: data,
    //       render,
    //       style,
    //       editors,
    //       inputs,
    //       outputs,
    //       slots
    //     }
    //   }
    // },
    getSystemPrompts() {
      return `
可以基于 antd、@ant-design/icons 库进行开发.

对于antd库，以下是一些组件的补充说明（markdown格式）：

# Tree 树形控件API
| 参数         | 说明    |    类型     | 默认值      |
| :---        |    :----:   |  :----:  |   ---: |
| allowDrop   | 是否允许拖拽时放置在该节点       | ({ dropNode, dropPosition }) => boolean  |    |
| autoExpandParent   | 是否自动展开父节点       | boolean | false   |
| blockNode   | 是否节点占据一行       | boolean | false   |
| checkable   | 节点前添加 Checkbox 复选框       | boolean | false   |

# Tree 树形控件UI css selector
| 名称         | css selector    |
| :---        |    ----:   |
| 节点      | .ant-tree-treenode  |

        `
    },
    execute({id, data, inputs, outputs, slots},
            response: { model, render, style, editors, inputs, outputs, slots }) {
      return new Promise((resolve, reject) => {
        if (response) {
          if (!(response.model || response.render || response.style ||
            response.editors || response.inputs || response.outputs ||
            response.slots)) {
            resolve()
            return
          }


          if (!data.sourceCode) {
            data.sourceCode = {}
          }

          if (response.model) {
            data.sourceCode.data = response.model

            // const code = response.js.replace(`export default `, '')
            // const initData = eval(`(${code})`)({})
            if (!data['_defined']) {
              data['_defined'] = {}
            }

            const initData = JSON.parse(response.model)

            if (initData && typeof initData === 'object' && !Array.isArray(initData)) {
              for (let key in initData) {
                const tv = initData[key]
                if (tv !== undefined && tv !== null) {//只合并有值的 TODO 更严格的合并
                  data['_defined'][key] = tv
                }
              }
            }
          }


          if (response.render) {
            const renderCode = response.render
            data.sourceCode.render = renderCode

            proRender({id, data}, renderCode)
          }

          if (response.style) {
            data.sourceCode.style = response.style

            transformCss(response.style, data.cssLan, {id}).then(css => {
              data.css = css;
              data._cssErr = '';
            }).catch(e => {
              data._cssErr = e?.message ?? '未知错误'
            })
          }

          if (response.editors) {
            data.sourceCode.editors = response.editors

            // const code = response.editors.replace(`export default `, '')
            // const editorsAry = eval(`(${code})`)({})
            // data._editors = editorsAry
          }

          if (response.inputs) {
            data.sourceCode.inputs = response.inputs

            const inputAry = JSON.parse(response.inputs)

            if (inputAry && Array.isArray(inputAry)) {
              const {deleteIds, addIdsMap} = compareIOS(data.inputs, inputAry);

              deleteIds.forEach((id) => {
                inputs.remove(id)
              })

              data.inputs = inputAry.map(({id, title, schema, rels: rel, ...other}) => {
                const rels = rel ? [rel] : [];
                if (addIdsMap[id]) {
                  inputs.add(id, title, schema)
                  inputs.get(id).setRels(rels)
                } else {
                  const input = inputs.get(id)
                  input.setTitle(title)
                  input.setSchema(schema)
                  input.setRels(rels)
                }

                return {
                  ...other,
                  id,
                  title,
                  schema,
                  rels
                }
              })
            }
          }

          if (response.outputs) {
            data.sourceCode.outputs = response.outputs

            const outputAry = JSON.parse(response.outputs)
            if (outputAry && Array.isArray(outputAry)) {
              const {deleteIds, addIdsMap} = compareIOS(data.outputs, outputAry);

              deleteIds.forEach((id) => {
                const out = outputs.get(id)
                out.remove(id)
              })

              data.outputs = outputAry.map(({id, title, schema, ...other}) => {
                if (addIdsMap[id]) {
                  outputs.add(id, title, schema)
                } else {
                  const out = outputs.get(id)
                  out.setTitle(title)
                  out.setSchema(schema)
                }

                return {
                  ...other,
                  id,
                  title,
                  schema,
                }
              })
            }
          }

          if (response.slots) {
            data.sourceCode.slots = response.slots

            const slotsAry = JSON.parse(response.slots)
            if (slotsAry && Array.isArray(slotsAry)) {
              const {deleteIds, addIdsMap} = compareIOS(data.slots, slotsAry);

              deleteIds.forEach((id) => {
                const slot = slots.get(id)
                slot.remove(id)
              })

              data.slots = slotsAry.map(({id, title, ...other}) => {
                if (addIdsMap[id]) {
                  slots.add(id, title)
                } else {
                  // 更新
                  const slot = slots.get(id)
                  slot.setTitle(title)
                }

                return {
                  ...other,
                  id,
                  title
                }
              })
            }
          }

          resolve()
        }
      })
    }
  }
}

function compareIOS(previousValue, currentValue): any {
  const previousIdSet = new Set(previousValue.map(item => item.id))
  const currentIdSet = new Set(currentValue.map(item => item.id))

  const deleteIds = [...previousIdSet].filter(id => !currentIdSet.has(id))
  const addIdsMap = [...currentIdSet].reduce((acc: any, key: any) => {
    if (!previousIdSet.has(key)) {
      acc[key] = true
    }

    return acc
  }, {})

  return {deleteIds, addIdsMap}
}
