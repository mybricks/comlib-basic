import React, { useCallback, useMemo } from "react";
import { Data, Row, Col, WidthUnitEnum } from "../types";
import { dragable } from "../../utils";
import { SpanToken } from '../constant'
import editStyle from "./edit.less";
import runtimeStyle from "../runtime.less";
export default (props: RuntimeParams<Data>) => {
  const { data, style } = props;
  return (
    <div className={`${runtimeStyle.layout} mybricks-layout`} style={style}>
      {data.rows.map((row) => (
        <Row key={row.key} row={row} {...props}>
          {row.cols.map((col) => (
            <Col key={col.key} row={row} col={col} {...props} />
          ))}
        </Row>
      ))}
    </div>
  );
};

const Row = ({
  row,
  children,
  ...props
}: { row: Row; children: React.ReactNode } & RuntimeParams<Data>) => {
  const { env, data } = props;
  const dragHeight = useCallback((e) => {
    let currentHeight, editFinish;
    dragable(e, ({ dpo }, state) => {
      if (state === "start") {
        const rowEle = e.target.parentNode;
        currentHeight = rowEle.offsetHeight;
        editFinish = env.edit.focusPaasive();
        row.isDragging = true;
      }
      if (state === "ing") {
        row.height = currentHeight += dpo.dy;
      }
      if (state === "finish") {
        if (editFinish) {
          editFinish();
        }
        row.isDragging = false;
      }
    });
    e.stopPropagation();
  }, []);

  const style = { ...(row.style ?? {}) };
  if (row.height === "auto") {
    style.flex = 1;
  } else if (typeof row.height === "number") {
    style.height = row.height;
  }

  const hasDragTarget = data.rows.some((_row) => _row.isDragging);

  const isDragTarget = row.isDragging;

  return (
    <div
      className={`${runtimeStyle.row} mybricks-row`}
      style={style}
      data-row-key={row.key}
    >
      {children}
      <div className={editStyle.resizeH} onMouseDown={(e) => dragHeight(e)} />
      {hasDragTarget && (
        <div
          className={
            isDragTarget
              ? editStyle.draggingTipH
              : `${editStyle.draggingTipH} ${editStyle.dashed}`
          }
        >
          {row.height}
        </div>
      )}
    </div>
  );
};

const Col = ({
  row,
  col,
  slots,
  env,
}: { row: Row; col: Col } & RuntimeParams<Data>) => {
  const { key, slotStyle } = col;
  const dragWidth = useCallback((e) => {
    let currentWidth, editFinish;
    dragable(e, ({ dpo }, state) => {
      if (state === "start") {
        const colEle = e.target.parentNode;
        currentWidth = colEle.offsetWidth;
        editFinish = env.edit.focusPaasive();
        col.isDragging = true;
      }
      if (state === "ing") {
        col.width = currentWidth += dpo.dx;
        col.widthMode = WidthUnitEnum.Px;
      }
      if (state === "finish") {
        if (editFinish) {
          editFinish();
        }
        col.isDragging = false;
      }
    });
    e.stopPropagation();
  }, []);

  const columnGap = useMemo(() => {
    if (row.style?.columnGap) return +row.style?.columnGap
    return 0
  }, [row.style?.columnGap])

  const style = useMemo(() => {
    const style = { ...(col.style ?? {}) };
    if (col.widthMode === WidthUnitEnum.Auto) {
      style.flex = 1;
    }
    if (col.widthMode === WidthUnitEnum.Px) {
      style.width = col.width + 'px';
    }
    if (col.widthMode === WidthUnitEnum.Span) {
      const percent = SpanToken[col.span ?? 12]
      style.flex = `0 0 ${percent}`
      style.maxWidth = percent
    }
    style.padding = `0 ${columnGap / 2}px`
    return style
  }, [JSON.stringify(col.style), col.width, col.widthMode, col.span, columnGap])

  const hasDragTarget = row.cols.some((_col) => _col.isDragging);

  const isDragTarget = col.isDragging;

  return (
    <div
      className={`${runtimeStyle.col} mybricks-col`}
      style={style}
      data-col-key={`${row.key},${key}`}
    >
      {slots[key]?.render({ style: slotStyle })}
      <div className={editStyle.resizeW} style={{ right: columnGap / 2 - 3 }} onMouseDown={(e) => dragWidth(e)} />
      {hasDragTarget && (
        <div
          className={
            isDragTarget
              ? editStyle.draggingTipW
              : `${editStyle.draggingTipW} ${editStyle.dashed}`
          }
        >
          {col.width}
        </div>
      )}
    </div>
  );
};
