import { ArrowProps } from "./constants";
import Style from "./runtime.less";

export default {
  "@init"({ style }) {
    style.width = 200;
    style.height = 40;
  },
  "@resize": {
    options: ["width", "height"],
  },
  ":root": {
    style: [
      {
        type: "style",
        options: ["background"],
        target: `.${Style.arrowWarrper}`,
      },
      {
        type: "style",
        options: ["border"],
        target: `.${Style.arrowWarrper}`,
      },
    ],
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
        title: "箭头长",
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
        title: "箭体长",
        type: "inputNumber",
        description: "三角形高 单位 px",
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
};
