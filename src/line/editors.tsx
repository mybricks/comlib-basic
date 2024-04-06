import { LineProps } from "./constants";

export default {
  "@init"({ style }) {
    style.width = "100%";
    style.height = 2;
  },
  "@resize": {
    options: ["width", "height"],
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
        title: "方向",
        type: "Select",
        options: [
          { value: "horizontal", label: "水平" },
          { value: "vertical", label: "垂直" },
        ],
        value: {
          get({ data }: EditorResult<LineProps>) {
            return data.direction;
          },
          set(
            { data }: EditorResult<LineProps>,
            value: LineProps["direction"]
          ) {
            data.direction = value;
          },
        },
      },
      {
        title: "线宽",
        type: "inputNumber",
        options: [{ min: 0, max: 180, width: 120 }],
        value: {
          get({ data }: EditorResult<LineProps>) {
            return [data.linewidth];
          },
          set({ data, style }: EditorResult<LineProps>, value: number[]) {
            style.height = value[0];
            data.linewidth = value[0];
          },
        },
      },
      {
        title: "线长",
        type: "inputNumber",
        options: [{ min: 0, max: 180, width: 100 }],
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
            console.log(value);
            data.color = value;
          },
        },
      },
      {
        title: "角度",
        type: "inputNumber",
        options: [{ min: 0, max: 180, width: 60 }],
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
