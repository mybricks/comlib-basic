export enum EnumSelectType {
  SCENE = 'SCENE',
  COMPONENT = 'COMPONENT',
  VAR = 'VAR'
}

export default {
  '@init'({ setDesc }) {
    setDesc("未选择组件")
  },
  ':root': [
    {
      title: '动态创建组件',
      description: '使用动态创建后，将使用传入的namespace字段创建组件',
      type: 'switch',
      value: {
        get({ data }) {
          return data.enbaleDymimic
        },
        set({ data, input }, val) {
          data.enbaleDymimic = val
        }
      }
    },
    {
      title: '选择组件',
      type: 'comSelector',
      ifVisible({ data }) {
        return !data.enbaleDymimic
      },
      options: {
        rtType: 'ui'
      },
      value: {
        get({ data }) {
          return data.comDef
        },
        set({ data, setDesc }, comDef) {
          if (comDef) {
            data.comDef = {
              namespace: comDef.namespace
            }
            setDesc(comDef.title)
          } else {
            data.comDef = null
            setDesc("未选择组件")
          }
        }
      }
    },
    {
      title: '放置组件',
      type: 'switch',
      value: {
        get({ data }) {
          return data.enbalePlace
        },
        set({ data }, val) {
          data.enbalePlace = val
        }
      }
    },
    {
      title: '放置到场景or组件中',
      type: 'select',
      options: {
        options: [
          {
            label: '场景',
            value: EnumSelectType.SCENE
          },
          {
            label: '组件',
            value: EnumSelectType.COMPONENT
          }
        ]
      },
      ifVisible({ data }) {
        return data.enbalePlace
      },
      value: {
        get({ data }) {
          return data.placeType
        },
        set({ data }, val) {
          data.placeType = val
        }
      }
    },
    {
      title: '放置到哪个场景',
      type: 'sceneComSelector',
      options: {
        type: EnumSelectType.SCENE
      },
      ifVisible({ data }) {
        return data.enbalePlace && data.placeType === EnumSelectType.SCENE
      },
      value: {
        get({ data }) {
          return data.targetSceneDef
        },
        set({ data }, val) {
          data.targetSceneDef = val
        }
      }
    },
    {
      title: '放置到哪个组件',
      type: 'sceneComSelector',
      options: {
        type: EnumSelectType.COMPONENT,
        filter({ slots }) {
          return slots?.length > 0
        }
      },
      ifVisible({ data }) {
        console.log(`data.targetComDef`, data.targetComDef)

        return data.enbalePlace && data.placeType === EnumSelectType.COMPONENT
      },
      value: {
        get({ data }) {
          return data.targetComDef
        },
        set({ data }, val) {
          data.targetComDef = val
          if (data.targetComDef?.slots?.length > 0) {
            data.targetSlotId = data.targetComDef?.slots?.[0]?.id
          }
        }
      }
    },
    {
      title: '选择组件插槽',
      type: 'select',
      ifVisible({ data }) {
        return data.enbalePlace && data.placeType === EnumSelectType.COMPONENT
      },
      options({ data }) {
        return {
          get options() {
            let options = []
            console.log(`data.targetComDef.slots`, data?.targetComDef?.slots)
            if (!data.enbalePlace || data.placeType !== EnumSelectType.COMPONENT) {
              return options
            }
            if (!data.targetComDef.slots) {
              return options
            }
            options = data.targetComDef.slots.map(item => ({ label: item.title, value: item.id }))
            console.log(`options`, options)
            return options
          }
        }
      },
      value: {
        get({ data }) {
          return data.targetSlotId
        },
        set({ data }, val) {
          data.targetSlotId = val
        }
      }
    },
  ]
}