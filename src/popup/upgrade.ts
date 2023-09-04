//import { Data, OutputIds } from './constants';

export default function ({
  data,
  output,
  input
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
  return true;
}