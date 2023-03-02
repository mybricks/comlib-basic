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
      title: '样式',
      type: 'Style',
      options: {
        plugins: ['font', 'align', 'border', 'bgcolor']
      },
      value: {
        get({data}) {
          return data.style;
        },
        set({data}, value: object) {
          data.style = {
            ...data.style,
            ...value
          };
        }
      }
    },
    {},
    {
      title: '单击',
      type: '_Event',
      options: {
        outputId: 'click'
      }
    },
  ]
}
