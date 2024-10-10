import {DefaultCode, DefaultLessCode, getParamsType} from './constants';
import {loadBabel, loadLess, transformCss, transformTsx} from './transform'
import {CSS_LANGUAGE} from "../custom-render/types";
import getAIEditors from "./ai/editor-ai";
import {compareIO} from "../custom-render/util";
import {uuid} from "./util";

// TODO: 后面去掉
loadLess()
loadBabel()

export default {
  '@init': (params) => {
    const {style, data, id, input, output} = params;
    style.width = 'fit-content';
    style.height = 'auto';
    
    data.extraLib = getParamsType()
    data._code = encodeURIComponent(DefaultCode);
    
    data.cssLan = CSS_LANGUAGE.Less;
    
    data._less = encodeURIComponent(DefaultLessCode)
    
    // data._JSON = encodeURIComponent(DefaultJSONCode)
    
    // updateIOConfigurations(params, JSON.parse(DefaultJSONCode));
  },
  '@resize': {
    options: ['width', 'height']
  },
  //'@ai': null,//取消外置AI
  '@ai': ({data}) => getAIEditors(),
  '@toJSON': ({data}) => {
    // 只保留运行时需要用的数据
    const {code, css, inputs, outputs, slots, _defined, _cssErr, _jsxErr} = data;
    return {
      data: {
        code,
        css,
        inputs: inputs.map(({id}) => {
          return {
            id
          }
        }),
        outputs: outputs.map(({id}) => {
          return {
            id
          }
        }),
        slots: slots.map(({id}) => {
          return {
            id
          }
        }),
        _defined,
        _cssErr,
        _jsxErr
      }
    }
  },
  ':slot': {},
  ':root': {
    items({data, env, id, input, output}, ...catalog) {
      if (id && data._code && !data.code) {
        transformTsx(DefaultCode, {id}).then(code => {
          data.code = code
          data._jsxErr = '';
        }).catch(e => {
          data._jsxErr = e?.message ?? '未知错误'
        });
      }
      
      if (id && data._less && !data.css) {
        transformCss(DefaultLessCode, CSS_LANGUAGE.Less, {id}).then(css => {
          data.css = css;
          data._cssErr = '';
        }).catch(e => {
          data._cssErr = e?.message ?? '未知错误'
        })
      }
      
      
      catalog[0].title = '常规';
      catalog[0].items = [
        ...(() => {
          const sourceCode = data.sourceCode
          if (sourceCode && sourceCode.editors
            //&& !data._editors
          ) {
            const code = sourceCode.editors
            const editorsAry = eval(`(${code})`)({})
            data._editors = editorsAry
          }
          
          const rtn = []
          if (data._editors) {
            if (!data['_defined']) {
              data['_defined'] = {}
            }
            
            data._editors.forEach(edt => {
              //debugger
              
              if (!(edt.title && edt.type
                && edt.value && edt.value.set)) {
                debugger
                
                return
              }
              
              rtn.push({
                title: edt.title,
                type: edt.type,
                options: edt.options,
                value: {
                  get({data}) {
                    if (typeof edt.value.get === 'function') {
                      const definedData = data['_defined']
                      return edt.value.get({data: definedData})
                    }
                  },
                  set({data}, val) {
                    const definedData = data['_defined']
                    edt.value.set({data: definedData}, val)
                  }
                }
              })
            })
          }
          
          return rtn
        })(),
        {
          title: '事件',
          items: [
            ...(() => {
              const relOutputIdMap = {}
              data.inputs.forEach(({rels}) => {
                if (rels) {
                  rels.forEach((relOutputId) => {
                    relOutputIdMap[relOutputId] = true
                  })
                }
              })
              
              return data.outputs.filter(({key}) => {
                return !relOutputIdMap[key]
              }).map(({id, title}) => {
                return {
                  title,
                  type: '_Event',
                  options: {
                    outputId: id
                  }
                }
              })
            })()
          ]
        }
      ]
      
      catalog[1].title = '定义'
      catalog[1].items = [
        {
          title: '编辑',
          items: [
            {
              type: 'Array',
              options: {
                draggable: true,
                getTitle: (item) => {
                  return `${item.title}`;
                },
                onAdd: () => {
                  const id = uuid();
                  return {
                    id,
                    title: '编辑项'
                  };
                },
                items: [
                  {
                    title: 'ID',
                    type: 'text',
                    value: 'id'
                  },
                  {
                    title: '名称',
                    type: 'text',
                    value: 'title'
                  }
                ]
              },
              value: {
                get({data}) {
                  return data.inputs.map((input) => {
                    return {
                      ...input,
                      rels: input.rels[0] || ''
                    }
                  });
                },
                set({data, input}, value) {
                  const {deleteIds, addIdsMap} = compareIO(data.inputs, value);
                  // 删除输入
                  deleteIds.forEach((id) => {
                    input.remove(id)
                  })
                  // 更新inputs数据
                  data.inputs = value.map(({id, key, title, schema, rels: rel, ...other}) => {
                    const rels = rel ? [rel] : [];
                    if (addIdsMap[key]) {
                      // 添加
                      input.add(key, title, schema)
                      input.get(key).setRels(rels)
                    } else {
                      // 更新
                      const currentInput = input.get(key)
                      currentInput.setTitle(title)
                      currentInput.setSchema(schema)
                      currentInput.setRels(rels)
                    }
                    
                    return {
                      ...other,
                      id,
                      key,
                      title,
                      schema,
                      rels
                    }
                  })
                }
              }
            },
          ]
        },
        {
          title: '插槽',
          items: [
            {
              type: 'Array',
              options: {
                draggable: false,
                getTitle: (item) => {
                  return `${item.title}(${item.id})`;
                },
                onAdd: () => {
                  const id = uuid();
                  return {
                    id,
                    key: id,
                    title: '输入项',
                    rels: '',
                    schema: {
                      type: 'any'
                    }
                  };
                },
                items: [
                  {
                    title: 'ID',
                    type: 'text',
                    value: 'id'
                  },
                  {
                    title: '名称',
                    type: 'text',
                    value: 'title'
                  },
                  {
                    title: '关联输出项',
                    type: 'select',
                    value: 'rels',
                    options: {
                      options: [{label: '[无]', value: ''}].concat(data.outputs.map((output) => {
                        return {
                          label: output.title,
                          value: output.key
                        }
                      }))
                    }
                  }
                ]
              },
              value: {
                get({data}) {
                  return data.inputs.map((input) => {
                    return {
                      ...input,
                      rels: input.rels[0] || ''
                    }
                  });
                },
                set({data, input}, value) {
                  const {deleteIds, addIdsMap} = compareIO(data.inputs, value);
                  // 删除输入
                  deleteIds.forEach((id) => {
                    input.remove(id)
                  })
                  // 更新inputs数据
                  data.inputs = value.map(({id, key, title, schema, rels: rel, ...other}) => {
                    const rels = rel ? [rel] : [];
                    if (addIdsMap[key]) {
                      // 添加
                      input.add(key, title, schema)
                      input.get(key).setRels(rels)
                    } else {
                      // 更新
                      const currentInput = input.get(key)
                      currentInput.setTitle(title)
                      currentInput.setSchema(schema)
                      currentInput.setRels(rels)
                    }
                    
                    return {
                      ...other,
                      id,
                      key,
                      title,
                      schema,
                      rels
                    }
                  })
                }
              }
            },
          ]
        },
        {
          title: '输入',
          items: [
            {
              type: 'Array',
              options: {
                draggable: false,
                getTitle: (item) => {
                  return `${item.title}(${item.id})`;
                },
                onAdd: () => {
                  const id = uuid();
                  return {
                    id,
                    key: id,
                    title: '输入项',
                    rels: '',
                    schema: {
                      type: 'any'
                    }
                  };
                },
                items: [
                  {
                    title: 'ID',
                    type: 'text',
                    value: 'id'
                  },
                  {
                    title: '名称',
                    type: 'text',
                    value: 'title'
                  },
                  {
                    title: '关联输出项',
                    type: 'select',
                    value: 'rels',
                    options: {
                      options: [{label: '[无]', value: ''}].concat(data.outputs.map((output) => {
                        return {
                          label: output.title,
                          value: output.key
                        }
                      }))
                    }
                  }
                ]
              },
              value: {
                get({data}) {
                  return data.inputs.map((input) => {
                    return {
                      ...input,
                      rels: input.rels[0] || ''
                    }
                  });
                },
                set({data, input}, value) {
                  const {deleteIds, addIdsMap} = compareIO(data.inputs, value);
                  // 删除输入
                  deleteIds.forEach((id) => {
                    input.remove(id)
                  })
                  // 更新inputs数据
                  data.inputs = value.map(({id, key, title, schema, rels: rel, ...other}) => {
                    const rels = rel ? [rel] : [];
                    if (addIdsMap[key]) {
                      // 添加
                      input.add(key, title, schema)
                      input.get(key).setRels(rels)
                    } else {
                      // 更新
                      const currentInput = input.get(key)
                      currentInput.setTitle(title)
                      currentInput.setSchema(schema)
                      currentInput.setRels(rels)
                    }
                    
                    return {
                      ...other,
                      id,
                      key,
                      title,
                      schema,
                      rels
                    }
                  })
                }
              }
            },
          ]
        },
        {
          title: '输出',
          items: [
            {
              type: 'Array',
              options: {
                draggable: false,
                getTitle: (item) => {
                  return `${item.title}(${item.id})`;
                },
                onAdd: () => {
                  const id = uuid();
                  return {
                    id,
                    key: id,
                    title: '输出项',
                    schema: {
                      type: 'any'
                    }
                  }
                },
                items: [
                  {
                    title: 'ID',
                    type: 'text',
                    value: 'id'
                  },
                  {
                    title: '名称',
                    type: 'text',
                    value: 'title'
                  },
                ]
              },
              value: {
                get({data}) {
                  return data.outputs
                },
                set({data, output}, value) {
                  const {deleteIds, addIdsMap} = compareIO(data.outputs, value);
                  // 删除输入
                  deleteIds.forEach((id) => {
                    output.remove(id)
                  })
                  
                  // 更新outputs数据
                  data.outputs = value.map(({id, key, title, schema, ...other}) => {
                    if (addIdsMap[key]) {
                      // 添加
                      output.add(key, title, schema)
                    } else {
                      // 更新
                      const currentOutput = output.get(key)
                      currentOutput.setTitle(title)
                      currentOutput.setSchema(schema)
                    }
                    
                    return {
                      ...other,
                      id,
                      key,
                      title,
                      schema,
                    }
                  })
                }
              }
            }
          ]
        }
      ]
      
      
      catalog[2].title = '代码'
      catalog[2].items = [
        {
          title: 'JSX',
          type: 'code',
          catelog: 'JSX',
          options: {
            title: '编辑自定义JSX',
            language: 'typescript',
            width: 600,
            minimap: {
              enabled: false
            },
            eslint: {
              parserOptions: {
                ecmaVersion: '2020',
                sourceType: 'module'
              }
            },
            babel: false,
            //comments: Comments,
            autoSave: false,
            preview: false,
            extraLib: data.extraLib,
            isTsx: true
          },
          value: {
            get({data}) {
              const sourceCode = data.sourceCode
              if (sourceCode) {
                return sourceCode.render
              }
            },
            set({data, id}, jsx: string) {
              let sourceCode = data.sourceCode
              if (!sourceCode) {
                data.sourceCode = sourceCode = {}
              }
              
              sourceCode.render = jsx
              
              transformTsx(decodeURIComponent(jsx), {id}).then(code => {
                data.code = code
                data._jsxErr = '';
              }).catch(e => {
                data._jsxErr = e?.message ?? '未知错误'
              })
            }
          }
        },
        {
          title: 'Less',
          type: 'code',
          catelog: 'Less',
          options: {
            title: 'Less',
            language: 'less',
            width: 600,
            minimap: {
              enabled: false
            },
            autoSave: false,
            preview: false
          },
          ifVisible({data}) {
            return data.cssLan === CSS_LANGUAGE.Less;
          },
          value: {
            get({data}) {
              const sourceCode = data.sourceCode
              if (sourceCode) {
                return sourceCode.style
              }
            },
            set({data, id}, less: string) {
              let sourceCode = data.sourceCode
              if (!sourceCode) {
                data.sourceCode = sourceCode = {}
              }
              
              sourceCode.style = less
              
              transformCss(decodeURIComponent(less), data.cssLan, {id}).then(css => {
                data.css = css;
                data._cssErr = '';
              }).catch(e => {
                data._cssErr = e?.message ?? '未知错误'
              })
            }
          }
        },
        {
          title: 'Data',
          type: 'code',
          catelog: 'Data',
          options: {
            title: 'Data',
            language: 'JSON',
            width: 600,
            minimap: {
              enabled: false
            },
            autoSave: false,
            preview: false
          },
          value: {
            get({data}) {
              const sourceCode = data.sourceCode
              if (sourceCode) {
                return sourceCode.data
              }
            },
            set({data, id}, json: string) {
              let sourceCode = data.sourceCode
              if (!sourceCode) {
                data.sourceCode = sourceCode = {}
              }
              
              sourceCode.data = json
            }
          }
        }
      ]
    }
  },
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
  '[data-mybricks-zone]': {
    items({data, env, id, input, output}, ...catalog) {
      catalog[0].title = '子组件';
      catalog[0].items = [
        {
          title: '测试',
          type: 'text',
          value: {
            get() {
            
            }, set() {
            
            }
          }
        }
      ]
    }
  }
}
