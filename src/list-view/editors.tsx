import {uuid} from "../utils";

export default {
  // '@init'({style}) {
  //   style.height = 50
  //   style.width = 100
  // },
  '@resize': {
    options: ['width', 'height']
  },
  ':root': [
    {
      title: '添加项目',
      type: 'button',
      value: {
        set({data, slots}) {
          const id = uuid(), title = `项目${data.items.length + 1}`
          data.items.push({
            id,
            title
          })

          slots.add({
            id,
            title
          })
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
    }
  ]
}
