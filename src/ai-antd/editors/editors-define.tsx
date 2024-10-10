import {uuid} from "../util";
import {compareIO} from "../../custom-render/util";

export default function getDefine({data, env, id, input, output}, catalog) {
  
  if (!data.editors) {
    data.editors = {
      ':root': []
    }
  }
  
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
                title: `编辑项${data.editors[':root'].length + 1}`
              };
            },
            items: [
              {
                title: '名称',
                type: 'text',
                value: 'title'
              }
            ]
          },
          value: {
            get({data}) {
              const rootEditors = data.editors[':root']
              return rootEditors.map((editor) => {
                return editor
              })
            },
            set({data, input}, value) {
              data.editors[':root'] = value
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
}