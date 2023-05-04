export default {
  // def: {
  //   content: '文字内容'
  // },
  // prompts: [
  //   {
  //     Q: '添加一个文本组件，内容为一首诗',
  //     A: {
  //       type: "mybricks.basic-comlib.text",
  //       content: "春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。"
  //     }
  //   },
  //   {
  //     Q: '添加一个文本组件，内容为对中国时政的分析',
  //     A: {
  //       type: "mybricks.basic-comlib.text",
  //       content: "（关于中国时政分析的内容）"
  //     }
  //   }
  // ],
  '@focus'({data}) {
    return {
      data: {
        content: data.content,
        style: {
          align: data.style.align,
          color: data.style.color
        }
      },
      placeholder: '请输入文本内容',
      prompts: `
      以下是一些例子：
      Q：居中;
      A:{style:{[其他定义],textAlign:'center'}}
      (注意，样式属性使用驼峰命名.)
      `
    }
  },
  // '@create'({def, data}) {
  //   if(def.content!==undefined&&def.content!==''){
  //     data.content = def.content
  //   }
  // },
  '@update'({data, newData,slots}) {
    if (typeof newData.content === 'string') {
      data.content = newData.content
    }

    if (typeof newData.style === 'object') {
      data.style = Object.assign({}, data.style, newData.style)
    }
  }
}