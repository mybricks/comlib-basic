export default {
  '@init'({ style }) {
    style.height = 80
    style.width = 180
  },
  '@resize': {
    options: ['width', 'height'],
  },
  '.mybricks-rectangle-text': {
    items: [],
    '@dblclick': {
      type: 'text',
      value: {
        get({ data, focusArea }) {
          return data.text
        },
        set({ data, focusArea }, value: string) {
          data.text = value
        },
      },
    },
  },
  ':root': [
    // {
    //   title: '显示插槽',
    //   type: 'switch',
    //   value: {
    //     get({data}) {
    //       return data.asSlot
    //     },
    //     set({data, slots}, value) {
    //       data.asSlot = value
    //       if (value) {
    //         slots.add({
    //           id: 'container',
    //           title: '容器'
    //         })
    //       } else {
    //         slots.remove('container')
    //       }
    //     }
    //   }
    // },
    // {
    //   title: '插槽布局',
    //   type: 'layout',
    //   ifVisible({data}) {
    //     return data.asSlot
    //   },
    //   value: {
    //     get({data, slots, focusArea}) {
    //       return data.slotLayout
    //     },
    //     set({data, slots, focusArea}, ly) {
    //       data.slotLayout = ly

    //       const slot = slots.get('container')

    //       if (ly.position === 'absolute') {
    //         slot.setLayout('absolute')
    //       } else {
    //         slot.setLayout(ly.position)
    //       }
    //     }
    //   }
    // },
    // {},
    {
      title: '样式',
      type: 'Stylenew',
      options: {
        defaultOpen: true,
        plugins: [
          {
            type: 'border',
          },
        ],
      },
      value: {
        get({ data }) {
          return data.style
        },
        set({ data }, value: object) {
          data.style = {
            ...data.style,
            ...value,
          }
        },
      },
    },
    {
      title: '文本样式',
      type: 'Stylenew',
      options: {
        defaultOpen: true,
        plugins: [
          {
            type: 'font',
            config: {
              disableTextAlign: true,
              disableLineHeight: true,
              disableLetterSpacing: true,
              disableWhiteSpace: true,
            },
          },
        ],
      },
      value: {
        get({ data }) {
          return data.textStyle
        },
        set({ data }, value: object) {
          data.textStyle = {
            ...data.textStyle,
            ...value,
          }
        },
      },
    },
    {
      title: '事件',
      items: [
        {
          title: '单击',
          type: '_Event',
          options: {
            outputId: 'click',
          },
        },
      ],
    },
  ],
}
