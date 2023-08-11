import { Data, Row, HeightUnitEnum } from "../types";
import {
  getRow,
  appendRow,
  addCol,
  removeRow,
  createStyleForRow,
  getFilterSelector,
} from "./utils";
export default {
  "[data-layout-row-key]": {
    title: "行",
    items({ data, focusArea }: EditorResult<Data>, ...cate) {
      if (!focusArea) return;
      cate[0].title = "配置";
      cate[0].items = [
        {
          title: "布局",
          type: "layout",
          options: {},
          value: {
            get(props: EditorResult<Data>) {
              const { row } = getRow(props);
              return { flexDirection: "row", ...row.style };
            },
            set(props: EditorResult<Data>, val: React.CSSProperties) {
              const { row } = getRow(props);
              row.style = {
                ...(row?.style ?? {}),
                ...val,
              };
            },
          },
        },
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
    style: [
      createStyleForRow({
        target({ id, focusArea }: EditorResult<Data>) {
          const { index } = focusArea;
          return `.mybricks-layout > .mybricks-row:nth-child(${
            index + 1
          })${getFilterSelector(id)}`;
        },
      }),
      {
        title: "高度填充",
        type: "Select",
        options: [
          { value: HeightUnitEnum.Auto, label: "自动填充" },
          { value: HeightUnitEnum.Px, label: "固定宽度" },
          { value: HeightUnitEnum.Percent, label: "百分比" },
        ],
        value: {
          get(props: EditorResult<Data>) {
            const { row } = getRow(props);
            return row.heightMode ?? HeightUnitEnum.Auto;
          },
          set(props: EditorResult<Data>, value: HeightUnitEnum) {
            const { row } = getRow(props);
            row.heightMode = value;
          },
        },
      },
      {
        title: "指定高度",
        type: "Text",
        options: {
          type: "Number",
        },
        ifVisible(props: EditorResult<Data>) {
          const { row } = getRow(props);
          return [HeightUnitEnum.Px, HeightUnitEnum.Percent].includes(
            row?.heightMode
          );
        },
        value: {
          get(props: EditorResult<Data>) {
            const { row } = getRow(props);
            return row.height;
          },
          set(props: EditorResult<Data>, val: string) {
            const { row } = getRow(props);
            row.height = parseFloat(val);
          },
        },
      },
    ],
  },
};
