import { Data, WidthUnitEnum } from "../types";
import {
  getCol,
  setSlotLayout,
  appendCol,
  removeEffect,
  createStyleForCol,
  getFilterSelector,
} from "./utils";
export default {
  "[data-layout-col-key]": {
    title: "列",
    items(props: EditorResult<Data>, ...cate) {
      if (!props.focusArea) return;
      const { col } = getCol(props);
      cate[0].title = "配置";
      cate[0].items = [
        {
          title: "宽度填充",
          type: "Select",
          options: [
            { value: WidthUnitEnum.Span, label: "24栅格" },
            { value: WidthUnitEnum.Auto, label: "自动填充" },
            { value: WidthUnitEnum.Px, label: "固定宽度" },
          ],
          value: {
            get(props: EditorResult<Data>) {
              return col.widthMode ?? WidthUnitEnum.Auto;
            },
            set(props: EditorResult<Data>, value: WidthUnitEnum) {
              col.widthMode = value;
            },
          },
        },
        {
          title: '宽度(共24格)',
          type: 'Slider',
          options: [
            {
              max: 24,
              min: 1,
              steps: 1,
              formatter: '/24'
            }
          ],
          ifVisible(props: EditorResult<Data>) {
            return col?.widthMode === WidthUnitEnum.Span;
          },
          value: {
            get({ data, focusArea }: EditorResult<Data>) {
              return col?.span;
            },
            set({ data, slot, focusArea }: EditorResult<Data>, value: number) {
              col.span = value
            }
          }
        },
        {
          title: '指定宽度(px)',
          type: 'Text',
          options: {
            type: 'Number'
          },
          ifVisible({ data, focusArea }: EditorResult<Data>) {
            return col?.widthMode === WidthUnitEnum.Px;
          },
          value: {
            get({ data, focusArea }: EditorResult<Data>) {
              return col?.width;
            },
            set({ data, slot, focusArea }: EditorResult<Data>, value: string) {
              col.width = parseFloat(value);
            }
          }
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
                  [row.cols[index - 1], row.cols[index]] = [
                    row.cols[index],
                    row.cols[index - 1],
                  ];
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
                  [row.cols[index], row.cols[index + 1]] = [
                    row.cols[index + 1],
                    row.cols[index],
                  ];
                },
              },
            },
            {
              title: "删除",
              type: "Button",
              value: {
                set(props: EditorResult<Data>) {
                  const { row, col, index } = getCol(props);
                  removeEffect({ col, ...props });
                  row.cols.splice(index, 1);
                },
              },
            },
          ],
        },
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
        const { id, focusArea } = props;
        const { row, col } = getCol(props);
        const key = `${row.key},${col.key}`;
        return `.mybricks-layout div[data-layout-col-key="${key}"]${getFilterSelector(
          id
        )}`;
      },
    }),
  },
};
