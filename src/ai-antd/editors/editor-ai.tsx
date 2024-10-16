import {transformCss} from "../transform";
import proRender from "./proRender";

export default {
  ':root': {
    active: true,
    role: 'comDev',//定义AI的角色
    getSystemPrompts() {
      return `
可以基于 antd(Ant Design)、@ant-design/icons(Ant Design提供的图标库) 库进行开发.
部分组件的API说明如下：
### Tree 树形控件API
| 参数          | 说明    |    类型     | 默认值      |
| :---          | :----:   |  :----:  |   ---: |
| allowDrop   | 是否允许拖拽时放置在该节点       | ({ dropNode, dropPosition }) => boolean  |    |
| autoExpandParent   | 是否自动展开父节点       | boolean | false   |
| blockNode   | 是否节点占据一行       | boolean | false   |
| checkable   | 节点前添加 Checkbox 复选框       | boolean | false   |

### Tree 树形控件UI css selector
| 名称         | css selector    |
| :---        |    ----:   |
| 节点      | .ant-tree-treenode  |
`
    },
    load(depAry: { package, coms }[]) {
      const prompts = []

      depAry.forEach(dep => {
        if (dep.package && dep.coms) {
          if (dep.package === 'antd') {

            dep.coms.forEach(com => {
              if (com === 'Tree') {
                prompts.push(`
### Tree 树形控件API
| 参数          | 说明    |    类型     | 默认值      |
| :---          | :----:   |  :----:  |   ---: |
| allowDrop   | 是否允许拖拽时放置在该节点       | ({ dropNode, dropPosition }) => boolean  |    |
| autoExpandParent   | 是否自动展开父节点       | boolean | false   |
| blockNode   | 是否节点占据一行       | boolean | false   |
| checkable   | 节点前添加 Checkbox 复选框       | boolean | false   |

### Tree 树形控件UI css selector
| 名称         | css selector    |
| :---        |    ----:   |
| 节点      | .ant-tree-treenode  |
        `)
              }
            })
          }
        }
      })

      if (prompts.length > 0) {
        return prompts.join('\n')
      }
    },
    execute({id, data, inputs, outputs, slots},
            response: { render, style }) {
      return new Promise((resolve, reject) => {
        if (response) {
          if (!(response.render || response.style)) {
            resolve()
            return
          }

          if (response.render) {
            const renderCode = response.render

            proRender({id, data}, renderCode)
          }

          if (response.style) {
            transformCss(response.style, data.cssLan, {id}).then(css => {
              data._styleCode = css;
              data._cssErr = '';
            }).catch(e => {
              data._cssErr = e?.message ?? '未知错误'
            })
          }

          resolve()
        }
      })
    }
  }
}