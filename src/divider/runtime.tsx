import React from "react";
import { Divider, DividerProps } from "antd";

export default function ({ data }: RuntimeParams<DividerProps>) {
  const { type, dashed, style, orientation, children, orientationMargin } = data;

  return (
    <Divider
      type={type}
      style={style}
      // plain={true}
      dashed={dashed}
      orientation={orientation}
      orientationMargin={orientationMargin}
      children={type === 'horizontal' && children}
    />
  );
}
