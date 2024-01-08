import { Data, OutputIds, Schemas } from "./constants";
import { getInputOrder, getOutputSchema } from "./utils";

export default {
  "@inputUpdated"({ data, input, output }: EditorResult<Data>, updatePin) {
    if (updatePin.id !== OutputIds.Output) {
      output.get(OutputIds.Output).setSchema(getOutputSchema(data, input));
    }
  },
  "@inputConnected"({ data, output, input }: EditorResult<Data>) {
    output.get(OutputIds.Output).setSchema(getOutputSchema(data, input));
  },
  "@pinRemoved"({ data, output, input }: EditorResult<Data>, ...arg) {
    output.get(OutputIds.Output).setSchema(getOutputSchema(data, input));
  },
  "@inputDisConnected"({ data, output, input }: EditorResult<Data>) {
    output.get(OutputIds.Output).setSchema(getOutputSchema(data, input));
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
          input.add({
            id: hostId,
            title,
            schema: Schemas.Follow,
            deletable: true,
          });
        },
      },
    },
  ],
};
