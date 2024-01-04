export default (utils)  => {
  const result = {}

  const options = [
    { value: 'circle', label: '圆或椭圆' },
    { value: 'rectangle', label: '矩形' },
    { value: 'triangle', label: '三角形' }
  ]
  result['形状'] = options.map(item => {
    return {
      "Q": `将形状组件的形状设置为${item.label}`,
      "A": {
        "data": {
          "type": item.value
        }
      }
    }
  })

  return result
}