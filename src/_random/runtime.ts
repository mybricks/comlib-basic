export default function ({env, data, inputs, outputs, logger, onError}) {
  inputs['input']((val) => {
    outputs['result'](Math.random())
  })
}
