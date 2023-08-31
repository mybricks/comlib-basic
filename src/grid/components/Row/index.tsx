import React, { CSSProperties, ReactNode, useMemo } from "react";
import styles from "./index.less";

export enum HeightUnitEnum {
  Px = "px",
  Auto = "auto",
  Percent = "%",
}

export interface RowProps {
  row: RowType;
  className?: string;
  children?: ReactNode;
}

export type RowType = {
  key: string;
  heightMode: HeightUnitEnum;
  height: CSSProperties["height"] | string;
  isDragging?: boolean;
  style?: CSSProperties;
};

const Row = ({ row, className, children, ...rest }: RowProps) => {
  const rowStyle = useMemo(() => {
    const style = { ...(row.style ?? {}) };
    if (row.heightMode === HeightUnitEnum.Auto) {
      style.height = row.heightMode;
    }
    if (row.heightMode === HeightUnitEnum.Px) {
      style.height = `${parseFloat(row.height as string)}px`;
    }
    if (row.heightMode === HeightUnitEnum.Percent) {
      style.height = `${parseFloat(row.height as string)}%`;
    }
    return style;
  }, [JSON.stringify(row.style), row.heightMode, row.height]);

  const classnames = useMemo(() => {
    const classnames = [styles.row];
    if (className) {
      classnames.push(className);
    }
    return classnames.join(" ");
  }, [className]);

  return (
    <div style={rowStyle} className={classnames} {...rest}>
      {children}
    </div>
  );
};

export default Row;
