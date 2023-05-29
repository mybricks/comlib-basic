export default {
  '@init'({style}) {
    style.width = '100%'
    style.height = '100%'
  },
  ':root': {},
  '[data-title]': {
    title: '标题',
    items: [
      {
        title: '内容',
        type: 'text',
        value: {
          get({data}) {
            return data.title
          },
          set({data}, title) {
            data.title = title
          }
        }
      }
    ]
  },
  '[data-handler-button]': {
    title: '按钮',
    items: [
      {
        title: '点击',
        type: '_event',
        options({focusArea}) {
          return {
            outputId: focusArea.dataset.handlerButton
          }
        }
      }
    ]
  }
}