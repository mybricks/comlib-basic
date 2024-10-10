export default [
  {
    title: 'antd',
    desc: `ant design组件库`,
    version: '2.2.1',
    load({loadAsScript}) {
    }
  },
  {
    title: '@ant-design/icons',
    desc: `ant design图标库`,
    moduleDef: `window['icons']`,
  },
  {
    title: '@ant-design/charts',
    desc: `ant design图表库`,
    version: '2.2.1',
    moduleDef: `window['Charts']`,
    js: `https://unpkg.com/@ant-design/charts@2.2.1/dist/charts.min.js`,
    // load({loadAsScript}) {
    //   return new Promise((resolve, reject) => {
    //     loadAsScript(`https://unpkg.com/@ant-design/charts@2.2.1/dist/charts.min.js`).then(() => {
    //       const module = window['Charts']
    //       resolve(module)
    //     })
    //   })
    // }
  },
  // {
  //   title: 'gantt',
  //   desc: `基于react的甘特图库`,
  //   js: `https://cdn.jsdelivr.net/npm/frappe-gantt-react@0.2.2/index.min.js`,
  //   moduleDef: `window['Gantt']`,
  // }
] as any