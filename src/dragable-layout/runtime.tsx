import React, { useMemo, CSSProperties } from "react";
import { Data, Row, Col, WidthUnitEnum, HeightUnitEnum } from "./types";
import { SpanToken } from './constant'
import runtimeStyles from "./runtime.less";
export default (props: RuntimeParams<Data>) => {
  const { data, style, inputs, onError, logger } = props;
  inputs.setWidth((val: { coordinate: [number, number], width: CSSProperties['width'] }) => {
    const { coordinate, width } = val;
    const errorMsg = '找不到布局列，检查参数设置'
    try {
      const col = data.rows[coordinate[0] - 1].cols[coordinate[1] - 1];
      if (!col) throw Error(errorMsg);
      if (width === 'auto') {
        col.widthMode = WidthUnitEnum.Auto;
      } else {
        col.widthMode = WidthUnitEnum.Px;
      }
      col.width = width;
    } catch (error) {
      logger.error(errorMsg);
      onError?.(errorMsg);
    }
  });
  return (
    <div className={`${runtimeStyles.layout} mybricks-layout`} style={style}>
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

const Row = ({ row, children }: { row: Row; children?: React.ReactNode }) => {
  const style = useMemo(() => {
    const style = { ...(row.style ?? {}) };
    if (row.heightMode === HeightUnitEnum.Px) {
      style.height = typeof row.height === 'number' ? row.height + "px" : row.height;
    }
    if (row.heightMode === HeightUnitEnum.Percent) {
      style.height = typeof row.height === 'number' ? row.height + "%" : row.height;
    }
    return style
  }, [JSON.stringify(row.style), row.heightMode, row.height])

  return (
    <div
      className={`${runtimeStyles.row} mybricks-row`}
      style={style}
      data-row-key={row.key}
    >
      {children}
    </div>
  );
};

const Col = ({
  row,
  col,
  slots,
}: { row: Row; col: Col } & RuntimeParams<Data>) => {
  const { key, slotStyle } = col;
  const style = useMemo(() => {
    const style = { ...(col.style ?? {}) };
    if (col.widthMode === WidthUnitEnum.Auto) {
      style.flex = 1;
    }
    if (col.widthMode === WidthUnitEnum.Px) {
      style.width = typeof col.width === 'number' ? col.width + 'px' : col.width;
    }
    if (col.widthMode === WidthUnitEnum.Span) {
      const percent = SpanToken[col.span ?? 12]
      style.flex = `0 0 ${percent}`
      style.maxWidth = percent
    }
    /**
     * 栅格化实现
     */
    if (row.style && 'columnGap' in row.style && row.style.columnGap as number > 0) {
      style.paddingLeft = `${row.style.columnGap as number / 2}px`;
      style.paddingRight = `${row.style.columnGap as number / 2}px`;
    }
    return style
  }, [JSON.stringify(col.style), col.width, col.widthMode, col.span, JSON.stringify(row.style)])
  return (
    <div
      className={`${runtimeStyles.col} mybricks-col`}
      style={style}
      data-col-key={`${row.key},${key}`}
    >
      {slots[key].render({ style: slotStyle })}
    </div>
  );
};
