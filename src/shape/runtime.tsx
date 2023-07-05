import React from 'react';
import { ShapeProps } from './constants';
import css from './runtime.less';

interface RuntimeShapeProps {
  data: ShapeProps;
}

export default function ({ data }: RuntimeShapeProps) {
  const { type, clipPath } = data;

  const shapeStyles: React.CSSProperties = { };
  
  switch (type) {
    case 'rectangle':
      break;
    case 'circle':
      shapeStyles.borderRadius = '50%';
      break;
    case 'triangle':
      shapeStyles.clipPath = clipPath || "polygon(50% 0%, 0% 100%, 100% 100%)";
      break;
  }
  

  return (
    <div className={css.wrapper} data-item-type="wrapper">
      <div style={shapeStyles} className={css.shape} data-item-type="shape" />
    </div>
  );
}
