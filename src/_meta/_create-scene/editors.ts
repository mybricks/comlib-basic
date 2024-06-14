export default {
  '@init'({ setDesc }) {
    setDesc('空白场景')

  },
  '@toJSON'({ data, scenes }){
    const { scene } = data
    console.log("@toJSON: ", data)
    return {
      data: {
        scene,
        dump: scene.empty ? {
          id: scene.id,
          title: scene.title
        } : JSON.stringify(scenes.dump(scene.id))
      }
    }
  },
  ':root': [
    {
      title: '选择场景',
      type: 'sceneSelector',
      value: {
        get({ data }) {
          return data.scene
        },
        set({ data, setDesc }, scene) {
          data.scene = scene
          setDesc(scene.empty ? '空白场景' : `基于“${scene.title}”`)
        }
      }
    }
  ]
}