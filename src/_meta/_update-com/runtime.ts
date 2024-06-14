import { merge } from 'lodash'

export default function ({ env, data, inputs, outputs }) {
  const next = !!env.runtime
  inputs['store']((store) => {

    if (next) {
      /**
       * comData 数据源
       * delete 删除组件
       *  - slotId 从该插槽内删除
       *  - comId 被删除组件的id
       * append 添加组件
       *  - slotId 向该插槽添加组件
       *  - namesapce 组件命名空间
       *  - data 组件数据源
       */
      const { data: comData, delete: delStore, append } = store

      console.log(`update com comData`, comData, data.comDef)
      const com = env.command.getCom({ sceneId: data.comDef.sceneId, comId: data.comDef.id })

      const { slots } = com
      if (slots) {
        const slotMap = {}
        delStore?.forEach(({ slotId, comId }) => {
          let slot = slotMap[slotId]
          if (typeof slot === 'undefined') {
            slot = slots.find((slot => slot.id === slotId))
            if (slot) {
              slotMap[slotId] = slot
            }
            slotMap[slotId] = slot || false
          }

          slot && slot.deleteChild({ comId })
        })

        append?.forEach(({ slotId, namespace, data }) => {
          let slot = slotMap[slotId]
          if (typeof slot === 'undefined') {
            slot = slots.find((slot => slot.id === slotId))
            if (slot) {
              slotMap[slotId] = slot
            }
            slotMap[slotId] = slot || false
          }

          slot && slot.appendChild({ namespace, data })
        })
      }

      com.data = merge(com.data, comData)
      outputs['finish']()
    }
  })
}
