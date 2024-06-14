import { merge } from 'lodash'

export default function ({ env, data, inputs, outputs }) {
  inputs['setVal']((val) => {
    console.log(`update var`, data.varDef, val)
    if (!data.varDef) {
      throw new Error(`无法找到变脸`)
    }
    const varCom = env.command.getVar({ varId: data?.varDef?.id })

    varCom.setDefaultValue(val)
    outputs['finish'](varCom)
  })
}
