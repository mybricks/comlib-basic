import { LineProps } from "./constants";
import Style from "./runtime.less";

export default {
  "@init"({ style }) {
    style.width = 400;
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
        options: ["border"],
        target: `.${Style.warrper}`,
      },
    ],
    items: [
      {
        title: "类型",
        type: "Select",
        options: [
          { value: "solid", label: "实线" },
          { value: "dotted", label: "点线" },
          { value: "dashed", label: "虚线" },
        ],
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
      {
        title: "颜色",
        type: "COLORPICKER",
        value: {
          get({ data }: EditorResult<LineProps>) {
            return data.color;
          },
          set({ data }: EditorResult<LineProps>, value: string) {
            data.color = value;
          },
        },
      },
      {
        title: "角度",
        type: "inputNumber",
        options: [{ min: -360, max: 360, width: 100 }],
        value: {
          get({ data }: EditorResult<LineProps>) {
            return [data.angle];
          },
          set({ data }: EditorResult<LineProps>, value: number[]) {
            data.angle = value[0];
          },
        },
      },
    ],
  },
};
