import { WidthUnitEnum } from "../components";
import { Data } from "../types";
import {
  getCol,
  createStyleForCol,
  getFilterSelector,
  setSlotLayout,
  appendCol,
  deleteCol,
  updateColWidthMode,
  isLastCol
} from "../utils";
export default {
  "[data-layout-col-key]": {
    title: "列",
    items(props: EditorResult<Data>, ...cate) {
      if (!props.focusArea) return;
      const { col } = getCol(props);
      cate[0].title = "常规";
      cate[0].items = [
        {
          title: "宽度填充",
          type: "Select",
          options: [
            { value: WidthUnitEnum.Auto, label: "自动填充" },
            { value: WidthUnitEnum.Percent, label: "百分比" },
            { value: WidthUnitEnum.Px, label: "固定宽度" },
          ],
          ifVisible(props: EditorResult<Data>) {
            return !isLastCol(props);
          },
          value: {
            get(props: EditorResult<Data>) {
              return col.widthMode ?? WidthUnitEnum.Auto;
            },
            set(props: EditorResult<Data>, value: WidthUnitEnum) {
              updateColWidthMode(props, { widthMode: value });
            },
          },
        },
        {
          title: "指定宽度(px)",
          type: "Text",
          options: {
            type: "Number",
          },
          ifVisible(props: EditorResult<Data>) {
            return col?.widthMode === WidthUnitEnum.Px && !isLastCol(props);
          },
          value: {
            get({ data, focusArea }: EditorResult<Data>) {
              return col?.width;
            },
            set(props: EditorResult<Data>, value: string) {
              updateColWidthMode(props, { width: parseFloat(value) });
            },
          },
        },
        {
          title: "百分比宽度(%)",
          type: "Text",
          options: {
            type: "Number",
            min: 0,
            max: 100,
          },
          ifVisible(props: EditorResult<Data>) {
            return col?.widthMode === WidthUnitEnum.Percent && !isLastCol(props);
          },
          value: {
            get({ data, focusArea }: EditorResult<Data>) {
              return col?.width;
            },
            set(props: EditorResult<Data>, value: string) {
              updateColWidthMode(props, { width: parseFloat(value) });
            },
          },
        },
        {
          title: "内容布局",
          type: "layout",
          value: {
            get(props: EditorResult<Data>) {
              const { col } = getCol(props);
              const { slotStyle = {} } = col;
              setSlotLayout({ slotStyle, ...props });
              return slotStyle;
            },
            set(props: EditorResult<Data>, val: React.CSSProperties) {
              const { col } = getCol(props);
              col.slotStyle = {
                ...(col?.slotStyle ?? {}),
                ...val,
              };
              setSlotLayout({ slotStyle: val, ...props });
            },
          },
        },
        {
          title: "操作",
          items: [
            {
              title: "前面添加列",
              type: "Button",
              value: {
                set(props: EditorResult<Data>) {
                  appendCol(props, "BEFORE");
                },
              },
            },
            {
              title: "后面添加列",
              type: "Button",
              value: {
                set(props: EditorResult<Data>) {
                  appendCol(props, "AFTER");
                },
              },
            },
            {
              title: "前移",
              type: "Button",
              ifVisible(props: EditorResult<Data>) {
                const { index } = getCol(props);
                return index !== undefined && index > 0;
              },
              value: {
                set(props: EditorResult<Data>) {
                  const { row, index } = getCol(props);
                  if (index < 1) return;
                  if (row.useCustom) {
                    [row.cols[index - 1], row.cols[index]] = [
                      row.cols[index],
                      row.cols[index - 1],
                    ];
                  } else {
                    const { data } = props;
                    data.rows.filter(row => !row.useCustom).forEach((row) => {
                      [row.cols[index - 1], row.cols[index]] = [
                        row.cols[index],
                        row.cols[index - 1],
                      ];
                    });
                  }
                },
              },
            },
            {
              title: "后移",
              type: "Button",
              ifVisible(props: EditorResult<Data>) {
                const { row, index } = getCol(props);
                return index !== undefined && index < row.cols.length - 1;
              },
              value: {
                set(props: EditorResult<Data>) {
                  const { row, index } = getCol(props);
                  if (index === row.cols.length - 1) return;
                  if (row.useCustom) {
                    [row.cols[index], row.cols[index + 1]] = [
                      row.cols[index + 1],
                      row.cols[index],
                    ];
                  } else {
                    const { data } = props;
                    data.rows.filter(row => !row.useCustom).forEach((row) => {
                      [row.cols[index], row.cols[index + 1]] = [
                        row.cols[index + 1],
                        row.cols[index],
                      ];
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
                  deleteCol(props);
                },
              },
            },
          ],
        },
      ];
      cate[1].title = "交互";
      cate[1].items = [
        {
          title: "点击",
          type: "_Event",
          options(props: EditorResult<Data>) {
            const { col } = getCol(props);
            return {
              outputId: col?.key,
            };
          },
        },
      ];
    },
    style: createStyleForCol({
      target(props: EditorResult<Data>) {
        const { row, col } = getCol(props);
        const key = `${row.key},${col.key}`;
        return `> .mybricks-layout > .mybricks-row > div[data-layout-col-key="${key}"]`;
      },
    }),
  },
};
