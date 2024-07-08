import { Data, CSS_LANGUAGE } from './types';
import { DefaultCode, DefaultLessCode, DefaultJSONCode, Comments, getParamsType } from './constants';
import { transformTsx, transformCss, genLibTypes, loadLess, loadBabel } from './transform'
import { uuid, safeDecodeParseJsonCode, compareIO } from './util'

// TODO: 后面去掉
loadLess()
loadBabel()

function updateIOConfigurations(params: EditorResult<Data>, comJSON) {
  const { input, output } = params;
  const { inputs, outputs } = comJSON;
  inputs.forEach(({ id, schema, title, rels }) => {
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
  outputs.forEach(({ id, schema, title}) => {
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
  '@init': (params: EditorResult<Data>) => {
    const { style, data, id, input, output } = params;
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
  // async '@inputConnected'({ data, output, input }: EditorResult<Data>, fromPin, toPin) {
  //   console.log("@inputConnected")
  //   data.extraLib = await genLibTypes(fromPin.schema)
  // },
  // async '@inputUpdated'({ data, input }: EditorResult<Data>, updatePin) {
  //   console.log("@inputUpdated")
  //   data.extraLib = await genLibTypes(updatePin.schema)
  // },
  // async '@inputDisConnected'({ data, input }: EditorResult<Data>, fromPin, toPin) {
  //   console.log("@inputDisConnected")
  //   data.extraLib = await genLibTypes({type: 'null'})
  // },
  ':root': {
    items({ data, env, id, input, output }: EditorResult<Data>, ...catalog) {
      // 兼容一下，发现@init里面没有id，只能在这里先实现了
      if (id && data._less && !data.css) {
        transformCss(DefaultLessCode, CSS_LANGUAGE.Less, { id }).then(css => {
          data.css = css;
          data._cssErr = '';
        }).catch(e => {
          data._cssErr = e?.message ?? '未知错误'
        })
      }
      if (id && data._code && !data.code) {
        transformTsx(DefaultCode, { id }).then(code => {
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
        data.outputs = [
          {
            id: 'click',
            title: '单击',
            key: uuid(),
            schema: {
              type: 'string'
            },
          },
          {
            id: 'setTitleDone',
            key: setTitleDoneKey,
            title: '设置标题完成',
            schema: {
              type: 'string'
            },
          }
        ]
        data.inputs = [
          {
            id: 'setTitle',
            key: uuid(),
            title: '设置标题',
            schema: {
              type: 'string'
            },
            rels: [setTitleDoneKey]
          },
        ]
        data.outputs.forEach(({ id, key, schema, title }) => {
          output.add(key, title, schema)
        })
        data.inputs.forEach(({ id, key, schema, title, rels }) => {
          input.add(key, title, schema)
          input.get(key).setRels(rels)
        })
      }

      catalog[0].title = '配置';
      catalog[0].items = [
        {
          title: '组件代码',
          items: [
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
                get({ data }: EditorResult<Data>) {
                  return data._code;
                },
                set({ data, id }: EditorResult<Data>, val: string) {
                  data._code = val;

                  transformTsx(decodeURIComponent(val), { id }).then(code => {
                    data.code = code;
                    data._jsxErr = '';
                  }).catch(e => {
                    data._jsxErr = e?.message ?? '未知错误'
                  })
                }
              }
            },
            // {
            //   title: '文件类型',
            //   type: 'select',
            //   catelog: '样式文件',
            //   options: [
            //     { label: 'Css 语法', value: CSS_LANGUAGE.Css },
            //     { label: 'Less 语法', value: CSS_LANGUAGE.Less },
            //     { label: 'Scss 语法', value: CSS_LANGUAGE.Scss },
            //   ],
            //   value: {
            //     get({ data }: EditorResult<Data>) {
            //       return data.cssLan ?? CSS_LANGUAGE.Css;
            //     },
            //     set({ data, id }: EditorResult<Data>, val: CSS_LANGUAGE) {
            //       data.cssLan = val;
            //     }
            //   }
            // },
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
              ifVisible({ data }: EditorResult<Data>) {
                return data.cssLan === CSS_LANGUAGE.Less;
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data._less;
                },
                set({ data, id }: EditorResult<Data>, val: string) {
                  data._less = val;
                  transformCss(decodeURIComponent(val), data.cssLan, { id }).then(css => {
                    data.css = css;
                    data._cssErr = '';
                  }).catch(e => {
                    data._cssErr = e?.message ?? '未知错误'
                  })
                }
              }
            },
            // {
            //   title: '配置',
            //   type: 'code',
            //   catelog: '配置',
            //   options: {
            //     title: 'JSON',
            //     language: 'json',
            //     width: 600,
            //     minimap: {
            //       enabled: false
            //     },
            //     autoSave: false,
            //     preview: false
            //   },
            //   value: {
            //     get({ data }: EditorResult<Data>) {
            //       return data._JSON;
            //     },
            //     set(params: EditorResult<Data>, val: string) {
            //       const json = safeDecodeParseJsonCode(val);

            //       if (json) {
            //         const { data, id } = params;
            //         updateIOConfigurations(params, json);
            //         data._JSON = val;
            //       }
            //     }
            //   }
            // }
            // {
            //   title: 'Css代码',
            //   type: 'code',
            //   catelog: '样式文件',
            //   options: {
            //     title: 'Css代码',
            //     language: 'css',
            //     width: 600,
            //     minimap: {
            //       enabled: false
            //     },
            //     autoSave: false,
            //     preview: false
            //   },
            //   ifVisible({ data }: EditorResult<Data>) {
            //     return data.cssLan === CSS_LANGUAGE.Css || !data?.cssLan;
            //   },
            //   value: {
            //     get({ data }: EditorResult<Data>) {
            //       return data._css;
            //     },
            //     set({ data, id }: EditorResult<Data>, val: string) {
            //       transformCss(decodeURIComponent(val), data.cssLan, { id }).then(css => {
            //         data.css = css
            //         data._css = val
            //       })
            //     }
            //   }
            // },
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
                      options: [{ label: '[无]', value: '' }].concat(data.outputs.map((output) => {
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
                get({ data }: EditorResult<Data>) {
                  return data.inputs.map((input) => {
                    return {
                      ...input,
                      rels: input.rels[0] || ''
                    }
                  });
                },
                set({ data, input }: EditorResult<Data>, value) {
                  const { deleteIds, addIdsMap } = compareIO(data.inputs, value);
                  // 删除输入
                  deleteIds.forEach((id) => {
                    input.remove(id)
                  })
                  // 更新inputs数据
                  data.inputs = value.map(({ id, key, title, schema, rels: rel, ...other }) => {
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
                ]
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.outputs
                },
                set({ data, output }: EditorResult<Data>, value) {
                  const { deleteIds, addIdsMap } = compareIO(data.outputs, value);
                  // 删除输入
                  deleteIds.forEach((id) => {
                    output.remove(id)
                  })
                  // 更新outputs数据
                  data.outputs = value.map(({ id, key, title, schema, ...other }) => {
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
              data.inputs.forEach(({ rels }) => {
                if (rels) {
                  rels.forEach((relOutputId) => {
                    relOutputIdMap[relOutputId] = true
                  })
                }
              })
              return data.outputs.filter(({ key }) => {
                return !relOutputIdMap[key]
              }).map(({ key, title }) => {
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
        },

     
       
        // {
        //   title: '输出',
        //   items: [
        //     {
        //       // title: '输出配置',
        //       type: 'Array',
        //       options: {
        //         draggable: false,
        //         getTitle: (item: IOEvent) => {
        //           if (!item.label) {
        //             item.label = `输出项`;
        //           }
        //           return `${item.label}(${item.key})`;
        //         },
        //         onAdd: () => {
        //           const id = uuid();
        //           return {
        //             id,
        //             key: id,
        //           };
        //         },
        //         items: [
        //           {
        //             title: 'ID',
        //             type: 'text',
        //             value: 'key'
        //           },
        //           {
        //             title: '名称',
        //             type: 'text',
        //             value: 'label'
        //           }
        //         ]
        //       },
        //       value: {
        //         get({ data }: EditorResult<Data>) {
        //           return data.events || [];
        //         },
        //         set({ data, output }: EditorResult<Data>, value: Array<IOEvent>) {
        //           console.log("data.events: ", data.events)
        //           if (Array.isArray(value)) {
        //             value.forEach((item) => {
        //               const hasEvent = output.get(item.key);
        //               if (hasEvent) {
        //                 output.setTitle(item.key, item.label);
        //               } else {
        //                 output.add(item.key, item.label, { type: 'any' });
        //               }
        //             });
        //           }
        //           (data.events || []).forEach(({ key }) => {
        //             if (!(value || []).some((item) => item.key === key)) {
        //               output.get(key) && output.remove(key);
        //             }
        //           });
        //           data.events = [...value];
        //         }
        //       }
        //     },
        //     ...((data.events ?? []).map((item) => ({
        //       title: item.label,
        //       type: '_Event',
        //       // ifVisible: ({ output }: EditorResult<Data>) => {
        //       //   return !!output.get(item.key);
        //       // },
        //       options: {
        //         outputId: item.key
        //       }
        //     })))
        //   ]
        // }
      ];

      // const { inputs, outputs } = JSON.parse(decodeURIComponent(data._JSON))
      // const relOutputIdMap = {}
      // inputs.forEach(({ rels }) => {
      //   if (rels) {
      //     rels.forEach((relOutputId) => {
      //       relOutputIdMap[relOutputId] = true
      //     })
      //   }
      // })

      // catalog[1].title = '事件';
      // catalog[1].items = outputs.filter(({ id }) => {
      //   return !relOutputIdMap[id]
      // }).map(({ id, title }) => {
      //   return {
      //     title,
      //     type: '_Event',
      //     options: {
      //       outputId: id
      //     }
      //   }
      // });
    }
  }
};
