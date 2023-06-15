//import { Data, OutputIds } from './constants';

export default function ({
  data,
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

  return true;
}