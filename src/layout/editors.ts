export default {
  '@ai': ({data,addCom}) => {
    const newData = {//设计新的数据结构
      rows:data.rows.map(row=>{
        return {
          columns:row.columns.map(col=>{
            return {
              id:col.slot,//以slotId为id
              span:col.span
            }
          })
        }
      })
    }

    return {
      context: `当前组件数据：${JSON.stringify(newData)}，
      其中,rows代表了行，columns代表了列，columns中的span代表了列的宽度、id代表了列的唯一标识、add代表了列中添加的组件。
      例如： "在第一行第三列中添加文本框组件"，指的是在对应的column的add属性中以数组的形式添加组件.`,
      execute: (json) => {
        if (json) {
          const rows = json.rows
          if (Array.isArray(rows)) {
            rows.forEach(row => {
              const columns = row.columns
              if (Array.isArray(columns)) {
                columns.forEach(col => {
                  const addComs = col.add
                  if(Array.isArray(addComs)){
                    addComs.forEach(com => {
                      addCom(com, col.id)
                    })
                  }
                })
              }
            })
          }
        }
      }
    }
  },
  "@init"({ style, data, output }) {
    style.width = 180;
    style.height = 180;
  },
  "@resize": {
    options: ["width", "height"],
  },
  ":root": [
    {
      title: "布局",
      type: "layout",
      options: [],
      value: {
        get({ data }) {
          return data.layoutStyle;
        },
        set({ data, slot }, value) {
          if (value.position === "absolute") {
            slot.get("content").setLayout("absolute");
          } else if (
            value.position !== "absolute" &&
            value.display === "flex"
          ) {
            if (value.flexDirection === "row") {
              slot.get("content").setLayout("flex-row");
            } else if (value.flexDirection === "column") {
              slot.get("content").setLayout("flex-column");
            }
          }
          data.layoutStyle = value;
        },
      },
    },
    {
      title: "样式",
      type: "style",
      options: {
        plugins: ["background", "border", "padding"],
      },
      value: {
        get({ data }) {
          return data.style;
        },
        set({ data }, v) {
          data.style = v;
        },
      },
    },
  ],
};
