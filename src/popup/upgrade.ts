//import { Data, OutputIds } from './constants';

export default function ({
  data,
  output,
  input,
  setDeclaredStyle,
  getDeclaredStyle,
  removeDeclaredStyle
}): boolean {
  /**
   * @description 隐藏标题（hideTitle）、垂直居中（centered）、对话框宽度（width）、显示工具条（useFooter）、页脚布局（footerLayout）、
   */
  if (typeof data.hideTitle === "undefined") {
    data.hideTitle = false;
  }
  if (typeof data.centered === "undefined") {
    data.centered = false;
  }
  if(typeof data.width === "undefined"){
    data.width = 520;
  }
  if(typeof data.useFooter === "undefined"){
    data.useFooter = true
  }
  if(typeof data.footerLayout === "undefined"){
    data.footerLayout = "flex-end"
  }
  if(typeof data.footerBtns === "undefined"){
    data.footerBtns = [
      {
        "id": "cancel",
        "title": "取消",
        "icon": "",
        "useIcon": false,
        "showText": true,
        "dynamicHidden": true,
        "dynamicDisabled": true,
        "type": "default",
        "visible": true,
        "autoClose": true,
        "isConnected": false
      },
      {
        "id": "ok",
        "title": "确认",
        "type": "primary",
        "icon": "",
        "dynamicHidden": true,
        "dynamicDisabled": true,
        "useIcon": false,
        "showText": true,
        "visible": true,
        "autoClose": true,
        "isConnected": false
      }
    ]
  }

  /**
   * @description 1.0.1->1.0.2  新增 closable
   */
  if(typeof data.closable === "undefined"){
    data.closable = true
  }

  /**
   * @description 1.0.3->1.0.4  新增 maskClosable, 点击蒙层关闭,
   *  取消按钮的autoClose,如果已经取消按钮之前已经连线了，点击自动关闭对话框为false，要经过rels
   */
  if(typeof data.maskClosable === "undefined"){
    data.maskClosable = true
  }  
  const cancelFn = output.get('cancel');
  const cons = cancelFn.connectionCount;
  if(cons !== 0){
    const index = data.footerBtns.findIndex((item) => item.id === 'cancel');
    data.footerBtns[index].autoClose = false;
  }

  /**
   * @description 1.0.10->1.0.11  新增 outputs -> apply(应用), inputs -> title(修改标题)
   */
  const schema = {
    type: "string"
  };
  if (!input.get('title')) {
    input.add('title', '修改标题', schema)
  }

  const follwSchem = {
    type: "follow"
  }
  if (!output.get('apply')) {
    output.add('apply', '应用', follwSchem)
  }

  /**
   * @description 1.0.17->1.0.18  新增 自定义标题
   */
  if(typeof data.isTitleCustom === "undefined"){
    data.isTitleCustom = false
  }

  /**
   * @description 1.0.18->1.0.19  新增 操作项，禁用启用
  */
  data.footerBtns?.forEach(act => {
    if (act && act.disabled === undefined) {
      act.disabled = false;
    }
    if(act && act.useDynamicDisabled === undefined){
      act.useDynamicDisabled = false;
    }
    if(act && act.useDynamicHidden === undefined){
      act.useDynamicHidden = false;
    }
  })


  /**
   * @description 1.0.20->1.0.21  更改target
  */
  const preBodyStyle = getDeclaredStyle(`.ant-modal-body`);
  const preStyleList = data.footerBtns.map((item)=>{
    getDeclaredStyle(`button[data-handler-button="${item.id}"]`);
  })
  const preHoverStyleList = data.footerBtns.map((item)=>{
    getDeclaredStyle(`button[data-handler-button="${item.id}"]:hover`);
  })


  let bodyCss: React.CSSProperties = {}, css: React.CSSProperties = {}, hoverCss: React.CSSProperties = {};
  
  if (preBodyStyle) {
    bodyCss = { ...preBodyStyle.css };
    removeDeclaredStyle(`.ant-modal-body`);
    setDeclaredStyle('.{id} .ant-modal-body', bodyCss);
  }
  preStyleList.map((item)=>{
    if (item) {
      css = { ...item.css };
      removeDeclaredStyle(`button[data-handler-button="${item.id}"]`);
      setDeclaredStyle('.{id} button[data-handler-button="${item.id}"]', css);
    }
  })
  preHoverStyleList.map((item)=>{
    if(item) {
      hoverCss = { ...item.css };
      removeDeclaredStyle(`button[data-handler-button="${item.id}"]:hover`);
      setDeclaredStyle('.{id} button[data-handler-button="${item.id}"]:hover', css);
    }
  })

  /**
   * @description 1.0.21->1.0.22  新增是否支持键盘 esc 关闭 keyboard
  */
  if(typeof data.keyboard === "undefined"){
    data.keyboard = true
  }
  return true;
}