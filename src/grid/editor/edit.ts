import { Data } from "../types";
import {
  addRow,
  addCol,
  createStyleForGrid,
  createStyleForCol,
  getFilterSelector,
  getMinRect
} from "../utils";
import RowEditor from "./row.editor";
import ColEditor from "./col.editor";
export default {
  '@resize': {
    options: ['width', 'height'],
    value: {
      set({ data, style, focusArea, id }, { width, height }) {
        const { width: minWidth, height: minHeight } = getMinRect(id)
        if (height) {
          style.height = Math.max(minHeight, height)
        }
        // if (width) {
        //   style.width = Math.max(minWidth, width)
        // }
      }
    }
  },
  '@init': ({ style, data }) => {
    style.width = '100%';
    style.height = 'auto';
  },
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
        target: ({ id }: EditorResult<Data>) => `> .mybricks-layout`,
      }),
      createStyleForCol({
        target: ({ id }: EditorResult<Data>) =>
          `> .mybricks-layout > .mybricks-row > .mybricks-col`,
      }),
    ],
  },
  ...RowEditor,
  ...ColEditor,
};
