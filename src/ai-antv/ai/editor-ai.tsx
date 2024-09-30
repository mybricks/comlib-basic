
import {transformCss, transformTsx} from "../transform";

const Promote = `
你也精通 Typescript，以及 三方库 Ant Design Charts（npm名称为@ant-design/charts），能够从中完成用户提出的各类图表需求。

首先，基于你已经了解的三方库知识，我们再通过「Typescript定义」以及「tsx使用示例」来学习一下这个三方库在我们这个场景下的使用限制和知识，主要学习以下几点
1. 整体的代码结构引入方式
2. 关注ts定义和代码注释，后续生成代码，必须按照这个ts定义来生成，比如函数的入参有几个等等信息
3. 每个代码示例里可能存在ts继承公共图表组件的情况，需要理解这一点

开始学习

Typescript定义1: 各类图表组件通用的配置信息
\`\`\` typescript

interface FormatterParams {
  text: string // 当前的渲染数据
  datum: Datum // 当前的渲染项数据
  index: number // 索引
  data: Data // 原始图表数据
}

interface Label {
  text: string, // 使用数据中的哪个字段进行展示
  fontSize?: number, // 文字大小
  fill?: string | Function<string>, // 图形的填充色
  fillOpacity?: number | Function<number> // 图形的填充透明度
  position?: 'outside' | 'inside' | string // 标签位置配置，在笛卡尔坐标系下，支持 9 种位置：'top', 'left', 'right', 'bottom', 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'inside'。非笛卡尔坐标系下，支持 'outside', 'inside' 两种
  formatter?: (FormatterParams) => string // 标签文本格式化
}

interface LegendColor {
  layout: 'flex'|'grid' // 图例项布局方式，网格布局、流式布局, 
  size?: number // 高度或者宽度
  autoWrap?: boolean // 是否自动换行
  maxRows?: number // 最大行数
  maxCols?: number // 最大列数
  cols?: number // 指定每列显示的图例项数量，为空时表示列数不受限制
  position?: 'left' | 'right' | 'top' | 'bottom'
}

interface Legend {
  color: LegendColor | boolean // 分类图例
  size: LegendSize | boolean // 连续图例
}

/** 自定义形状 */
interface AnnotationShape {
  type: 'shape',
  style: {
    x: string
    y: string
    render: ({ x, y }, context, d) => HtmlElement
  }
}

/** 自定义文本 */
interface AnnotationText {

}

/** 自定义辅助线 */
interface AnnotationLine {
  type: 'lineY' | 'lineX' // lineY是在Y轴上作线，lineX是在X轴上作线
  data: number[] // 具体作线的点
  label?: {
    text?: string // 标签的文案
    position?: 'left' | 'right' | 'bottom' | 'top', // 标签的位置
  }
}

type Annotation = AnnotationShape | AnnotationText | AnnotationLine

/** 坐标轴配置 */
interface AxisItem {
  size?: number // 大小宽高，一般不配置，除非有需求
  title?: false|string | number // 关闭标题或设置标题内容
  titleFontSize?: number // 标题文字大小
  titleStroke?: string // 标题字体颜色
  label?: boolean // 是否显示刻度值
  labelFormatter?: (datum, index, data, Vector)=> DisplayObject // 刻度值线格式化，比如转换单位等情况
}

// 图表组件的配置项
interface ChartConfig {
  label?: Label // 图表的标签项
  legend?: Legend // 图例类型
  annotations?: Annotation[] // 用于在图表绘制自定义图形
  axis?: {
    x?: AxisItem, // x轴配置
    y?: AxisItem // y轴配置
  }
}
\`\`\`

tsx使用示例1: 最基本的代码结构，重点是如何引入图表，并且在图表外层套一个div
\`\`\` typescript
import { 某个图表 } from '@ant-design/charts';
import { useMemo } from 'react';
import css from 'index.less';

export default ({ data }) => {
  const config: ChartConfig = useMemo(() => {
    return {
      data: data.data, // 注入图表数据
      //...省略配置
    }
  }, [data.data])

  return (
    // 务必在外层添加一个dom结构，用于配置图表宽高等样式
    <div className={css.chart} style={{ width: '500px', height: '400px' }}>
      <某个图表 {...config} />
    </div>
  )
}
\`\`\`

tsx使用示例2: 绘制饼图，完成一些复杂的需求，仅包含配置项的代码
\`\`\` typescript
import { Pie } from '@ant-design/charts';

interface PieChartConfig extends ChartConfig {
  startAngle?: number // Math.PI 的倍数，仅在生成扇形图中使用
  endAngle?: number // Math.PI 的倍数，仅在生成扇形图中使用
};

const config: PieChartConfig = useMemo(() => {
  return {
    data: [{ sex: '男', per: 0.3 }, { sex: '女', per: 0.7 }],
    angleField: 'per', // 值
    colorField: 'sex', // 维度
    innerRadius: 0, // 0～1，内部半径，支持不配置，如果配置了，则变成环形图，中间可以放置一些UI
    startAngle: Math.PI,
    endAngle: Math.PI * 1.5,
    label: {
      text: 'sex',
      position: 'outside', // 决定标签在哪个位置展示，目前是在外部图形标签
      formatter: (text, datum) => datum.sex + ':' + datum.per * 100 + '%' // 将数据格式化成「男: 30%」的样子
    },
    legend: { // 没需求可以不用配置
      color: {
        layout: 'grid',
        autoWrap: true,
        position: 'right'
      }
    }
  }
}, [])
\`\`\`

tsx使用示例3: 绘制折线图，仅包含配置项的代码
\`\`\` typescript
import { Line } from '@ant-design/charts';

interface LineChartConfig extends ChartConfig {
  point?: { // 如果折线图不需要点的话可以不要
    shapeField: 'round' | 'square' | 'smooth' 指定线是否平滑、点等
  },
  style?: {
    lineWidth: number 线的宽度
  }
};

const chartRef = React.useRef(null);

const config: LineChartConfig = useMemo(() => {
  return {
    data: [{ year: '1991', value: 1000 }, { year: '1992', value: 1300 }],
    xField: 'year', // x轴的字段
    yField: 'value', // y轴的字段
    point: { 
      shapeField: 'round',
      sizeField: 4,
    },
    style: {
      lineWidth: 2,
    },
    axis: {
      y: {
        labelFormatter: (datum, index) => {
          const { chart } = chartRef.current;
          const { document } = chart.getContext().canvas;
          const group = document?.createElement('g', {});
          const label = document.createElement('text', {
            style: {
              text: datum.value,
              fill: 'gray',
              textAlign: 'center',
              transform: translate(0, 25),
            },
          });

          group.appendChild(label);
          return group;
        }
      }
    },
    onReady: (plot) => (chartRef.current = plot) // 记录 chart 实例用于 labelFormatter，如果没有 labelFormatter 的情况不需要
  }
}, [])
\`\`\`

学习完毕，接下来，你可以学习下项目的代码结构及生产规范
`


export default function getAIEditors() {
  return {
    ':root': {
      active: true,
      role:'comDev',//定义AI的角色
      getInitSourceCode({data: model}){//获取初始的源码
        if (model.sourceCode) {
          const {data, render, style, editors, inputs, outputs, slots} = model.sourceCode
          return {
            model: data,
            render,
            style,
            editors,
            inputs,
            outputs,
            slots
          }
        }
      },
      getSystemPrompts({data: model}) {
        return Promote
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

        console.log('data ===>', JSON.parse(JSON.stringify(initData)))
        
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
        
        console.log(renderCode)
        transformTsx(renderCode, {id}).then(code => {
          data.code = code;
          data._jsxErr = ''
        }).catch(e => {
          data._jsxErr = e?.message ?? '未知错误'
        })
        // proRender({id, data}, renderCode)
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