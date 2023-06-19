export default function ({env, data, inputs, outputs, logger, onError}) {
  inputs['input']((val) => {
    if (data.type === 'randomNumber') {
      outputs['result'](Math.random())
    } else if (data.type === 'randomString') {
      outputs['result'](new String(Math.random()))
    } else {
      outputs['result'](data.value)
    }
  })
}
