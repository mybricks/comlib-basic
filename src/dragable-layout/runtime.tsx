import React, { useMemo, useCallback, CSSProperties } from "react";
import { Data, Row, Col, WidthUnitEnum, HeightUnitEnum } from "./types";
import { SpanToken } from "./constant";
import { dragable } from "../utils";
import runtimeStyles from "./runtime.less";
export default (props: RuntimeParams<Data>) => {
  const { data, style, inputs, onError, logger } = props;
  inputs.setWidth(
    (val: { coordinate: [number, number]; width: CSSProperties["width"] }) => {
      const { coordinate, width } = val;
      const errorMsg = "找不到布局列，检查参数设置";
      try {
        const col = data.rows[coordinate[0] - 1].cols[coordinate[1] - 1];
        if (!col) throw Error(errorMsg);
        if (width === "auto") {
          col.widthMode = WidthUnitEnum.Auto;
        } else {
          col.widthMode = WidthUnitEnum.Px;
        }
        col.width = width;
      } catch (error) {
        logger.error(errorMsg);
        onError?.(errorMsg);
      }
    }
  );

  const onResize = (row: Row, col: Col) => {
    const index = row.cols.findIndex(({ key }) => key === col.key)
    row.cols[index] = { ...col }
  }

  return (
    <div className={`${runtimeStyles.layout} mybricks-layout`} style={style}>
      {data.rows.map((row) => (
        <Row key={row.key} row={row} {...props}>
          {row.cols.map((col) => (
            <Col key={col.key} row={row} onResize={onResize} col={col} {...props} />
          ))}
        </Row>
      ))}
    </div>
  );
};

const Row = ({ row, children }: { row: Row; children?: React.ReactNode }) => {
  const style = useMemo(() => {
    const style = { ...(row.style ?? {}) };
    if (row.heightMode === HeightUnitEnum.Px) {
      style.height =
        typeof row.height === "number" ? row.height + "px" : row.height;
    }
    if (row.heightMode === HeightUnitEnum.Percent) {
      style.height =
        typeof row.height === "number" ? row.height + "%" : row.height;
    }
    return style;
  }, [JSON.stringify(row.style), row.heightMode, row.height]);

  return (
    <div
      className={`${runtimeStyles.row} mybricks-row`}
      style={style}
      data-layout-row-key={row.key}
    >
      {children}
    </div>
  );
};

const Col = ({
  row,
  col,
  slots,
  data,
  outputs,
  onResize
}: { row: Row; col: Col; onResize?: (row: Row, col: Col) => void } & RuntimeParams<Data>) => {
  const { key, slotStyle } = col;

  const dragWidth = useCallback((e) => {
    let currentWidth;
    dragable(e, ({ dpo }, state) => {
      if (state === "start") {
        const colEle = e.target.parentNode;
        currentWidth = colEle.offsetWidth;
        col.isDragging = true;
      }
      if (state === "ing") {
        col.width = currentWidth += dpo.dx;
        col.widthMode = WidthUnitEnum.Px;
        typeof onResize === 'function' && onResize(row, { ...col })
      }
      if (state === "finish") {
        col.isDragging = false;
      }
    });
    e.stopPropagation();
  }, []);

  const style = useMemo(() => {
    const style = { ...(col.style ?? {}) };
    if (col.widthMode === WidthUnitEnum.Auto) {
      style.flex = 1;
    }
    if (col.widthMode === WidthUnitEnum.Px) {
      style.width =
        typeof col.width === "number" ? col.width + "px" : col.width;
    }
    if (col.widthMode === WidthUnitEnum.Span) {
      const percent = SpanToken[col.span ?? 12];
      style.flex = `0 0 ${percent}`;
      style.maxWidth = percent;
    }
    /**
     * 栅格化实现
     */
    // if (
    //   row.style &&
    //   "columnGap" in row.style &&
    //   (row.style.columnGap as number) > 0
    // ) {
    //   style.paddingLeft = `${(row.style.columnGap as number) / 2}px`;
    //   style.paddingRight = `${(row.style.columnGap as number) / 2}px`;
    // }
    return style;
  }, [
    JSON.stringify(col.style),
    col.width,
    col.widthMode,
    col.span,
    JSON.stringify(row.style),
  ]);

  const [resizer, resizableClass] = useMemo(() => {
    if (data.resizable) {
      const jsx = (
        <div
          className={runtimeStyles.resizer}
          onMouseDown={(e) => dragWidth(e)}
        />
      );
      const className = runtimeStyles.resizable;
      return [jsx, className];
    }
    return [];
  }, [data.resizable]);

  const handlerClick = (e) => {
    !!key && outputs[key]();
    e.stopPropagation();
  }

  return (
    <div
      className={`${runtimeStyles.col} mybricks-col ${resizableClass}`}
      style={style}
      data-layout-col-key={`${row.key},${key}`}
      onClick={handlerClick}
    >
      {slots[key].render({ style: slotStyle })}
      {resizer}
    </div>
  );
};
