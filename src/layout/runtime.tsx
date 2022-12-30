import React, { useCallback, useMemo } from 'react';

export default function ({ data, slots }) {

  const layoutStyle = useCallback(() => {
    let gridTemplateColumns = '';
    let gridTemplateRows = '';
  
    data.rows.forEach((row) => {
      const { height } = row;
      if (height) {
        gridTemplateRows = gridTemplateRows + (gridTemplateRows ? ` ${height}px` : `${height}px`);
      }
    });
  
    data.cols.forEach((col) => {
      const { width } = col;
      if (width) {
        gridTemplateColumns = gridTemplateColumns + (gridTemplateColumns ? ` ${width}px` : `${width}px`);
      }
    });

    return {
      display: 'grid',
      gridTemplateRows,
      gridTemplateColumns,
      width: '100%',
      height: '100%'
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
          <div key={id} style={{gridArea: `${obj.rowIndex} / ${obj.colIndex} / ${obj.rowSpan} / ${obj.colSpan}`}}>
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
