export type Col = {
  key: string;
  isDragging?: boolean;
  widthMode?: WidthUnitEnum;
  width: React.CSSProperties["width"];
  span?: number;
  style?: React.CSSProperties;
  slotStyle?: React.CSSProperties;
};

export type Row = {
  key: string;
  heightMode: HeightUnitEnum;
  height: React.CSSProperties["height"];
  isDragging?: boolean;
  style?: React.CSSProperties;
  cols: Array<Col>;
};

export enum WidthUnitEnum {
  Px = "px",
  Auto = "auto",
  Media = "@media",
  Span = "%",
}

export enum HeightUnitEnum {
  Px = "px",
  Auto = "auto",
  Percent = "%"
}
export interface Data {
  rows: Array<Row>;
  style?: React.CSSProperties;
}
