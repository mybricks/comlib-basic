import type { Data } from "../types";
import {
  getCol,
  setSlotLayout,
  appendCol,
  removeEffect,
  createStyleForCol,
  getFilterSelector,
} from "./utils";
export default {
  "[data-col-key]": {
    title: "列",
    items({ focusArea }: EditorResult<Data>, ...cate) {
      if (!focusArea) return;
      cate[0].title = "配置";
      cate[0].items = [
        {
          title: "布局",
          type: "layout",
          options: [],
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
        return `.mybricks-layout div[data-col-key="${key}"]${getFilterSelector(
          id
        )}`;
      },
    }),
  },
};
