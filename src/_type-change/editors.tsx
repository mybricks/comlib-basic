/**
 * MyBricks Opensource
 * https://mybricks.world
 * This source code is licensed under the MIT license.
 *
 * CheMingjun @2019
 * mybricks@126.com
 */

export default {
  '@init'({data, setDesc}) {
    if (!data.exchange) {
      setDesc(`未配置规则`)
    }
  },
  ':root': [
    {
      title: '类型转换',
      type: '_typeChange',
      options({data, input, output}) {
        const from = input.get('from').schema
        const to = output.get('to').schema
        return {
          from, to
        }
      },
      value: {
        get({data, input, output}) {
          return data.exchange
        },
        set({data, setDesc}, val) {
          data.exchange = val

          if (val.script) {
            setDesc(`${val.title}`)
          } else {
            setDesc(`未配置规则`)
          }
        }
      }
    }
  ]
}



