export default {
  ':root': [
    {
      title: '数据类型',
      type: 'select',
      options({data}) {
        return [
          {
            label: '对象',
            value: 'object'
          },
          {
            label: '数组',
            value: 'array'
          },
          {
            label: '随机数字',
            value: 'randomNumber'
          },
          {
            label: '随机字符',
            value: 'randomString'
          }
        ]
      },
      value: {
        get({data, inputs}, val) {
          return data.type
        },
        set({data, inputs, outputs}, val) {
          if (data.type === val) {
            return
          }

          data.type = val
          data.value = void 0

          if (val === 'object') {
            outputs.setSchema('result', {
                type: 'object',
                properties: {type: 'string'}
              }
            )
          } else if (val === 'array') {
            outputs.setSchema('result', {
              type: 'array',
              items: {type: 'string'}
            })
          } else if (val === 'randomNumber') {
            outputs.setSchema('result', {type: 'number'})
          } else if (val === 'randomString') {
            outputs.setSchema('result', {type: 'string'})
          }
        }
      }
    },
    {
      title: '对象数据',
      type: 'map',
      ifVisible({data}) {
        return data.type === 'object'
      },
      value: {
        get({data, inputs}, val) {
          return data.value
        },
        set({data, inputs}, val) {
          data.value = val
        }
      }
    },
    {
      title: '列表数据',
      type: 'list',
      ifVisible({data}) {
        return data.type === 'array'
      },
      value: {
        get({data, inputs}, val) {
          return data.value
        },
        set({data, inputs}, val) {
          data.value = val
        }
      }
    }
  ]
}