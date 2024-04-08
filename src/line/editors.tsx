import { LineProps } from "./constants";

export default {
  "@init"({ style }) {
    style.width = "100%";
    style.height = "fit-content";
  },
  "@resize": {
    options: ["width"],
  },
  ":root": {
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
        title: "线宽",
        type: "inputNumber",
        description: "单位 px",
        options: [{ width: 100 }],
        value: {
          get({ data }: EditorResult<LineProps>) {
            return [data.linewidth];
          },
          set({ data }: EditorResult<LineProps>, value: number[]) {
            data.linewidth = value[0];
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
        options: [{ min: 0, max: 180, width: 100 }],
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
