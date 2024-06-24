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
  onClick?: (row: RowType) => void;
}

export type RowType = {
  key: string;
  heightMode: HeightUnitEnum;
  height: CSSProperties["height"] | string;
  isDragging?: boolean;
  style?: CSSProperties;
};

const Row = ({ row, className, children, onClick, ...rest }: RowProps) => {
  const rowStyle = useMemo(() => {
    const style = { ...(row.style ?? {}) };
    if (row.heightMode === HeightUnitEnum.Auto) {
      if(row.height === '100%'){
        style.height = row.height
      }else{
        style.height = row.heightMode;
      }
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

  const handleClick = (e, row: RowType) => {
    typeof onClick === "function" && onClick(row);
  };

  return (
    <div
      style={rowStyle}
      className={classnames}
      onClick={(e) => handleClick(e, row)}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Row;
