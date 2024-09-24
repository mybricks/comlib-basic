import {DefaultCode, DefaultLessCode, DefaultJSONCode, Comments, getParamsType} from './constants';
import {transformTsx, transformCss, genLibTypes, loadLess, loadBabel} from './transform'
import {uuid, safeDecodeParseJsonCode, compareIO} from './util'
import {CSS_LANGUAGE, Data} from "../custom-render/types";

// TODO: 后面去掉
loadLess()
loadBabel()

function updateIOConfigurations(params, comJSON) {
  const {input, output} = params;
  const {inputs, outputs} = comJSON;
  inputs.forEach(({id, schema, title, rels}) => {
    const I = input.get(id);
    if (!I) {
      input.add(id, title, schema);
      input.get(id).setRels(rels);
    } else {
      I.setTitle(title);
      I.setSchema(schema);
      I.setRels(rels);
    }
  })
  outputs.forEach(({id, schema, title}) => {
    const O = output.get(id);
    if (!O) {
      output.add(id, title, schema);
    } else {
      O.setTitle(title);
      O.setSchema(schema);
    }
  })
}

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
  '@toJSON': ({data}) => {
    // 只保留运行时需要用的数据
    const {code, css, inputs, outputs, _cssErr, _jsxErr} = data;
    return {
      data: {
        code,
        css,
        inputs: inputs.map(({id, key}) => {
          return {
            id, key
          }
        }),
        outputs: outputs.map(({id, key}) => {
          return {
            id, key
          }
        }),
        _cssErr,
        _jsxErr
      }
    }
  },
  ':root': {
    items({data, env, id, input, output}, ...catalog) {
      // 兼容一下，发现@init里面没有id，只能在这里先实现了
      if (id && data._less && !data.css) {
        transformCss(DefaultLessCode, CSS_LANGUAGE.Less, {id}).then(css => {
          data.css = css;
          data._cssErr = '';
        }).catch(e => {
          data._cssErr = e?.message ?? '未知错误'
        })
      }
      
      if (id && data._code && !data.code) {
        transformTsx(DefaultCode, {id}).then(code => {
          data.code = code
          data._jsxErr = '';
        }).catch(e => {
          data._jsxErr = e?.message ?? '未知错误'
        });
      }
      // if (!data._JSON) {
      //   data._JSON = encodeURIComponent(DefaultJSONCode)
      // }
      if (!data.outputs) {
        const setTitleDoneKey = uuid()
        // data.outputs = [
        //   {
        //     id: 'click',
        //     title: '单击',
        //     key: uuid(),
        //     schema: {
        //       type: 'string'
        //     },
        //   },
        //   {
        //     id: 'setTitleDone',
        //     key: setTitleDoneKey,
        //     title: '设置标题完成',
        //     schema: {
        //       type: 'string'
        //     },
        //   }
        // ]
        // data.inputs = [
        //   {
        //     id: 'setTitle',
        //     key: uuid(),
        //     title: '设置标题',
        //     schema: {
        //       type: 'string'
        //     },
        //     rels: [setTitleDoneKey]
        //   },
        // ]
        data.outputs = []
        data.inputs = []
        
        data.outputs.forEach(({id, key, schema, title}) => {
          output.add(key, title, schema)
        })
        
        data.inputs.forEach(({id, key, schema, title, rels}) => {
          input.add(key, title, schema)
          input.get(key).setRels(rels)
        })
      }
      
      catalog[0].title = '常规';
      catalog[0].items = [
        {
          title: 'AI',
          type: '_ai',
          options({data}) {
            const inputsPrompts = []
            const inputs = data.inputs
            if (inputs.length > 0) {
              inputsPrompts.push('仅可以使用以下输入项：')
              inputs.map(int => {
                inputsPrompts.push(JSON.stringify({
                  id: int.id,
                  title: int.title,
                  schema: int.schema
                }))
              })
            } else {
              inputsPrompts.push('没有定义任何输入项.')
            }
            
            const outputPrompts = []
            const outputs = data.outputs
            if (outputs?.length > 0) {
              outputPrompts.push('仅可以使用以下输出项：')
              outputs.map(out => {
                outputPrompts.push(JSON.stringify({
                  id: out.id,
                  title: out.title,
                  schema: out.schema
                }))
              })
            } else {
              inputsPrompts.push('没有定义任何输出项.')
            }
            
            return {
              type: 'dialog',
              getSystemPrompts() {
                return `
你是一位资深、严谨的前端开发专家，需要基于react、antd、@ant-design以及Less、HTML、CSS、Javascript完成当前组件的开发。

当前组件的代码由JSX部分与Less两部分构成，通过exeSourceCode函数执行当前组件的源代码、以查看当前组件的效果。

1、JSX部分，由一个匿名函数构成，例如：
    import {Button} from 'antd';//antd中的组件
    import css from 'index.less';//index.less为返回的less代码
    
    export default ({inputs,outputs}) => {
    
      return (//JSX部分的代码
        <Button className={css.btn}>按钮</Button>
      )
    }

    注意：
    1）仅可以依赖react、antd、@ant-design中的内容，不允许使用其他任何库；
    2）函数接收一个对象参数，包含inputs和outputs两个属性，分别代表该组件的输入项和组件的输出项。
      inputs是一个数组，仅提供对于输入项的输入监听，形如：
      inputs['输入项的id'](val=>{/**输入项的值变化时的回调函数*/})，其中，val为输入项的值，id为输入项的id。
      outputs是一个对象，提供对于输出项的输出方法，形如：
      outputs['输出项的id'](val)，其中，'输出项的id'为输出项的id,val为输出项的值。

2、Less部分，为当前组件的样式代码,例如：
  .btn{
    color: red;
  }

注意：
1、回答问题请确保结果合理严谨，不要出现任何错误；
2、在当前组件中：
  ${inputsPrompts.join('\n')}
  ${outputPrompts.join('\n')}
3、在回答问题中仅需给出简要说明即可，不需要对代码做解释说明；
4、如果有答案，则直接回答问题，否则回答原因；
5、每次回答如果有代码结果，尽量都通过exeSourceCode函数执行返回的源代码以查看效果；
              `
              },
              getAssistPrompts() {
                const sourceCode = data.sourceCode
                if (sourceCode && sourceCode.jsx) {
                  return `源代码:${JSON.stringify(sourceCode)}`
                }
              },
              getTools() {
                return [
                  {
                    type: 'function',
                    function: {
                      name: "exeSourceCode",
                      description: "执行当前组件的源代码",
                      parameters: {
                        type: "object",
                        required: ["jsxCode", "lessCode"],
                        properties: {
                          "jsxCode": {
                            type: "string",
                            description: "组件的JSX源码",
                          },
                          "lessCode": {
                            type: "string",
                            description: "组件的Less源码"
                          },
                        },
                      },
                    }
                  },
                ]
              }
            }
          },
          value: {
            get({data}) {
              const sourceCode = data.sourceCode
              if (sourceCode && sourceCode.jsx) {
                return JSON.stringify(sourceCode)
              }
            },
            set({data, id}, tool_calls: string) {
              if (tool_calls && tool_calls.length > 0) {
                
                const lastOne = tool_calls[tool_calls.length - 1]
                // tool_calls.forEach(fn=>{
                //   console.log(fn.function.arguments)
                // })
                //
                // return
                
                const args = lastOne.function.arguments
                
                console.log(args)
                
                
                // debugger
                //
                // let jsonObj
                // try {
                //   jsonObj = eval(`(${json})`)
                // } catch (ex) {
                //   debugger
                //   console.error(ex)
                // }
                //debugger
                
                
                const sourceCode = JSON.parse(args)
                const {jsxCode: jsx, lessCode: less} = sourceCode
                
                data.sourceCode = sourceCode
                //data._code = val;
                
                if (jsx) {
                  transformTsx(jsx, {id}).then(code => {
                    data.code = code;
                    data._jsxErr = ''
                  }).catch(e => {
                    data._jsxErr = e?.message ?? '未知错误'
                  })
                  
                  if (less) {////TODO 继续探索，修改提示词，要求返回详细过程
                    transformCss(less, data.cssLan, {id}).then(css => {
                      data.css = css;
                      data._cssErr = '';
                    }).catch(e => {
                      data._cssErr = e?.message ?? '未知错误'
                    })
                  } else {
                    data.css = ''
                  }
                }
                
              }
            }
          }
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
                get({data}: EditorResult<Data>) {
                  return data.inputs.map((input) => {
                    return {
                      ...input,
                      rels: input.rels[0] || ''
                    }
                  });
                },
                set({data, input}: EditorResult<Data>, value) {
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
                get({data}: EditorResult<Data>) {
                  return data.outputs
                },
                set({data, output}: EditorResult<Data>, value) {
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
            },
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
              }).map(({key, title}) => {
                return {
                  title,
                  type: '_Event',
                  options: {
                    outputId: key
                  }
                }
              })
            })()
          ]
        }
      ]
      
      catalog[1].title = '代码';
      catalog[1].items = [
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
            comments: Comments,
            autoSave: false,
            preview: false,
            extraLib: data.extraLib,
            isTsx: true
          },
          value: {
            get({data}: EditorResult<Data>) {
              const sourceCode = data.sourceCode
              if (sourceCode) {
                return sourceCode.jsxCode
              }
            },
            set({data, id}: EditorResult<Data>, jsx: string) {
              let sourceCode = data.sourceCode
              if (!sourceCode) {
                data.sourceCode = sourceCode = {}
              }
              
              sourceCode.jsxCode = jsx
              
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
          ifVisible({data}: EditorResult<Data>) {
            return data.cssLan === CSS_LANGUAGE.Less;
          },
          value: {
            get({data}: EditorResult<Data>) {
              const sourceCode = data.sourceCode
              if (sourceCode) {
                return sourceCode.lessCode
              }
            },
            set({data, id}: EditorResult<Data>, less: string) {
              let sourceCode = data.sourceCode
              if (!sourceCode) {
                data.sourceCode = sourceCode = {}
              }
              
              sourceCode.lessCode = less
              
              transformCss(decodeURIComponent(less), data.cssLan, {id}).then(css => {
                data.css = css;
                data._cssErr = '';
              }).catch(e => {
                data._cssErr = e?.message ?? '未知错误'
              })
            }
          }
        }
      ]
    }
  }
};
