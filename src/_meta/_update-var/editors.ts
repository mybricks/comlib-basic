export default {
  '@init'({ setDesc }) {
    setDesc("未选择变量")
  },
  ':root': [
    {
      title: '选择变量',
      type: 'sceneComSelector',
      options: {
        type: 'VAR'
      },
      value: {
        get({ data }) {
          return data.varDef
        },
        set({ data, setDesc }, varDef) {
          data.varDef = {
            id: varDef.id,
            title: varDef.title
          }
          setDesc(data.varDef.title)
        }
      }
    }
  ]
}