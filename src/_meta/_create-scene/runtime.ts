export default function ({ env, data, inputs, outputs }) {
  const next = !env.runtime.debug
  inputs['create'](() => {
    let nextValue
    
    if (next) {
      console.log("创建场景: ", data.dump)
      nextValue = env.canvas.appendScene(data.dump)
      outputs['finish'](nextValue?.id)
    }
  })
}
