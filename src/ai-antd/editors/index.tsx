import {loadBabel, loadLess} from '../transform'
import aiEditors from "./editor-ai";

// TODO: 后面去掉
loadLess()
loadBabel()

export default {
  '@init': (params) => {
    const {style, data, id, input, output} = params;
    style.width = 'fit-content';
    style.height = 'auto';
    //
    // data.extraLib = getParamsType()
    // data._code = encodeURIComponent(DefaultCode);
    //
    // data.cssLan = CSS_LANGUAGE.Less;
    //
    // data._less = encodeURIComponent(DefaultLessCode)
    //
    // if (id && data._code && !data.code) {
    //   transformTsx(DefaultCode, {id}).then(code => {
    //     data.code = code
    //     data._jsxErr = '';
    //   }).catch(e => {
    //     data._jsxErr = e?.message ?? '未知错误'
    //   });
    // }
    //
    // if (id && data._less && !data.css) {
    //   transformCss(DefaultLessCode, CSS_LANGUAGE.Less, {id}).then(css => {
    //     data.css = css;
    //     data._cssErr = '';
    //   }).catch(e => {
    //     data._cssErr = e?.message ?? '未知错误'
    //   })
    // }

    // data._JSON = encodeURIComponent(DefaultJSONCode)

    // updateIOConfigurations(params, JSON.parse(DefaultJSONCode));
  },
  '@resize': {
    options: ['width', 'height']
  },
  //'@ai': null,//取消外置AI
  '@ai': aiEditors,
  // '@toJSON': ({data}) => {
  //   // 只保留运行时需要用的数据
  //   const {code, css, inputs, outputs, slots, _defined, _cssErr, _jsxErr} = data
  //   return {
  //     data: {
  //       code,
  //       css,
  //       inputs: inputs.map(({id}) => {
  //         return {
  //           id
  //         }
  //       }),
  //       outputs: outputs.map(({id}) => {
  //         return {
  //           id
  //         }
  //       }),
  //       slots: slots.map(({id}) => {
  //         return {
  //           id
  //         }
  //       }),
  //       _defined,
  //       _cssErr,
  //       _jsxErr
  //     }
  //   }
  // },
  ':slot': {},
//   ':root': {
//     items({data, env, id, input, output}, ...catalog) {
//       if (id && data._code && !data.code) {
//         transformTsx(DefaultCode, {id}).then(code => {
//           data.code = code
//           data._jsxErr = '';
//         }).catch(e => {
//           data._jsxErr = e?.message ?? '未知错误'
//         });
//       }
//
//       if (id && data._less && !data.css) {
//         transformCss(DefaultLessCode, CSS_LANGUAGE.Less, {id}).then(css => {
//           data.css = css;
//           data._cssErr = '';
//         }).catch(e => {
//           data._cssErr = e?.message ?? '未知错误'
//         })
//       }
//
//
//       catalog[0].title = '常规';
//       catalog[0].items = [
//         // ...(() => {
//         //   const sourceCode = data.sourceCode
//         //   if (sourceCode && sourceCode.editors
//         //     //&& !data._editors
//         //   ) {
//         //     const code = sourceCode.editors
//         //     const editorsAry = eval(`(${code})`)({})
//         //     data._editors = editorsAry
//         //   }
//         //
//         //   const rtn = []
//         //   if (data._editors) {
//         //     if (!data['_defined']) {
//         //       data['_defined'] = {}
//         //     }
//         //
//         //     data._editors.forEach(edt => {
//         //       //debugger
//         //
//         //       if (!(edt.title && edt.type
//         //         && edt.value && edt.value.set)) {
//         //         debugger
//         //
//         //         return
//         //       }
//         //
//         //       rtn.push({
//         //         title: edt.title,
//         //         type: edt.type,
//         //         options: edt.options,
//         //         value: {
//         //           get({data}) {
//         //             if (typeof edt.value.get === 'function') {
//         //               const definedData = data['_defined']
//         //               return edt.value.get({data: definedData})
//         //             }
//         //           },
//         //           set({data}, val) {
//         //             const definedData = data['_defined']
//         //             edt.value.set({data: definedData}, val)
//         //           }
//         //         }
//         //       })
//         //     })
//         //   }
//         //
//         //   return rtn
//         // })(),
//         // {
//         //   title: '事件',
//         //   items: [
//         //     ...(() => {
//         //       const relOutputIdMap = {}
//         //       data.inputs.forEach(({rels}) => {
//         //         if (rels) {
//         //           rels.forEach((relOutputId) => {
//         //             relOutputIdMap[relOutputId] = true
//         //           })
//         //         }
//         //       })
//         //
//         //       return data.outputs.filter(({key}) => {
//         //         return !relOutputIdMap[key]
//         //       }).map(({id, title}) => {
//         //         return {
//         //           title,
//         //           type: '_Event',
//         //           options: {
//         //             outputId: id
//         //           }
//         //         }
//         //       })
//         //     })()
//         //   ]
//         // }
//       ]
//
// //catalog[1] = 'comDefined'
//       //
//       // catalog[1].title = '定义'
//       // catalog[1].items = [
//       //   ]
//
//       //getDefine({data, env, id, input, output}, catalog)
//
//
//     }
//   },
  // '.left .ant-tree .ant-tree-node-content':{
  //   items({data, env, id, input, output}, ...catalog) {
  //     catalog[0].title = '子组件';
  //     catalog[0].items = [
  //       {
  //         title: 'XXX',
  //         type: 'text',
  //         value: {
  //           get() {
  //
  //           }, set() {
  //
  //           }
  //         }
  //       }
  //     ]
  //   }
  // },
  // '[data-mybricks-zone]': {
  //   items({data, env, id, input, output}, ...catalog) {
  //     catalog[0].title = '子组件';
  //     catalog[0].items = [
  //       {
  //         title: '测试',
  //         type: 'text',
  //         value: {
  //           get() {
  //
  //           }, set() {
  //
  //           }
  //         }
  //       }
  //     ]
  //   }
  // }
}
