export default {
  '@init'({style}) {
    style.width = 100
  },
  '@resize': {
    options: ['width']
  },
  ':root': [
    {
      title: '文本',
      type: 'text',
      value: {
        get({data}) {
          return data.content
        },
        set({data}, value) {
          data.content = value
        }
      }
    },
    {
      title: '单击',
      type: '_Event',
      options: {
        outputId: 'click'
      }
    },
  ]
}
