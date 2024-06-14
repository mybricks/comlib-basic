import { Data } from "./const"
import { EnumSelectType } from "./editors"

/**
 * 

            "slotInfo": {
              "type": "object",
              "description": "向场景（sceneId）的组件（comId）的插槽（slotId）添加组件，不提供组件和插槽的id则直接向画布中添加",
              "properties": {
                "comId": {
                  "type": "string",
                  "description": "组件ID"
                },
                "slotId": {
                  "type": "string",
                  "description": "插槽ID"
                }
              }
            },
 */
export default function ({ env, data, inputs, outputs }: { data: Data, env: any, inputs: any, outputs: any }) {
  inputs['create']((nextValue) => {
    if (data.enbaleDymimic) {
      data.comDef.namespace = nextValue.namespace
    }
    data.comDef.data = nextValue.data || {}

    if (data.enbalePlace && data.placeType === EnumSelectType.SCENE) {
      const targetScene = env.command.getScene(data.targetSceneDef.id)
      if (targetScene) {
        env.command.appendCom({ sceneId: data.targetSceneDef.id }, { ...data.comDef })
      }
    } else if (data.enbalePlace && data.placeType === EnumSelectType.COMPONENT) {
      const targetCom = env.command.getCom({ sceneId: data.targetComDef.sceneId, comId: data.targetComDef.id })
      if (!targetCom) {
        throw new Error(`找不到要放置的组件`)
      }
      if (!data.targetSlotId) {
        throw new Error(`没有选择插槽位置`)
      }
      const { slots } = targetCom
      const slot = slots.find(item => {
        return item.id === data.targetSlotId
      })

      if (!slot) {
        throw new Error(`找不到对应的插槽`)
      }
      slot.appendChild(data.comDef)

      // env.command.appendCom({ sceneId: data.targetComDef.scendId, comId: data.targetComDef.id, slotId: data.targetSlotId }, { ...data.comDef })
    }


    // console.log("创建组件: ", data.comDef, nextValue)
    // /**
    //  * slotInfo
    //  *  - comId 组件id
    //  *  - slotId 插槽id
    //  *  默认使用传入的sceneId，没有comId和slotId则添加至场景，若有，例：向表单容器的content插槽添加组件
    //  */
    // const { slotInfo, data: comData } = store

    // env.canvas.appendCom({
    //   sceneId,
    //   ...slotInfo,
    // }, {
    //   // 包含组件信息（namespace，表达添加的组件
    //   ...data.comDef,
    //   // 组件数据源，引擎内Object.assgin来合并
    //   data: { ...comData }
    // })

    outputs['finish'](data.comDef)
  })
}
