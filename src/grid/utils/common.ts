import { Data, DataColType, DataRowType } from "../types";
import { uuid } from "../../utils";
import { WidthUnitEnum, HeightUnitEnum } from "../components";

const defaultSlotStyle: React.CSSProperties = {
  display: "flex",
  position: "inherit",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  flexWrap: "nowrap",
  overflow: "inherit",
};

const defaultRow = {
  key: uuid(),
  height: HeightUnitEnum.Auto,
  heightMode: HeightUnitEnum.Auto,
  cols: Array.from({ length: 3 }, () => ({
    key: uuid(),
    width: 33.33,
    widthMode: WidthUnitEnum.Auto,
    slotStyle: defaultSlotStyle
  })),
};

export const createRow = (props: EditorResult<Data>): DataRowType => {
  const { data } = props;
  const rowKey = uuid();
  const row = data.rows[0] ?? defaultRow;
  const cols = row.cols.map((col) => {
    return copyCol(props, col);
  });
  return {
    ...row,
    key: rowKey,
    cols,
  };
};

export const createCol = (props: EditorResult<Data>): DataColType => {
  const colKey = uuid();
  addEffect({ key: colKey, ...props });
  return {
    key: colKey,
    width: 300,
    widthMode: WidthUnitEnum.Auto,
    slotStyle: defaultSlotStyle,
  };
};

export const copyCol = (
  props: EditorResult<Data>,
  col: DataColType
): DataColType => {
  const colKey = uuid();
  addEffect({ key: colKey, ...props });
  return {
    ...col,
    key: colKey,
  };
};

export const addEffect = ({
  key,
  slots,
  output,
}: EditorResult<Data> & { key: string }) => {
  slots.add({
    id: key,
    title: "拖拽组件到这里",
  });
  output.add(key, "列点击", { type: "any" });
};

export const removeEffect = ({
  col,
  slot,
  output,
}: EditorResult<Data> & { col: DataColType }) => {
  slot.remove(col.key);
  output.remove(col.key);
};

export const addRow = (props: EditorResult<Data>) => {
  const row = createRow(props);
  props.data.rows.push(row);
};

export const addCol = (props: EditorResult<Data>) => {
  const { data } = props;
  data.rows.forEach((row) => {
    const col = createCol(props);
    row.cols.push(col);
  });
};

export const getRow = ({
  data,
  focusArea,
}: EditorResult<Data>): { row: DataRowType; index: number } => {
  const { layoutRowKey } = focusArea.dataset;
  const row = data.rows.find((row) => row.key === layoutRowKey) as DataRowType;
  const index = data.rows.findIndex(
    (row) => row.key === layoutRowKey
  ) as number;
  return { row, index };
};

export const getCol = ({
  data,
  focusArea,
}: EditorResult<Data>): {
  row: DataRowType;
  col: DataColType;
  index: number;
} => {
  const { layoutColKey: key } = focusArea.dataset;
  const [rowKey, colKey] = key.split(",");
  const row = data.rows.find((row) => row.key === rowKey) as DataRowType;
  const col = row?.cols.find((col) => col.key === colKey) as DataColType;
  const index = row?.cols.findIndex((col) => col.key === colKey) as number;
  return { row, col, index };
};

export const appendRow = (
  props: EditorResult<Data>,
  position: "BEFORE" | "AFTER" = "AFTER"
) => {
  const { data } = props;
  const { index } = getRow(props);
  const row = createRow(props);
  if (position === "BEFORE") {
    data.rows.splice(index, 0, row);
  } else if (position === "AFTER") {
    data.rows.splice(index + 1, 0, row);
  }
};

export const appendCol = (
  props: EditorResult<Data>,
  position: "BEFORE" | "AFTER" = "AFTER"
) => {
  const { data } = props;
  const { index } = getCol(props);
  data.rows.forEach((row) => {
    const col = createCol(props);
    if (position === "BEFORE") {
      row.cols.splice(index, 0, col);
    } else if (position === "AFTER") {
      row.cols.splice(index + 1, 0, col);
    }
  });
};

export const setSlotLayout = ({
  slotStyle,
  ...props
}: EditorResult<Data> & {
  slotStyle: React.CSSProperties;
}) => {
  const { col } = getCol(props);
  const slotInstance = props.slot.get(col?.key);
  if (slotStyle.position === "absolute") {
    slotInstance.setLayout(slotStyle.position);
  } else if (slotStyle.display === "flex") {
    if (slotStyle.flexDirection === "row") {
      slotInstance.setLayout("flex-row");
    } else if (slotStyle.flexDirection === "column") {
      slotInstance.setLayout("flex-column");
    }
  }
};

export const deleteRow = (props: EditorResult<Data>) => {
  const { data } = props;
  const { row, index } = getRow(props);
  row?.cols.forEach((col) => removeEffect({ col, ...props }));
  data.rows.splice(index, 1);
};

export const deleteCol = (props: EditorResult<Data>) => {
  const { index } = getCol(props);
  props.data.rows.forEach((row) => {
    const col = row.cols[index];
    removeEffect({ col, ...props });
    row.cols.splice(index, 1);
  });
};
