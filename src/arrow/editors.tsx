import { unitConversion } from "src/utils";
import { ArrowProps } from "./constants";

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
        title: "箭头方向",
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
      {
        title: "箭头",
        items: [
          {
            title: "箭头高长",
            type: "inputNumber",
            description: "三角形高 单位 px",
            options: [{ width: 100 }],
            value: {
              get({ data }: EditorResult<ArrowProps>) {
                return [data.arrowLength];
              },
              set({ data }: EditorResult<ArrowProps>, value: number[]) {
                data.arrowLength = value[0];
              },
            },
          },
          {
            title: "箭头底长",
            type: "inputNumber",
            description: "三角形底 单位 px",
            options: [{ width: 100 }],
            value: {
              get({ data }: EditorResult<ArrowProps>) {
                return [data.arrowWidth];
              },
              set({ data }: EditorResult<ArrowProps>, value: number[]) {
                data.arrowWidth = value[0];
              },
            },
          },
        ],
      },
      {
        title: "箭体",
        items: [
          {
            title: "箭体宽度",
            type: "inputNumber",
            description: "单位 px",
            options: [{ width: 100 }],
            value: {
              get({ data }: EditorResult<ArrowProps>) {
                return [data.arrowBodyWidth];
              },
              set({ data }: EditorResult<ArrowProps>, value: number[]) {
                data.arrowBodyWidth = value[0];
              },
            },
          },
        ],
      },
    ],
  },
};
