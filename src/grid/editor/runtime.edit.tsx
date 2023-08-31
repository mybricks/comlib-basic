import React, { useMemo, useRef } from "react";
import { Data, DataColType, DataRowType } from "../types";
import Resizable from "../../components/Resizable";
import { Layout, Row, Col, HeightUnitEnum, WidthUnitEnum } from "../components";

import editStyles from "./edit.less";

const DIVLayout = (props: RuntimeParams<Data>) => {
  const { data } = props;
  return (
    <Layout className={"mybricks-layout"}>
      {data.rows.map((row) => (
        <ResizableRow key={row.key} row={row} {...props}>
          {row.cols.map((col, index) => (
            <ResizableCol
              key={col.key}
              col={col}
              row={row}
              index={index}
              {...props}
            />
          ))}
        </ResizableRow>
      ))}
    </Layout>
  );
};

const ResizableRow = ({
  data,
  row,
  children,
  env,
}: {
  row: DataRowType;
  children?: React.ReactNode;
} & RuntimeParams<Data>) => {
  const editFinishRef = useRef<Function>();
  const dragText = useMemo(() => {
    if (row.heightMode === HeightUnitEnum.Auto) {
      return row.heightMode;
    }
    if (row.heightMode === HeightUnitEnum.Px) {
      return `${row.height}px`;
    }
    if (row.heightMode === HeightUnitEnum.Percent) {
      return `${row.height}%`;
    }
  }, [row.height, row.heightMode]);

  const isDragging = data.rows.find((row) => !!row.isDragging);
  return (
    <Resizable
      axis="y"
      key={row.key}
      onResizeStart={() => {
        row.isDragging = true;
        editFinishRef.current = env.edit.focusPaasive();
      }}
      onResize={(size) => {
        row.height = size.height;
        row.heightMode = HeightUnitEnum.Px;
      }}
      onResizeStop={() => {
        row.isDragging = false;
        editFinishRef.current && editFinishRef.current();
      }}
    >
      <Row row={row} className={"mybricks-row"} data-layout-row-key={row.key}>
        {children}
        {isDragging && (
          <div
            className={
              row.isDragging
                ? editStyles.draggingTipH
                : `${editStyles.draggingTipH} ${editStyles.dashed}`
            }
          >
            {dragText}
          </div>
        )}
      </Row>
    </Resizable>
  );
};

const ResizableCol = ({
  row,
  col,
  data,
  index,
  slots,
  env,
}: {
  row: DataRowType;
  col: DataColType;
  index: number;
} & RuntimeParams<Data>) => {
  const editFinishRef = useRef<Function>();

  const dragText = useMemo(() => {
    if (col.widthMode === WidthUnitEnum.Auto) {
      return col.widthMode;
    }
    if (col.widthMode === WidthUnitEnum.Px) {
      return `${parseFloat(col.width as string)}px`;
    }
    if (col.widthMode === WidthUnitEnum.Percent) {
      return col.width;
    }
  }, [col.widthMode, col.width]);

  const isDragging = data.rows.find(({ cols }) =>
    cols.some((col) => !!col.isDragging)
  );

  const classnames = useMemo(() => {
    let classnames = "mybricks-col";
    if (col.isDragging || row.isDragging) {
      classnames = `${classnames} ${editStyles.dragging}`;
    }
    return classnames;
  }, [row.isDragging, col.isDragging]);

  return (
    <Resizable
      axis="x"
      key={col.key}
      onResizeStart={() => {
        editFinishRef.current = env.edit.focusPaasive();
        data.rows.forEach((row) => {
          row.cols[index].isDragging = true;
        });
      }}
      onResize={(size) => {
        data.rows.forEach((row) => {
          row.cols[index].width = size.width;
          row.cols[index].widthMode = WidthUnitEnum.Px;
        });
      }}
      onResizeStop={() => {
        editFinishRef.current && editFinishRef.current();
        data.rows.forEach((row) => {
          row.cols[index].isDragging = false;
        });
      }}
    >
      <Col
        col={col}
        className={classnames}
        data-layout-col-key={`${row.key},${col.key}`}
      >
        {slots[col.key]?.render({ style: col.slotStyle })}
        {isDragging && (
          <div
            className={
              col.isDragging
                ? editStyles.draggingTipW
                : `${editStyles.draggingTipW} ${editStyles.dashed}`
            }
          >
            {dragText}
          </div>
        )}
      </Col>
    </Resizable>
  );
};

const TableLayout = (props: RuntimeParams<Data>) => {
  const { data, slots } = props;
  return (
    <table className={editStyles.table}>
      <tbody>
        {data.rows.map((row) => (
          <tr style={{ height: row.height }} key={row.key}>
            {row.cols.map((col, index) => (
              <Resizable
                axis="both"
                key={col.key}
                onResize={(size) => {
                  data.rows.forEach((row) => {
                    row.height = size.height;
                    row.cols[index].width = size.width;
                  });
                }}
              >
                <td style={{ width: col.width, height: row.height }}>
                  {slots[col.key]?.render({ style: col.slotStyle })}
                </td>
              </Resizable>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DIVLayout;
