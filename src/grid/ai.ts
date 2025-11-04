export default {
  // ignore: true,
  ':root'({ data }) {
    return {}
  },
  prompts: {
    summary: 'Grid布局组件，常用于页面根组件布局。',
    usage: `Grid布局组件，常用于页面根组件布局。
slots插槽
动态插槽：插槽id=列的key，每一列都是插槽，默认布局为 { display: 'flex', flexDirection: 'column' }

layout声明
width: 可配置，默认100%
height: 可配置，默认fit-content，不允许配置vh、vw等特殊单位

注意事项：
  - 不论当前是否data数据有多少，都必须重新配置行列数据；
  - 在页面主布局出现了复杂的左右布局，上下布局时使用，替代antd中Header、Sider、Content、Footer这类布局；
  - 注意列宽度的定义，考虑清楚配置固定宽度、百分比、还是占满剩余宽度；
    `
  },
  editors: [
    {
      title: '常规/行列数据',
      description: `通过二维数组来配置行列信息，用于实现页面根布局。
interface Col {
  key: string
  width: number | 百分比宽度 ｜ 'auto' // 当width = 'auto' 时，代表占满剩余宽度；当width = '45%' 时，代表占据父容器的45%宽度；当width = 200 时，代表占据固定200像素的宽度。
}

interface Row {
  key: string,
  cols: Col[]
}

/** 这个配置的value值 */
type Value = Row[]
`,
      type: 'array',
      value: {
        set({ data, slot, output }, value) {
          if (Array.isArray(value)) {
            data.rows = value.map(newRow => {
              if (Array.isArray(newRow.cols) && newRow.cols?.length) {
                return {
                  ...newRow,
                  height: 'auto',
                  heightMode: 'auto',
                  cols: newRow.cols.map(col => {
                    let width, widthMode
                    switch (true) {
                      case typeof col.width === 'number': {
                        width = col.width;
                        widthMode = 'px';
                        break;
                      }
                      case typeof col.width === 'string' && col.width?.indexOf('%') > -1: {
                        width = parseFloat(col.width);
                        widthMode = '%';
                        break;
                      }
                      case col.width === 'auto': {
                        width = col.width;
                        widthMode = 'auto';
                        break;
                      }
                    }

                    if (!slot.get(col.key)) {
                      slot.add({
                        id: col.key,
                        title: "拖拽组件到这里",
                      });
                    }
                    output.add(col.key, "列点击", { type: "any" });

                    return {
                      ...col,
                      width,
                      widthMode,
                    }
                  })
                }
              }
              return {
                ...newRow,
                height: 'auto',
                heightMode: 'auto',
                cols: []
              }
            })
          }
        }
      }
    },
    '样式/容器',
    '样式/单元格"'
  ]
}