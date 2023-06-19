export default function ({data, outputs, inputs, onError}) {
  inputs['from']((val, relOutpus) => {
    const script = data.exchange?.script
    if (script) {
      let fn, returnVal,isOk

      try {
        eval(`fn = ${script}`)
        returnVal = fn(val)
        isOk = true
      } catch (ex) {
        console.error(ex)


        onError(`数据转换错误:${ex.message}`,ex)
      }

      if(isOk){
        outputs['to'](returnVal)
      }
    } else {
      onError('未配置转换规则')
    }
  })
}