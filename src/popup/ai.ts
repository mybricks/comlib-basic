
export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: '对话框、弹窗',
    usage: `data数据模型
title: string
hideTitle: boolean
centered: boolean
useFooter: boolean
footerBtns: [ # 对话框默认的按钮组
{
  id: string
  title: string # 按钮文本
  type: ['default', 'primary']
  showText: boolean
  visible: boolean
}
]
closable: boolean
maskClosable: boolean
isMask: boolean

slots插槽
body: 对话框内容

styleAry声明
内容区域: .ant-modal-body
`
  }
};
