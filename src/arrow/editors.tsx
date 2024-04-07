import { unitConversion } from "src/utils";
import { ArrowProps } from "./constants";

export default {
  "@init"({ style }) {
    style.width = "100%";
    style.height = "fit-content";
  },
  "@resize": {
    options: [],
  },
  ":root": {
    items: [
      {
        title: "类型",
        type: "Select",
        options: [
          { value: "left", label: "左" },
          { value: "right", label: "右" },
          { value: "both", label: "双向" },
        ],
        value: {
          get({ data }: EditorResult<ArrowProps>) {
            return data.type;
          },
          set({ data }: EditorResult<ArrowProps>, value: ArrowProps["type"]) {
            data.type = value;
          },
        },
      },
      {
        title: "宽度",
        type: "inputNumber",
        description: "单位 px",
        options: [{ width: 100 }],
        value: {
          get({ data }: EditorResult<ArrowProps>) {
            return [data.linewidth];
          },
          set({ data }: EditorResult<ArrowProps>, value: number[]) {
            data.linewidth = value[0];
          },
        },
      },
      {
        title: "颜色",
        type: "COLORPICKER",
        value: {
          get({ data }: EditorResult<ArrowProps>) {
            return data.color;
          },
          set({ data }: EditorResult<ArrowProps>, value: string) {
            data.color = value;
          },
        },
      },
      {
        title: "角度",
        type: "inputNumber",
        options: [{ min: -360, max: 360, width: 60 }],
        value: {
          get({ data }: EditorResult<ArrowProps>) {
            return [data.angle];
          },
          set({ data }: EditorResult<ArrowProps>, value: number[]) {
            data.angle = value[0];
          },
        },
      },
    ],
  },
};
