import { CODE_TEMPLATE, COMMENTS, Data, IMMEDIATE_CODE_TEMPLATE } from './constants';
import { setInputSchema, genLibTypes, updateOutputSchema, getIoOrder } from './util';

export default {
  '@init': ({ data, setAutoRun, isAutoRun, output }: EditorResult<Data>) => {
    const autoRun = isAutoRun ? isAutoRun() : false;
    if (autoRun || data.runImmediate) {
      setAutoRun(true);
      data.runImmediate = true;
      output.get('output0').setSchema({ type: 'number' });
      data.extraLib = `declare interface IO {outputs: Array<Function>}`
    }
    data.fns = data.fns || (data.runImmediate ? IMMEDIATE_CODE_TEMPLATE : CODE_TEMPLATE);
  },
  async '@inputConnected'({ data, output, input }: EditorResult<Data>, fromPin, toPin) {
    if (data.fns === CODE_TEMPLATE) {
      output.get('output0').setSchema({ type: 'unknown' });
    }
    const schemaList = setInputSchema(toPin.id, fromPin.schema, data, input)
    data.extraLib = await genLibTypes(schemaList)
  },
  async '@inputUpdated'({ data, input }: EditorResult<Data>, updatePin) {
    const schemaList = setInputSchema(updatePin.id, updatePin.schema, data, input)
    data.extraLib = await genLibTypes(schemaList)
  },
  async '@inputRemoved'({ data, input }: EditorResult<Data>, removedPin) {
    const schemaList = setInputSchema(removedPin.id, null, data, input)
    data.extraLib = await genLibTypes(schemaList)
  },
  async '@inputDisConnected'({ data, input }: EditorResult<Data>, fromPin, toPin) {
    const schemaList = setInputSchema(toPin.id, { type: 'null' }, data, input)
    data.extraLib = await genLibTypes(schemaList)
  },
  ':root': [
    {
      title: '添加输入项',
      type: 'Button',
      description: "按需添加一个新的输入项",
      ifVisible({ data }: EditorResult<Data>) {
        return !data.runImmediate;
      },
      value: {
        set({ input }: EditorResult<Data>) {
          const idx = getIoOrder(input);
          const hostId = `input.inputValue${idx}`;
          const title = `参数${idx}`;
          input.add({
            id: hostId,
            title,
            schema: { type: 'follow' },
            deletable: true,
            editable: true
          });
        }
      }
    },
    {
      title: '添加输出项',
      type: 'Button',
      description: "按需添加一个新的输出项",
      value: {
        set({ output }: EditorResult<Data>) {
          const idx = getIoOrder(output);
          const hostId = `output${idx}`;
          const title = `输出项${idx}`;
          output.add({
            id: hostId,
            title,
            schema: {
              type: 'unknown'
            },
            editable: true,
            deletable: true
          });
        }
      }
    },
    {
      type: 'code',
      options: ({ data, output }) => {
        const option = {
          babel: true,
          comments: COMMENTS,
          theme: 'light',
          minimap: {
            enabled: false
          },
          lineNumbers: 'on',
          eslint: {
            parserOptions: {
              ecmaVersion: '2020',
              sourceType: 'module'
            }
          },
          autoSave: false,
          extraLib: data.extraLib,
          language: 'typescript',
          onBlur: () => {
            updateOutputSchema(output, data.fns);
          }
        };
        return option;
      },
      title: '代码编辑',
      description: "编写自定义 JavaScript 代码，请确保代码中实际使用的输入项数量、输出项数量，与已配置/添加的输入项、输出项数量完全匹配。",
      value: {
        get({ data }: EditorResult<Data>) {
          return data.fns;
        },
        set({ data }: EditorResult<Data>, fns: any) {
          if (fns === '') return;
          data.fns = fns;
        }
      }
    }
  ]
};