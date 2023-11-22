import React, {
  ReactNode,
  CSSProperties,
  useMemo,
  forwardRef,
  LegacyRef,
} from "react";
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
  onClick?: (col: ColType) => void;
}

const Col = (
  { col, className, children, onClick, ...rest }: ColProps,
  ref: LegacyRef<HTMLDivElement>
) => {
  const colStyle = useMemo(() => {
    const style: CSSProperties = {};
    if (col.widthMode === WidthUnitEnum.Auto) {
      style.flex = 1;
      style.minWidth = 30;
    }
    if (col.widthMode === WidthUnitEnum.Px) {
      style.width = col.width;
    }
    if (col.widthMode === WidthUnitEnum.Percent) {
      style.flex = `0 0 ${col.width}%`;
      style.maxWidth = `${col.width}%`;
    }
    return { ...style, ...(col.style ?? {}) };
  }, [JSON.stringify(col.style), col.width, col.widthMode]);

  const classnames = useMemo(() => {
    const classnames = [styles.col];
    if (className) {
      classnames.push(className);
    }
    return classnames.join(" ");
  }, [className]);

  const handleClick = (e, col: ColType) => {
    typeof onClick === "function" && onClick(col);
  };

  return (
    <div
      ref={ref}
      style={colStyle}
      className={classnames}
      onClick={(e) => handleClick(e, col)}
      {...rest}
    >
      {children}
    </div>
  );
};

export default forwardRef(Col);
