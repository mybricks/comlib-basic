import React, { useState, useEffect } from "react";
import { ShapeProps, INPUTS } from "./constants";
import css from "./runtime.less";

export default function ({ data, inputs }: RuntimeParams<ShapeProps>) {
  const { type, clipPath } = data;

  const shapeStyles: React.CSSProperties = {};
  const [dynamicStyle, setDynamicStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    inputs[INPUTS.SetStyle]((style: React.CSSProperties, relsOutput) => {
        setDynamicStyle(style)
        relsOutput['setStyleComplete']()
    });
  }, []);

  switch (type) {
    case "rectangle":
      break;
    case "circle":
      shapeStyles.borderRadius = "50%";
      break;
    case "triangle":
      shapeStyles.clipPath = clipPath || "polygon(50% 0%, 0% 100%, 100% 100%)";
      break;
  }

  return (
    <div className={css.wrapper} data-item-type="wrapper">
      <div style={{...shapeStyles, ...dynamicStyle}} className={css.shape} data-item-type="shape" />
    </div>
  );
}
