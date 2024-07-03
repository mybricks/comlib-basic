import { Data, IOEvent, CSS_LANGUAGE } from './types';
import { DefaultCode, DefaultLessCode, Comments, getParamsType } from './constants';
import { transformTsx, transformCss, genLibTypes, loadLess, loadBabel } from './transform'
import { uuid } from './util'

// TODO: 后面去掉
loadLess()
loadBabel()

export default {
  '@init': ({ style, data, id }: EditorResult<Data>) => {
    data.extraLib = getParamsType()
    data._code = encodeURIComponent(DefaultCode);
  
    data.cssLan = CSS_LANGUAGE.Less;

    data._less = encodeURIComponent(DefaultLessCode)
  },
  async '@inputConnected'({ data, output, input }: EditorResult<Data>, fromPin, toPin) {
    data.extraLib = await genLibTypes(fromPin.schema)
  },
  async '@inputUpdated'({ data, input }: EditorResult<Data>, updatePin) {
    data.extraLib = await genLibTypes(updatePin.schema)
  },
  async '@inputDisConnected'({ data, input }: EditorResult<Data>, fromPin, toPin) {
    data.extraLib = await genLibTypes({type: 'null'})
  },
  ':root': {
    items({ data, env, id }: EditorResult<Data>, ...catalog) {
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
       
        // {
        //   title: '事件',
        //   items: [
        //     {
        //       title: '输出配置',
        //       type: 'Array',
        //       options: {
        //         draggable: false,
        //         getTitle: (item: IOEvent, index: number) => {
        //           if (!item.label) {
        //             item.label = `输出项${index + 1}`;
        //           }
        //           return `${item.label}(${item.key})`;
        //         },
        //         onAdd: () => {
        //           return {
        //             key: uuid()
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
      // catalog[1].title = '事件输出';
      // catalog[1].items = [
        
      // ];
    }
  }
};
