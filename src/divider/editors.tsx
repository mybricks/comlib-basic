import { DividerProps } from "antd";

export default {
  "@init"({ style }) {
    style.width = "100%";
    style.height = "fit-content";
  },
  "@resize": {
    options: ["width"],
  },
  ":root": {
    style: [
      {
        title: "标题",
        type: "style",
        ifVisible({ data }: EditorResult<DividerProps>) {
          return data.type === "horizontal";
        },
        options: [{ type: "font", config: { disableTextAlign: true } }],
        target: ".ant-divider-inner-text",
      },
      {
        title: "标题",
        type: "style",
        ifVisible({ data }: EditorResult<DividerProps>) {
          return data.type === "horizontal";
        },
        options: ["margin"],
        target: ".ant-divider-horizontal",
      },
      {
        title: "标题",
        type: "style",
        ifVisible({ data }: EditorResult<DividerProps>) {
          return data.type === "vertical";
        },
        options: ["margin"],
        target: ".ant-divider-vertical",
      },
      // {
      //   title: "线",
      //   type: "style",
      //   options: [{ type: "border" }],
      //   target: ".ant-divider-horizontal.ant-divider-with-text",
      // },
    ],
    items: [
      {
        title: "是否虚线",
        type: "Switch",
        value: {
          get({ data }: EditorResult<DividerProps>) {
            return data?.dashed;
          },
          set(
            { data }: EditorResult<DividerProps>,
            value: DividerProps["dashed"]
          ) {
            data.dashed = value;
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
          get({ data }: EditorResult<DividerProps>) {
            return data.type;
          },
          set(
            { data, style }: EditorResult<DividerProps>,
            value: DividerProps["type"]
          ) {
            if (data.type === 'vertical') {
              style.width = 'fit-content';
            } else {
              style.width = '100%';
            }
            data.type = value;
          },
        },
      },
      {
        title: "颜色",
        type: "colorPicker",
        value: {
          get({ data }: EditorResult<DividerProps>) {
            return data.style?.["border-top-color"];
          },
          set({ data }: EditorResult<DividerProps>, value: string) {
            const newStyle = { ...data.style };
            newStyle.borderTopColor = value;
            data.style = newStyle;
          },
        },
      },
      {
        title: "标题",
        ifVisible({ data }: EditorResult<DividerProps>) {
          return data.type === "horizontal";
        },
        items: [
          {
            title: "标题",
            type: "Text",
            value: {
              get({ data }: EditorResult<DividerProps>) {
                return data?.children;
              },
              set({ data }: EditorResult<DividerProps>, value: string) {
                data.children = value;
              },
            },
          },
          {
            title: "标题位置",
            type: "Select",
            options: [
              { value: "left", label: "左" },
              { value: "center", label: "中" },
              { value: "right", label: "右" },
            ],
            value: {
              get({ data }: EditorResult<DividerProps>) {
                return data?.orientation;
              },
              set(
                { data }: EditorResult<DividerProps>,
                value: DividerProps["orientation"]
              ) {
                data.orientation = value;
              },
            },
          },
          {
            title: "与最近的左右边缘间距",
            type: "inputNumber",
            description: "标题和最近 left/right 边框之间的距离，单位 px",
            ifVisible({ data }: EditorResult<DividerProps>) {
              return data.orientation !== "center";
            },
            options: [{ min: -Infinity, max: Infinity, width: 120 }],
            value: {
              get({ data }: EditorResult<DividerProps>) {
                return [data?.orientationMargin || 0];
              },
              set({ data }: EditorResult<DividerProps>, value: number[]) {
                data.orientationMargin = value[0];
              },
            },
          },
        ],
      },
    ],
  },
};
