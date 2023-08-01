import { Data, Row, Col, WidthUnitEnum, HeightUnitEnum } from "../../types";
import { uuid } from "../../../utils";
import { getCol, getRow } from "./common";

export const createRow = ({
  colCount,
  ...props
}: { colCount: number } & EditorResult<Data>): Row => {
  const key = uuid();
  const cols = Array.from({ length: colCount }, () => {
    return createCol(props);
  });
  return {
    key,
    height: "auto",
    heightMode: HeightUnitEnum.Px,
    style: {
      flexDirection: "row",
      display: "flex",
      flexWrap: "wrap",
      position: "relative",
    },
    cols,
  };
};

export const createCol = (props: EditorResult<Data>): Col => {
  const key = uuid();
  addEffect({ key, ...props });
  return {
    key,
    width: 300,
    widthMode: WidthUnitEnum.Auto,
    span: 12,
    slotStyle: {
      display: "flex",
      position: "inherit",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      flexWrap: "nowrap",
    },
  };
};

export const addRow = (props: EditorResult<Data>, colCount: number = 2) => {
  const { data } = props;
  const row = createRow({ colCount, ...props });
  data.rows.push(row);
};

export const addCol = (props: EditorResult<Data>) => {
  const col = createCol(props);
  const { row } = getRow(props);
  row?.cols.push(col);
};

export const appendRow = (
  props: EditorResult<Data>,
  colCount: number = 2,
  position: "BEFORE" | "AFTER" = "AFTER"
) => {
  const { data } = props;
  const { index } = getRow(props);
  const row = createRow({ colCount, ...props });
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
  const { row, index } = getCol(props);
  const col = createCol(props);
  if (position === "BEFORE") {
    row.cols.splice(index, 0, col);
  } else if (position === "AFTER") {
    row.cols.splice(index + 1, 0, col);
  }
};

export const removeRow = (props: EditorResult<Data>) => {
  const { data } = props;
  const { row, index } = getRow(props);
  row?.cols.forEach((col) => removeEffect({ col, ...props }));
  data.rows.splice(index, 1);
};

export const addEffect = ({
  key,
  slots,
  output,
}: EditorResult<Data> & { key: string }) => {
  slots.add({
    id: key,
    title: "列（竖向排列）",
  });
  output.add(key, "列点击", { type: "any" });
};

export const removeEffect = ({
  col,
  slot,
  output,
}: EditorResult<Data> & { col: Col }) => {
  slot.remove(col.key);
  output.remove(col.key);
};
