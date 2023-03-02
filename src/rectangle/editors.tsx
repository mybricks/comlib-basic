export default {
  '@init'({style}) {
    style.height = 50
    style.width = 100
  },
  '@resize': {
    options: ['width', 'height']
  },
  ':root': [
    {
      title: '显示插槽',
      type: 'switch',
      value: {
        get({data}) {
          return data.asSlot
        },
        set({data, slots}, value) {
          data.asSlot = value
          if (value) {
            slots.add({
              id: 'container',
              title: '容器'
            })
          } else {
            slots.remove('container')
          }
        }
      }
    },
    {
      title: '插槽布局',
      type: 'layout',
      ifVisible({data}) {
        return data.asSlot
      },
      value: {
        get({data, slots, focusArea}) {
          return data.slotLayout
        },
        set({data, slots, focusArea}, ly) {
          data.slotLayout = ly

          const slot = slots.get('container')

          if (ly.position === 'absolute') {
            slot.setLayout('absolute')
          } else {
            slot.setLayout(ly.position)
          }
        }
      }
    },
    {},
    {
      title: '样式',
      type: 'Style',
      options: {
        plugins: ['border', 'bgcolor']
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
