import { isNumber, getPosition } from '../../utils';

export function resetLayout({data}) {
  data.rows = data.rows.filter((row, idx) => {
    if (row.cols.length > 0) {
      return row
    } else {
      const preRow = data.rows[idx - 1]
      if (row.height) {
        preRow.height += row.height
      }
      preRow.cols.forEach(col => {
        col.rowSpan -= 1
      })
    }
  })

  let mergeCol
  data.cols = data.cols.filter((col, idx) => {
    if (data.rows.find(row => {
      return row.cols.find(tcol => tcol.defId === col.id)
    })) {
      mergeCol = col
      return col
    } else {//没有定义
      //const preCol = data.cols[idx - 1]
      if (col.width) {
        mergeCol.width += col.width//合并宽度
      }

      data.rows.forEach(row => {
        row.cols.forEach(tcol => {
          if (tcol.defId === mergeCol.id) {
            tcol.colSpan -= 1//合并colspan
          }
        })
      })
    }
  })

  if (!data.cols.find(col => !col.width)) {//flex col
    const col = data.cols[data.cols.length - 1];
    col.width = void 0
    col.widthPercent = void 0
    col.cellWidthType = void 0
  }

  if (!data.rows.find(row => !row.height)) {//flex row
    data.rows[data.rows.length - 1].height = void 0
  }
}

export function calculateTds({data}, {po, aw, ah}, tableEl): {
  colIds,
  left, top,
  width, height
} {
  const colIds: Array<string[]> = []

  let left, top, width, height
  data.rows.forEach(row => {
    const trow: string[] = []
    row.cols.forEach((col) => {
      const ele = tableEl.querySelector(`#col-${col.id}`)
      const epo = getPosition(ele, tableEl)

      if (Math.abs(Math.max(po.x + aw, epo.x + ele.offsetWidth) - Math.min(po.x, epo.x))
        <
        (aw + ele.offsetWidth)
        &&
        Math.abs(Math.max(po.y + ah, epo.y + ele.offsetHeight) - Math.min(po.y, epo.y))
        <
        (ah + ele.offsetHeight)) {//范围存在交集
        trow.push(col.id)

        left = !isNumber(left) ? epo.x : Math.min(left, epo.x)
        top = !isNumber(top) ? epo.y : Math.min(top, epo.y)
        width = Math.max(width || 0, epo.x + ele.offsetWidth)
        height = Math.max(height || 0, epo.y + ele.offsetHeight)
      }
    })

    if (trow.length > 0) {
      colIds.push(trow)
    }
  })

  left = left || 0
  top = top || 0

  return {
    colIds,
    left,
    top,
    width: (width || 0) - left,
    height: (height || 0) - top
  }
}

export function refleshPercent ({cols, styleWidth, cover = false}) {
  const colsLength = cols.length;
  cols.forEach((col, idx) => {
    if (colsLength - 1 === idx) return
    const { width } = col;

    if (cover) {
      if (width) {
        col.widthPercent = `${((width / styleWidth) * 100).toFixed(2)}%`
      }
    } else {
      col.widthPercent = width ? `${((width / styleWidth) * 100).toFixed(2)}%` : 0
    }
  })
}

export function refleshPx ({cols, styleWidth, cover = false}) {
  const colsLength = cols.length;
  cols.forEach((col, idx) => {
    if (colsLength - 1 === idx) return
    const { widthPercent } = col;

    if (cover) {
      if (widthPercent) {
        col.width = Number((Number(widthPercent.replace('%', '')) / 100 * styleWidth).toFixed(0))
      }
    } else {
      col.width = widthPercent ? Number((Number(widthPercent.replace('%', '')) / 100 * styleWidth).toFixed(0)) : 0
    }
  })
}

export function resetEditCol (data, currentCol, element) {
  let curLeft = 0
  data.cols.find(col => {
    if (col.id !== currentCol.id) {
      const tdEle = element.querySelector(`#col-${col.id}`)
      curLeft += tdEle?.clientWidth || 0
    } else {
      return true
    }
  })

  const tdEle = element.querySelector(`#col-${currentCol.id}`)

  data._editCol = {
    id: currentCol.id,
    tdEle,
    style: {
      width: tdEle?.clientWidth,
      left: curLeft
    }
  }
}
