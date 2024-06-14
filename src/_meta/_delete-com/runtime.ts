export default function ({ env, data, inputs, outputs }) {
  const next = !env.runtime.debug
  inputs['create']((nextValue) => {
    const { sceneId } = nextValue

    if (next) { 
      console.log("删除组件: ", data.comDef, nextValue)
      env.canvas.removeCom({sceneId, comId: data.comDef.id})
      outputs['finish'](sceneId)
    }
  })
}
