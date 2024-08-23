import { LineProps } from "./constants";
import Style from "./runtime.less";

export default {
  "@init"({ style }) {
    style.width = 200;
    style.height = 1;
  },
  "@resize": {
    options: ["width"],
  },
  ":root": {
    style: [
      {
        title: "线",
        type: "style",
        options: [
          {
            type: "border",
            config: {
              disableBorderStyle: true,
              disableBorderRadius: true,
              disableBorderWidth: true,
              useImportant: true,
              disableBorderRight: true,
              disableBorderBottom: true,
              disableBorderLeft: true,
            },
          },
        ],
        target: `.${Style.line}`,
      },
    ],
    items: [
      {
        title: "类型",
        type: "Line",
        value: {
          get({ data }: EditorResult<LineProps>) {
            return data.type;
          },
          set({ data }: EditorResult<LineProps>, value: LineProps["type"]) {
            data.type = value;
          },
        },
      },
      {
        title: "线宽",
        type: "inputNumber",
        options: [{ min: 1, width: 100 }],
        value: {
          get({ data }: EditorResult<LineProps>) {
            return [data.lineWidth];
          },
          set({ data, style }: EditorResult<LineProps>, value: number[]) {
            data.lineWidth = value[0];
            style.height = value[0];
          },
        },
      },
    ],
  },
};