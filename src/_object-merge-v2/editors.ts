import { Data, OutputIds, Schemas } from "./constants";
import { getInputOrder } from "../utils/basic";

// 获取输出schema
function getOutputSchema(input) {
  const res = {};
  const inputList = input.get();
  (inputList || []).forEach((item: { id: any }) => {
    const schema = input.get(item?.id)?.schema;
    Object.assign(res, schema?.properties);
  });
  return {
    type: "object",
    properties: res,
  };
}

export default {
  "@inputUpdated"({ input, output }: EditorResult<Data>, updatePin) {
    if (updatePin.id !== OutputIds.Output) {
      output.get(OutputIds.Output).setSchema(getOutputSchema(input));
    }
  },
  "@inputConnected"({ output, input }: EditorResult<Data>) {
    output.get(OutputIds.Output).setSchema(getOutputSchema(input));
  },
  "@inputDisConnected"({ output, input }: EditorResult<Data>) {
    output.get(OutputIds.Output).setSchema(getOutputSchema(input));
  },
  ":root": [
    {
      title: "添加输入项",
      type: "Button",
      value: {
        set({ input }: EditorResult<Data>) {
          const idx = getInputOrder({ input });
          const title = `输入项${idx}`;
          const hostId = `input.inputValue${idx}`;
          input.add(hostId, title, Schemas.Follow, true);
        },
      },
    },
  ],
};
