import type { RowType, ColType } from "./components";

export type DataColType = ColType & { slotStyle: React.CSSProperties };

export type DataRowType = RowType & { cols: Array<DataColType> };

export interface Data {
  resizable?: boolean;
  rows: Array<DataRowType>;
  style?: React.CSSProperties;
}
