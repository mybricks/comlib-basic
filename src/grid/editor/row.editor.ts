import { Data } from "../types";
import {
  getRow,
  appendRow,
  deleteRow,
  canToggleToStandard,
  reviseStandardColWidth,
} from "../utils";
import { HeightUnitEnum, WidthUnitEnum } from "../components";
import { message } from "antd";
export default {
  "[data-layout-row-key]": {
    title: "行",
    items(props: EditorResult<Data>, ...cate) {
      if (!props.focusArea) return;
      const { data } = props;
      const { row } = getRow(props);
      cate[0].title = "常规";
      cate[0].items = [
        {
          title: "列间距",
          type: "text",
          options: {
            type: "Number",
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return row.style?.columnGap ?? 0;
            },
            set({ data }: EditorResult<Data>, val: string) {
              if (row.useCustom) {
                row.style = { ...row.style, columnGap: parseFloat(val) };
              } else {
                data.rows
                  .filter((row) => !row.useCustom)
                  .forEach((row) => {
                    row.style = { ...row.style, columnGap: parseFloat(val) };
                  });
              }
            },
          },
        },
        {
          title: "自定义",
          type: "switch",
          value: {
            get({ data }: EditorResult<Data>) {
              return !!row.useCustom;
            },
            set(props: EditorResult<Data>, val: boolean) {
              if (val) {
                row.useCustom = val;
              } else {
                if (canToggleToStandard(row, props)) {
                  reviseStandardColWidth(row, props);
                  row.useCustom = val;
                } else {
                  message.warn("当前行不能转换成标准行");
                }
              }
            },
          },
        },
        {
          title: "操作",
          items: [
            {
              title: "前面添加行",
              type: "Button",
              value: {
                set(props: EditorResult<Data>, val: string) {
                  appendRow(props, "BEFORE");
                },
              },
            },
            {
              title: "后面添加行",
              type: "Button",
              value: {
                set(props: EditorResult<Data>, val: string) {
                  appendRow(props, "AFTER");
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
              title: "列等分",
              type: "Button",
              value: {
                set({ data }: EditorResult<Data>, val: string) {
                  if (row.useCustom) {
                    row.cols.forEach((col) => {
                      col.widthMode = WidthUnitEnum.Auto;
                    });
                  } else {
                    data.rows
                      .filter((row) => !row.useCustom)
                      .forEach((row) => {
                        row.cols.forEach((col) => {
                          col.widthMode = WidthUnitEnum.Auto;
                        });
                      });
                  }
                },
              },
            },
            {
              title: "删除",
              type: "Button",
              value: {
                set(props: EditorResult<Data>) {
                  deleteRow(props);
                },
              },
            },
          ],
        },
      ];
    },
    style: [
      {
        title: "高度填充",
        type: "Select",
        options: [
          { value: HeightUnitEnum.Auto, label: "自动填充" },
          { value: HeightUnitEnum.Px, label: "固定高度" },
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
