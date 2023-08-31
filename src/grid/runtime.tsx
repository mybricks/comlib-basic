import React, { CSSProperties } from "react";
import { Layout, Row, Col, WidthUnitEnum } from "./components";
import { Data, DataColType, DataRowType } from "./types";
import Resizable, { ResizableProps } from "../components/Resizable";
import styles from "./runtime.less";
export default ({
  data,
  slots,
  inputs,
  logger,
  onError,
}: RuntimeParams<Data>) => {
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

  return (
    <Layout className={"mybricks-layout"}>
      {data.rows.map((row) => (
        <Row row={row} key={row.key} className={"mybricks-row"}>
          {row.cols.map((col, index) => {
            if (data.resizable) {
              const isLastCol = index === row.cols.length - 1;
              if (!isLastCol) {
                return (
                  <ResizableCol
                    key={col.key}
                    row={row}
                    col={col}
                    onResize={({ width }) => {
                      row.cols[index] = {
                        ...col,
                        width,
                        widthMode: WidthUnitEnum.Px,
                      };
                    }}
                  >
                    {slots[col.key]?.render({ style: col.slotStyle })}
                  </ResizableCol>
                );
              } else {
                return (
                  <Col
                    col={{ ...col, widthMode: WidthUnitEnum.Auto }}
                    key={col.key}
                    className={"mybricks-col"}
                  >
                    {slots[col.key]?.render({ style: col.slotStyle })}
                  </Col>
                );
              }
            } else {
              return (
                <Col col={col} key={col.key} className={"mybricks-col"}>
                  {slots[col.key]?.render({ style: col.slotStyle })}
                </Col>
              );
            }
          })}
        </Row>
      ))}
    </Layout>
  );
};

const ResizableCol = ({
  row,
  col,
  children,
  onResize,
}: {
  row: DataRowType;
  col: DataColType;
  children?: React.ReactNode;
  onResize: ResizableProps["onResize"];
}) => {
  return (
    <Resizable axis="x" onResize={onResize} className={styles.resizer}>
      <Col
        col={col}
        className={"mybricks-col"}
        data-layout-col-key={`${row.key},${col.key}`}
      >
        {children}
      </Col>
    </Resizable>
  );
};
