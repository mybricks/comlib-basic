import React, { CSSProperties } from "react";
import { Layout, Row, Col, WidthUnitEnum, ColType } from "./components";
import { Data } from "./types";
import Resizable from "../components/Resizable";
import styles from "./runtime.less";
export default ({
  data,
  slots,
  inputs,
  outputs,
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

  const onColClick = ({ key }: ColType) => {
    !!key && outputs[key]();
  };

  return (
    <Layout className={"mybricks-layout"}>
      {data.rows.map((row) => (
        <Row row={row} key={row.key} className={"mybricks-row"}>
          {row.cols.map((col, index) => {
            const colProps = {
              col,
              basis: 100 / row.cols.length,
              key: col.key,
              className: "mybricks-col",
              'data-layout-col-key': `${row.key},${col.key}`,
              onClick: onColClick,
            };
            if (data.resizable) {
              const isLastCol = index === row.cols.length - 1;
              if (!isLastCol) {
                return (
                  <Resizable
                    axis="x"
                    className={styles.resizer}
                    key={col.key}
                    onResize={({ width }) => {
                      data.rows.forEach(row => {
                        row.cols[index] = {
                          ...col,
                          width,
                          widthMode: WidthUnitEnum.Px,
                        };
                      })
                    }}
                  >
                    <Col {...colProps}>
                      {slots[col.key]?.render({ key: col.key, style: col.slotStyle })}
                    </Col>
                  </Resizable>
                );
              } else {
                colProps.col = { ...col, widthMode: WidthUnitEnum.Auto }; //last col auto
                return (
                  <Col {...colProps}>
                    {slots[col.key]?.render({ key: col.key, style: col.slotStyle })}
                  </Col>
                );
              }
            } else {
              return (
                <Col {...colProps}>
                  {slots[col.key]?.render({ key: col.key, style: col.slotStyle })}
                </Col>
              );
            }
          })}
        </Row>
      ))}
    </Layout>
  );
};
