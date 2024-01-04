export default (utils)  => {
  const result = {}

  result['自定义浮层位置'] = [
    {
      "Q": `开启弹窗组件自定义浮层位置`,
      "A": {
        "data": {
          "isCustomPosition": true
        }
      }
    }
  ]

  result['水平方向'] = [
    { value: 'left', label: '左' },
    { value: 'right', label: '右' }
  ].map((i) => {
    return {
      "Q": `将弹窗组件自定义浮层水平方向位置设置为${i.label}`,
      "A": {
        "data": {
          "isCustomPosition": true,
          "horizontal": i.value
        }
      }
    } 
  })

  result['垂直方向'] = [
    { value: 'top', label: '上' },
    { value: 'bottom', label: '下' },
  ].map((i) => {
    return {
      "Q": `将弹窗组件自定义浮层垂直方向位置设置为${i.label}`,
      "A": {
        "data": {
          "isCustomPosition": true,
          "vertical": i.value
        }
      }
    } 
  })

  const left = utils.number.int({ min: 0, max: 100 })
  result['左'] = [
    {
      "Q": `将弹窗组件自定义浮层左位置左边设置为${left}`,
      "A": {
        "data": {
          "isCustomPosition": true,
          "horizontal": "left",
          "left": left
        }
      }
    }
  ]

  const right = utils.number.int({ min: 0, max: 100 })
  result['右'] = [
    {
      "Q": `将弹窗组件自定义浮层左位置右边设置为${right}`,
      "A": {
        "data": {
          "isCustomPosition": true,
          "horizontal": "right",
          "right": right
        }
      }
    }
  ]

  const top = utils.number.int({ min: 0, max: 100 })
  result['右'] = [
    {
      "Q": `将弹窗组件自定义浮层左位置右边设置为${right}`,
      "A": {
        "data": {
          "isCustomPosition": true,
          "vertical": "top",
          "top": top
        }
      }
    }
  ]

  const bottom = utils.number.int({ min: 0, max: 100 })
  result['右'] = [
    {
      "Q": `将弹窗组件自定义浮层左位置右边设置为${right}`,
      "A": {
        "data": {
          "isCustomPosition": true,
          "vertical": "bottom",
          "bottom": bottom
        }
      }
    }
  ]

  result['展示蒙层'] = [
    {
      "Q": `打开弹窗组件的蒙层`,
      "A": {
        "data": {
          "isMask": true
        }
      }
    },
    {
      "Q": `关闭弹窗组件的蒙层`,
      "A": {
        "data": {
          "isMask": false
        }
      }
    }
  ]

  const width = utils.number.int({ min: 0, max: 5000 })
  result['弹窗宽度'] = [
    {
      "Q": `将弹窗组件宽度设置为${width}`,
      "A": {
        "data": {
          "width": width + 'px'
        }
      }
    }
  ]

  const maxHeight = utils.number.int({ min: 0, max: 5000 })
  result['弹窗宽度'] = [
    {
      "Q": `将弹窗组件内容最大高度限制设置为${maxHeight}`,
      "A": {
        "data": {
          "maxHeight": maxHeight
        }
      }
    }
  ]

  result['标题'] = [
    {
      "Q": `将弹窗组件标题设置为添加活动`,
      "A": {
        "data": {
          "title": '添加活动'
        }
      }
    }
  ]

  result['隐藏标题'] = [
    {
      "Q": `将弹窗组件标题隐藏`,
      "A": {
        "data": {
          "hideTitle": true
        }
      }
    }
  ]

  result['关闭按钮'] = [
    {
      "Q": `隐藏弹窗组件关闭按钮`,
      "A": {
        "data": {
          "closable": true
        }
      }
    }
  ]

  result['垂直居中'] = [
    {
      "Q": `将弹窗组件内容设置为垂直居中`,
      "A": {
        "data": {
          "centered": true
        }
      }
    }
  ]

  result['点击蒙层关闭'] = [
    {
      "Q": `开启弹窗组件点击蒙层关闭功能`,
      "A": {
        "data": {
          "maskClosable": true
        }
      }
    }
  ]

  result['键盘esc关闭'] = [
    {
      "Q": `开启弹窗组件键盘esc关闭功能`,
      "A": {
        "data": {
          "keyboard": true
        }
      }
    }
  ]

  result['显示'] = [
    {
      "Q": `开启弹窗组件操作区`,
      "A": {
        "data": {
          "useFooter": true
        }
      }
    }
  ]

  result['对齐方式'] = [
    { value: 'flex-start', label: '居左' },
    { value: 'center', label: '居中' },
    { value: 'flex-end', label: '居右' }
  ].map((i) => {
    return {
      "Q": `将弹窗组件对齐方式设置为${i.label}`,
      "A": {
        "data": {
          "footerLayout": i.value
        }
      }
    } 
  })

  result['操作列表'] = [
    {
      "Q": `将弹窗组件的底部功能按钮列表设置确认和取消`,
      "A": {
        "data": {
          "footerBtns": [
            {
              id: utils.string.uuid(),
              title: `确认`,
              icon: "",
              useIcon: false,
              showText: true,
              dynamicHidden: true,
              dynamicDisabled: true,
              type: "default",
              visible: true,
              autoClose: true,
              isConnected: false,
              disabled: false,
              useDynamicDisabled: false,
              useDynamicHidden: false
            },
            {
              id: utils.string.uuid(),
              title: `取消`,
              icon: "",
              useIcon: false,
              showText: true,
              dynamicHidden: true,
              dynamicDisabled: true,
              type: "primary",
              visible: true,
              autoClose: true,
              isConnected: false,
              disabled: false,
              useDynamicDisabled: false,
              useDynamicHidden: false
            }
          ]
        }
      }
    }
  ]

  return result
}