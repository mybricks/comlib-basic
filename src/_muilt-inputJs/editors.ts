import { CODE_TEMPLATE, COMMENTS, Data, IMMEDIATE_CODE_TEMPLATE } from './constants';
import { jsonToSchema, convertObject2Array } from './util';
import Sandbox from './com-utils/sandbox'

export default {
  '@init': ({ data, setAutoRun, isAutoRun, output }: EditorResult<Data>) => {
    const autoRun = isAutoRun ? isAutoRun() : false;
    if (autoRun || data.runImmediate) {
      setAutoRun(true);
      data.runImmediate = true;
      output.get('output0').setSchema({ type: 'number' });
    }
    data.fns = data.fns || (data.runImmediate ? IMMEDIATE_CODE_TEMPLATE : CODE_TEMPLATE);
  },
  '@inputConnected'({ data, output }, fromPin) {
    if (data.fns === CODE_TEMPLATE) {
      output.get('output0').setSchema({ type: 'unknown' });
    }
  },
  ':root': [
    {
      title: '添加输入项',
      type: 'Button',
      ifVisible({ data }: EditorResult<Data>) {
        return !data.runImmediate;
      },
      value: {
        set({ input }: EditorResult<Data>) {
          const idx = getIoOrder(input);
          const hostId = `input.inputValue${idx}`;
          const title = `参数${idx}`;
          input.add(hostId, title, { type: 'follow' }, true);
        }
      }
    },
    {
      title: '添加输出项',
      type: 'Button',
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
          onBlur: () => {
            updateOutputSchema(output, data.fns);
          }
        };
        return option;
      },
      title: '代码编辑',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.fns;
        },
        set({ data }: EditorResult<Data>, fns: any) {
          data.fns = fns;
        }
      }
    }
  ]
};

function updateOutputSchema(output, code) {
  const outputs = {};
  const inputs = {};
  output.get().forEach(({ id }) => {
    outputs[id] = (v: any) => {
      try {
        const schema = jsonToSchema(v);
        output.get(id).setSchema(schema);
      } catch (error) {
        output.get(id).setSchema({ type: 'unknown' });
      }
    };
  });

  setTimeout(() => {
    try {
      const sandbox = new Sandbox({module: true})
      const fn = sandbox.compile(`${decodeURIComponent(code.code || code)}`)
      const params = {
        inputValue: void 0,
        outputs: convertObject2Array(outputs),
        inputs: convertObject2Array(inputs)
      }
      fn.run([params], () => {});
    } catch (error) {
      console.error(error)
    }
  })
}

function getIoOrder(io) {
  const ports = io.get();
  const { id } = ports.pop();
  return Number(id.replace(/\D+/, '')) + 1;
}
