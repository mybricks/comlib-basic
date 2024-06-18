export default function ({ env, data, inputs, outputs }) {
  if (!!env.runtime) {
    inputs['get']((nextValue) => {
      const { sceneId, store } = nextValue
      const com = env.command.getCom({ sceneId: data.comDef.sceneId, comId: data.comDef.id })
      outputs['finish'](com)
    })
  }
}
