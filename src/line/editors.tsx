import { LineProps } from "./constants";
import Style from "./runtime.less";

export default {
  "@init"({ style }) {
    style.width = 400;
    style.height = 8;
  },
  "@resize": {
    options: ["width", "height"],
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
      {
        title: "虚线",
        ifVisible({ data }: EditorResult<LineProps>) {
          return data.type === "dashed";
        },
        items: [
          {
            title: "空白段长度",
            type: "inputNumber",
            description: "单位 px",
            options: [{ min: 0, width: 100, formatter: "px" }],
            value: {
              get({ data }: EditorResult<LineProps>) {
                return [data.dashedBlankLength];
              },
              set({ data }: EditorResult<LineProps>, value: number[]) {
                data.dashedBlankLength = value[0];
              },
            },
          },
          {
            title: "有色段长度",
            type: "inputNumber",
            description: "单位 px",
            options: [{ min: 0, width: 100, formatter: "px" }],
            value: {
              get({ data }: EditorResult<LineProps>) {
                return [data.dashedColorLength];
              },
              set({ data }: EditorResult<LineProps>, value: number[]) {
                data.dashedColorLength = value[0];
              },
            },
          },
        ],
      },
    ],
  },
};
