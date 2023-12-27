import React, { useEffect, useMemo, useRef } from "react";
import { Data, DataColType, DataRowType } from "../types";
import Resizable from "../../components/Resizable";
import { Layout, Row, Col, HeightUnitEnum, WidthUnitEnum } from "../components";
import { RuntimeContext } from "../context";

import editStyles from "./edit.less";

const toggleSlotTitle = (
  slots: RuntimeParams<Data>["slots"],
  title: string
) => {
  for (const key in slots) {
    if (Object.prototype.hasOwnProperty.call(slots, key)) {
      slots[key].title = title;
    }
  }
};

const EditLayout = (props: RuntimeParams<Data>) => {
  const { data } = props;
  return (
    <RuntimeContext.Provider value={{ ...props }}>
      <Layout className={`mybricks-layout ${editStyles.dashed}`}>
        {data.rows.map((row, index) => (
          <ResizableRow
            key={row.key}
            row={row}
            resizable={index !== data.rows.length - 1}
            {...props}
          >
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
    </RuntimeContext.Provider>
  );
};

const ResizableRow = ({
  data,
  row,
  children,
  env,
  resizable = true,
  slots,
  undo
}: {
  row: DataRowType;
  children?: React.ReactNode;
  resizable?: boolean;
} & RuntimeParams<Data>) => {
  const editFinishRef = useRef<Function>();
  const task = useRef<UndoTask>()
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

  const rowDom = (
    <Row
      row={row}
      className={"mybricks-row"}
      data-layout-row-key={row.key}
      data-row-custom={row.useCustom}
    >
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
  );
  return resizable ? (
    <Resizable
      axis="y"
      key={row.key}
      onResizeStart={() => {
        task.current = undo?.start('开始行拖拽')
        row.isDragging = true;
        editFinishRef.current = env.edit.focusPaasive();
        toggleSlotTitle(slots, "");
      }}
      onResize={(size) => {
        row.height = size.height;
        row.heightMode = HeightUnitEnum.Px;
      }}
      onResizeStop={() => {
        row.isDragging = false;
        editFinishRef.current && editFinishRef.current();
        toggleSlotTitle(slots, "拖拽组件到这里");
        task.current?.commit()
      }}
      zoom={env.canvas?.zoom}
    >
      {rowDom}
    </Resizable>
  ) : (
    rowDom
  );
};

const ResizableCol = ({
  row,
  col,
  data,
  index,
  slots,
  env,
  undo,
}: {
  row: DataRowType;
  col: DataColType;
  index: number;
} & RuntimeParams<Data>) => {
  const colRef = useRef<HTMLDivElement>(null);
  const editFinishRef = useRef<Function>();
  const task = useRef<UndoTask>()

  useEffect(() => {
    const eventHandle = (e) => {
      if (e.detail.axis === "y") return;
      data.rows.forEach((row) => {
        row.cols.forEach((col) => {
          col.isHover = false;
        });
      });
      if (e.type === "hover") {
        if (row?.useCustom) {
          if (row.cols[index]) {
            row.cols[index].isHover = true;
          }
        } else {
          data.rows
            .filter((row) => !row.useCustom)
            .forEach((row) => {
              if (row.cols[index]) {
                row.cols[index].isHover = true;
              }
            });
        }
      }
    };
    colRef.current?.addEventListener("hover", eventHandle);
    colRef.current?.addEventListener("leave", eventHandle);
    return () => {
      colRef.current?.removeEventListener("hover", eventHandle);
      colRef.current?.removeEventListener("leave", eventHandle);
    };
  }, [JSON.stringify(row), index, colRef]);

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
    return col.isHover ? editStyles.hover : undefined;
  }, [col.isHover]);

  const colDom = (
    <Col
      ref={colRef}
      col={col}
      className={classnames}
      data-layout-col-key={`${row.key},${col.key}`}
    >
      {slots[col.key]?.render({ key: col.key, style: col.slotStyle })}
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
  );

  return (
    <Resizable
      axis="x"
      key={col.key}
      onResizeStart={() => {
        task.current = undo?.start('开始列拖拽')
        editFinishRef.current = env.edit.focusPaasive();
        if (row.useCustom) {
          col.isDragging = true;
        } else {
          data.rows
            .filter((row) => !row.useCustom)
            .forEach((row) => {
              row.cols[index].isDragging = true;
            });
        }
        toggleSlotTitle(slots, "");
      }}
      onResize={(size) => {
        if (row.useCustom) {
          col.width = size.width;
          col.widthMode = WidthUnitEnum.Px;
        } else {
          data.rows
            .filter((row) => !row.useCustom)
            .forEach((row) => {
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
          data.rows
            .filter((row) => !row.useCustom)
            .forEach((row) => {
              row.cols[index].isDragging = false;
            });
        }
        toggleSlotTitle(slots, "拖拽组件到这里");
        task.current?.commit()
      }}
      zoom={env.canvas?.zoom}
      className={hoverClassName}
    >
      {colDom}
    </Resizable>
  )
};

export default EditLayout;
