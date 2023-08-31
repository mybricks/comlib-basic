import React, { ReactNode, CSSProperties, useMemo } from "react";
import styles from "./index.less";

export enum WidthUnitEnum {
  Px = "px",
  Auto = "auto",
  Percent = "%",
}

export type ColType = {
  key: string;
  isDragging?: boolean;
  widthMode?: WidthUnitEnum;
  width: CSSProperties["width"] | string;
  style?: CSSProperties;
};

export interface ColProps {
  col: ColType;
  className?: string;
  children?: ReactNode;
}

const Col = ({ col, className, children, ...rest }: ColProps) => {
  const colStyle = useMemo(() => {
    const style = { ...(col.style ?? {}) };
    if (col.widthMode === WidthUnitEnum.Auto) {
      style.flex = 1;
      style.minWidth = 1;
    }
    if (col.widthMode === WidthUnitEnum.Px) {
      style.width = col.width;
    }
    if (col.widthMode === WidthUnitEnum.Percent) {
      style.flex = `0 0 ${col.width}%`;
      style.maxWidth = `${col.width}%`;
    }
    return style;
  }, [JSON.stringify(col.style), col.width, col.widthMode]);

  const classnames = useMemo(() => {
    const classnames = [styles.col];
    if (className) {
      classnames.push(className);
    }
    return classnames.join(" ");
  }, [className]);

  return (
    <div style={colStyle} className={classnames} {...rest}>
      {children}
    </div>
  );
};

export default Col;
