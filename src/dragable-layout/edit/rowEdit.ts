import type { Data, Row } from "../types";
import { getRow, appendRow, addCol, removeRow } from "./utils";
export default {
  "[data-row-key]": {
    title: "行",
    items({ data, focusArea }: EditorResult<Data>, ...cate) {
      if (!focusArea) return;
      cate[0].title = "配置";
      cate[0].items = [
        {
          title: "行操作",
          items: [
            {
              title: "前面添加行",
              type: "Button",
              value: {
                set(props: EditorResult<Data>, val: string) {
                  appendRow(props, 2, "BEFORE");
                },
              },
            },
            {
              title: "后面添加行",
              type: "Button",
              value: {
                set(props: EditorResult<Data>, val: string) {
                  appendRow(props, 2, "AFTER");
                },
              },
            },
            {
              title: "上移",
              type: "Button",
              ifVisible(props: EditorResult<Data>) {
                const { index } = getRow(props);
                return index !== undefined && index > 0;
              },
              value: {
                set(props: EditorResult<Data>) {
                  const { index } = getRow(props);
                  if (index < 1) return;
                  [data.rows[index - 1], data.rows[index]] = [
                    data.rows[index],
                    data.rows[index - 1],
                  ];
                },
              },
            },
            {
              title: "下移",
              type: "Button",
              ifVisible(props: EditorResult<Data>) {
                const { index } = getRow(props);
                return index !== undefined && index < data.rows.length - 1;
              },
              value: {
                set(props: EditorResult<Data>) {
                  const { index } = getRow(props);
                  if (index === data.rows.length - 1) return;
                  [data.rows[index], data.rows[index + 1]] = [
                    data.rows[index + 1],
                    data.rows[index],
                  ];
                },
              },
            },
            {
              title: "删除",
              type: "Button",
              value: {
                set(props: EditorResult<Data>) {
                  removeRow(props);
                },
              },
            },
          ],
        },
        {
          title: "列操作",
          items: [
            {
              title: "添加列",
              type: "Button",
              value: {
                set(props: EditorResult<Data>) {
                  addCol(props);
                },
              },
            },
            {
              title: "列等分",
              type: "Button",
              value: {
                set(props: EditorResult<Data>) {
                  const { row } = getRow(props);
                  row?.cols.forEach((col) => {
                    col.width = "auto";
                  });
                },
              },
            },
          ],
        },
      ];
    },
  },
};
