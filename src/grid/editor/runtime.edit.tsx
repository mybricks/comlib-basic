import React, { useEffect, useMemo, useRef } from "react";
import { Data, DataColType, DataRowType } from "../types";
import Resizable from "../../components/Resizable";
import { Layout, Row, Col, HeightUnitEnum, WidthUnitEnum } from "../components";

import editStyles from "./edit.less";

const EditLayout = (props: RuntimeParams<Data>) => {
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
      zoom={env.canvas?.zoom}
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

  useEffect(() => {
    const eventHandle = (e) => {
      if (e.detail.axis === 'y') return;
      const [rowKey, colKey] = e.detail.targetData['data-layout-col-key'].split(',');
      const targetRow = data.rows.find(row => row.key === rowKey)
      const targetIndex = targetRow?.cols.findIndex(col => col.key === colKey) ?? 0
      data.rows.forEach(row => {
        row.cols.forEach(col => { col.isHover = false })
      })
      if (e.type === 'hover') {
        if (targetRow?.useCustom) {
          if (row.cols[targetIndex]) {
            row.cols[targetIndex].isHover = true;
          }
        } else {
          data.rows.filter(row => !row.useCustom).forEach(row => {
            if (row.cols[targetIndex]) {
              row.cols[targetIndex].isHover = true
            }
          })
        }
      }
    }
    document.addEventListener('hover', eventHandle);
    document.addEventListener('leave', eventHandle)
    return () => {
      document.removeEventListener('hover', eventHandle)
      document.removeEventListener('leave', eventHandle)
    }
  }, [row.useCustom])

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

  const hoverClassName = useMemo(() => {
    return col.isHover ? editStyles.hover : undefined
  }, [col.isHover])

  return (
    <Resizable
      axis="x"
      key={col.key}
      onResizeStart={() => {
        editFinishRef.current = env.edit.focusPaasive();
        if (row.useCustom) {
          col.isDragging = true;
        } else {
          data.rows.filter(row => !row.useCustom).forEach((row) => {
            row.cols[index].isDragging = true;
          });
        }

      }}
      onResize={(size) => {
        if (row.useCustom) {
          col.width = size.width;
          col.widthMode = WidthUnitEnum.Px;
        } else {
          data.rows.filter(row => !row.useCustom).forEach((row) => {
            row.cols[index].width = size.width;
            row.cols[index].widthMode = WidthUnitEnum.Px;
          });
        }
      }}
      onResizeStop={() => {
        editFinishRef.current && editFinishRef.current();
        if (row.useCustom) {
          col.isDragging = false;
        } else {
          data.rows.filter(row => !row.useCustom).forEach((row) => {
            row.cols[index].isDragging = false;
          });
        }

      }}
      zoom={env.canvas?.zoom}
      className={hoverClassName}
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

export default EditLayout;
