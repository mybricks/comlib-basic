export default (utils)  => {
  const result = {}

  result['显示插槽'] = [
    {
      "Q": `显示矩形组件插槽`,
      "A": {
        "data": {
          "asSlot": true,
        },
        "slots": [{
          id: 'container',
          title: '容器'
        }]
      }
    },
    {
      "Q": `隐藏矩形组件插槽`,
      "A": {
        "data": {
          "asSlot": false,
        },
        "slots": []
      }
    },
  ]

  result['插槽布局'] = [
    {
      "Q": `将矩形组件的插槽布局设置为绝对定位`,
      "A": {
        "data": {
          "asSlot": true,
          "slotLayout": "absolute"
        }
      }
    },
    {
      "Q": `将矩形组件的插槽布局设置为相对定位`,
      "A": {
        "data": {
          "asSlot": true,
          "slotLayout": "relative"
        }
      }
    },
    {
      "Q": `将矩形组件的插槽布局设置为固定定位`,
      "A": {
        "data": {
          "asSlot": true,
          "slotLayout": "fixed"
        }
      }
    }
  ]
   
  result['样式'] = [
    {
      "Q": `将矩形组件背景色修改为红色`,
      "A": {
        "data": {
          "style": {
            "backgroundColor": "red"
          }
        }
      }
    },
    {
      "Q": `将矩形组件宽度设置为100像素，高度设置为200像素,并且设置为绝对定位`,
      "A": {
        "data": {
          "style": {
            width: 100,
            height: 200,
            position: 'absolute'
          }
        }
      }
    }
  ]

  return result
}