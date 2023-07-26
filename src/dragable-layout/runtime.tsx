import React from "react";
import { Data, Row, Col } from "./types";
import runtimeStyles from "./runtime.less";
export default (props: RuntimeParams<Data>) => {
  const { data, style } = props;
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
  const style = { ...(row.style ?? {}) };
  if (row.height === "auto") {
    style.flex = 1;
  } else if (typeof row.height === "number") {
    style.height = row.height;
  }
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
  const style = { ...(col.style ?? {}) };
  if (col.width === "auto") {
    style.flex = 1;
  } else if (typeof col.width === "number") {
    style.width = col.width;
  }
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
