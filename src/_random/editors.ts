export default {
  ':root': [
    {
      title: '内容类型',
      type: 'select',
      options({data}) {
        return [
          {
            label: '数字',
            value: 'number'
          }
        ]
      },
      value: {
        get({data, inputs}, val) {
          return data.valueType
        },
        set({data, inputs}, val) {
          data.valueType = val
        }
      }
    }
  ]
}