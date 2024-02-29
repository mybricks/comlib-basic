import { Data } from "../types";
import {
  addRow,
  createStyleForGrid,
  createStyleForCol,
  getFilterSelector,
} from "./utils";
import rowEdit from "./rowEdit";
import colEdit from "./colEdit";
export default {
  ':slot': {},
  ":root": {
    items({ data }: EditorResult<Data>, ...cate) {
      cate[0].title = "配置";
      cate[0].items = [
        {
          title: "添加行（2列）",
          type: "Button",
          value: {
            set(props: EditorResult<Data>) {
              addRow(props, 2);
            },
          },
        },
        {
          title: "添加行（3列）",
          type: "Button",
          value: {
            set(props: EditorResult<Data>) {
              addRow(props, 3);
            },
          },
        },
      ];
      cate[1].title = "高级";
      cate[1].items = [
        {
          title: "宽度可调整",
          type: "switch",
          value: {
            get({ data }: EditorResult<Data>) {
              return !!data.resizable;
            },
            set({ data }: EditorResult<Data>, val: boolean) {
              data.resizable = val;
            },
          },
        },
      ];
    },
    style: [
      createStyleForGrid({
        target: ({ id }: EditorResult<Data>) =>
          `.mybricks-layout${getFilterSelector(id)}`,
      }),
      createStyleForCol({
        target: ({ id }: EditorResult<Data>) =>
          `.mybricks-layout .mybricks-col${getFilterSelector(id)}`,
      }),
    ],
  },
  ...rowEdit,
  ...colEdit,
};
