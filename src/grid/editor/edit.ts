import { Data } from "../types";
import {
  addRow,
  addCol,
  createStyleForGrid,
  createStyleForCol,
  getFilterSelector,
} from "../utils";
import RowEditor from "./row.editor";
import ColEditor from "./col.editor";
export default {
  ":root": {
    items({ data }: EditorResult<Data>, ...cate) {
      cate[0].title = "常规";
      cate[0].items = [
        {
          title: "添加行",
          type: "Button",
          value: {
            set(props: EditorResult<Data>) {
              addRow(props);
            },
          },
        },
        {
          title: "添加列",
          type: "Button",
          value: {
            set(props: EditorResult<Data>) {
              addCol(props);
            },
          },
        },
      ];
      cate[1].title = "交互";
      cate[1].items = [
        {
          title: "运行时调整列宽",
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
  ...RowEditor,
  ...ColEditor,
};
