export default function ({ env, data, inputs, outputs, logger, onError }) {
  const { runImmediate } = data;

  const run = () => {
    if (data.type === 'randomNumber') {
      outputs['result'](Math.random())
    } else if (data.type === 'randomString') {
      outputs['result'](new String(Math.random()))
    } else {
      outputs['result'](data.value)
    }
  }

  if (runImmediate && env.runtime) {
    run()
  } else {
    inputs['input'](run)
  }
}
