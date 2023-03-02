import { Data, OutputIds, Schemas } from './constants';

// 获取输出schema
function getOutputSchema(input) {
  const res = {};
  const inputList = input.get();
  (inputList || []).forEach((item) => {
    const schema = input.get(item?.id)?.schema;
    Object.assign(res, schema?.properties);
  });
  return {
    type: 'object',
    properties: res
  };
}

// 获取输入项序号
function getInputOrder({ input }) {
  const ports = input.get();
  const { id } = ports?.pop?.() || {};
  return (Number(id.slice(5)) || 0) + 1;
}

export default {
  '@inputUpdated'({ input, output }, updatePin) {
    if (updatePin.id !== OutputIds.Output) {
      output.get(OutputIds.Output).setSchema(getOutputSchema(input));
    }
  },
  '@inputConnected'({ output, input }) {
    output.get(OutputIds.Output).setSchema(getOutputSchema(input));
  },
  '@inputDisConnected'({ output, input }) {
    output.get(OutputIds.Output).setSchema(getOutputSchema(input));
  },
  ':root': [
    {
      title: '添加输入项',
      type: 'Button',
      value: {
        set({ input }) {
          const i0 = input.get('input0.p0');
          console.log(i0)

          const title = `输入项2`;
          const hostId = `input0.p2`;
          input.add(hostId, title, Schemas.Follow, true);
        }
      }
    }
  ]
};
