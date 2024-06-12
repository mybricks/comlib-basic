import React, { CSSProperties } from "react";
import { Layout, Row, Col, WidthUnitEnum, ColType, RowType } from "./components";
import { Data } from "./types";
import Resizable from "../components/Resizable";
import { RuntimeContext } from "./context";
import styles from "./runtime.less";
export default (props: RuntimeParams<Data>) => {
  const { data, slots, inputs, outputs, logger, onError } = props;
  inputs.setWidth(
    (val: { coordinate: [number, number]; width: CSSProperties["width"] }, relsOutput) => {
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
        relsOutput['setWidthComplete']()
      } catch (error) {
        logger.error(errorMsg);
        onError?.(errorMsg);
      }
    }
  );

  const onColClick = ({ key }: ColType) => {
    !!key && outputs[key]();
  };
  
  const onRowClick = ({ key }: RowType) => {
    !!key && outputs[key]();
  };

  return (
    <RuntimeContext.Provider value={{ ...props }}>
      <Layout className={"mybricks-layout"}>
        {data.rows.map((row) => (
          <Row row={row} key={row.key} onClick={onRowClick} className={"mybricks-row"}>
            {row.cols.map((col, index) => {
              const isLastCol = index === row.cols.length - 1;
              const colProps = {
                col: {
                  ...col,
                  widthMode: data.resizable && isLastCol ? WidthUnitEnum.Auto : col.widthMode,
                },
                key: col.key,
                className: "mybricks-col",
                "data-layout-col-key": `${row.key}@${col.key}`,
                onClick: onColClick,
              };
              const colDom = (
                <Col {...colProps}>
                  {slots[col.key]?.render({
                    key: col.key,
                    style: col.slotStyle,
                  })}
                </Col>
              );
              if (data.resizable) {
                return (
                  <Resizable
                    axis="x"
                    className={styles.resizer}
                    key={col.key}
                    onResize={({ width }) => {
                      data.rows.forEach((row) => {
                        row.cols[index] = {
                          ...col,
                          width,
                          widthMode: WidthUnitEnum.Px,
                        };
                      });
                    }}
                  >
                    {colDom}
                  </Resizable>
                );
              } else {
                return colDom;
              }
            })}
          </Row>
        ))}
      </Layout>
    </RuntimeContext.Provider>
  );
};
