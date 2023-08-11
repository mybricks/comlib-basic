import React, { useCallback, useMemo } from "react";
import { Data, Row, Col, WidthUnitEnum, HeightUnitEnum } from "../types";
import { dragable } from "../../utils";
import { SpanToken } from "../constant";
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
        row.height = currentHeight += dpo.dy / (env?.canvas?.zoom ?? 1);
        row.heightMode = HeightUnitEnum.Px;
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

  const style = useMemo(() => {
    const style = { ...(row.style ?? {}) };
    if (row.heightMode === HeightUnitEnum.Px) {
      style.height = typeof row.height === 'number' ? row.height + "px" : row.height;
    }
    if (row.heightMode === HeightUnitEnum.Percent) {
      style.height = typeof row.height === 'number' ? row.height + "%" : row.height;
    }
    return style;
  }, [JSON.stringify(row.style), row.heightMode, row.height]);

  const hasDragTarget = data.rows.some((_row) => _row.isDragging);

  const isDragTarget = row.isDragging;

  return (
    <div
      className={`${runtimeStyle.row} mybricks-row`}
      style={style}
      data-layout-row-key={row.key}
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
  outputs,
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
        col.width = currentWidth += dpo.dx / (env?.canvas?.zoom ?? 1);
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

  const style = useMemo(() => {
    const style = { ...(col.style ?? {}) };
    if (col.widthMode === WidthUnitEnum.Auto) {
      style.flex = 1;
    }
    if (col.widthMode === WidthUnitEnum.Px) {
      style.width = typeof col.width === 'number' ? col.width + 'px' : col.width;
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

  const dragText = useMemo(() => {
    if (col.widthMode === WidthUnitEnum.Auto) {
      return col.widthMode;
    }
    if (col.widthMode === WidthUnitEnum.Px) {
      return col.width;
    }
    if (col.widthMode === WidthUnitEnum.Span) {
      return `${col.span}栅格`;
    }
  }, [col.widthMode, col.width, col.span]);

  const hasDragTarget = row.cols.some((_col) => _col.isDragging);

  const isDragTarget = col.isDragging;

  return (
    <div
      className={`${runtimeStyle.col} mybricks-col`}
      style={style}
      data-layout-col-key={`${row.key},${key}`}
    >
      {slots[key]?.render({ style: slotStyle })}
      <div
        className={editStyle.resizeW}
        onMouseDown={(e) => dragWidth(e)}
      />
      {hasDragTarget && (
        <div
          className={
            isDragTarget
              ? editStyle.draggingTipW
              : `${editStyle.draggingTipW} ${editStyle.dashed}`
          }
        >
          {dragText}
        </div>
      )}
    </div>
  );
};
