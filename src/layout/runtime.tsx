import React, { useCallback, useMemo } from 'react';

import { CellWidthTypeEnum } from './const';

export default function ({ data, style, slots }) {
  const layoutStyle = useCallback(() => {
    const { cellWidthType } = data;
    let gridTemplateColumns = '';
    let gridTemplateRows = '';
  
    data.rows.forEach((row) => {
      const { height } = row;
      if (height) {
        gridTemplateRows = gridTemplateRows + (gridTemplateRows ? ` ${height}px` : `${height}px`);
      }
    });

    const useWidth = cellWidthType === CellWidthTypeEnum.Px;
  
    data.cols.forEach((col) => {
      const { width, widthPercent, cellWidthType } = col;
      const relWidth = (cellWidthType === 'auto') ? '1fr' : (useWidth ? (width && `${width}px`) : widthPercent);

      if (relWidth) {
        gridTemplateColumns = gridTemplateColumns + (gridTemplateColumns ? ` ${relWidth}` : `${relWidth}`);
      } else {
        gridTemplateColumns += ' 1fr';
      }
    });

    return {
      display: 'grid',
      gridTemplateRows,
      gridTemplateColumns,
      width: style.width === 'fit-content' ? data.width : '100%',
      height: data.height === 'auto' ? data.pxHeight : '100%',
      overflow: 'hidden',
      position: 'absolute',
      top: 0,
      left: 0,
      ...data.style
    };
  }, []);

  const jsx = useMemo(() => {
    const map = {};
    return data.rows.map((row, rowIndex) => {
      
      if (!map[rowIndex]) {
        map[rowIndex] = [];
      }
      const { cols } = row;
      const jsx = cols.map((col, colIndex) => {
        const { id, colSpan, rowSpan } = col;
        const step = map[rowIndex][colIndex] || 0;
        const obj = {
          rowIndex: rowIndex + 1,
          colIndex: colIndex + 1 + step,
          rowSpan: rowIndex + 1 + (rowSpan || 0),
          colSpan: colIndex + 1 + (colSpan || 0) + step
        };

        map[rowIndex].push(colSpan || 1);

        if (rowSpan) {
          for (let i = rowIndex + 1; i < rowSpan; i++) {
            if (!map[i]) {
              map[i] = [];
            }
            map[i][colIndex] = colSpan || 1;
          }
        }
        
        return (
          <div key={id} style={{gridArea: `${obj.rowIndex} / ${obj.colIndex} / ${obj.rowSpan} / ${obj.colSpan}`, overflow: 'hidden'}}>
            {slots[id].render({style: col.style})}
          </div>
        );
      });

      return jsx;
    });
  }, []);

  return (
    <div style={layoutStyle()}>
      {jsx}
    </div>
  );
}
