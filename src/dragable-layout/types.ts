export type Col = {
  key: string;
  width: React.CSSProperties["width"];
  isDragging?: boolean;
  style?: React.CSSProperties;
  slotStyle?: React.CSSProperties;
};

export type Row = {
  key: string;
  height: React.CSSProperties["height"];
  isDragging?: boolean;
  style?: React.CSSProperties;
  cols: Array<Col>;
};
export interface Data {
  rows: Array<Row>;
  style?: React.CSSProperties;
}
