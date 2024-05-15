//import { Data, OutputIds } from './constants';

export default function ({
  input,
  output,
  data,
  setDeclaredStyle,
  getDeclaredStyle,
  removeDeclaredStyle
}): boolean {
  /**
   * @description 1.0.2->1.0.3  新增 outputs -> apply(应用), inputs -> title(修改标题)
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
   * @description 1.0.5->1.0.6  新增 自定义标题
   */
  if(typeof data.isTitleCustom === "undefined"){
    data.isTitleCustom = false
  }

  /**
   * @description 1.0.6->1.0.7  新增 操作项，禁用启用
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
   * @description 1.0.8->1.0.9  更改target
  */
  const preBodyStyle = getDeclaredStyle(`.ant-drawer-body`);

  let bodyCss: React.CSSProperties = {};
  
  if (preBodyStyle) {
    bodyCss = { ...preBodyStyle.css };
    removeDeclaredStyle(`.ant-drawer-body`);
    setDeclaredStyle('.{id} .ant-drawer-body', bodyCss);
  }

  /**
   * @description 1.0.9->1.0.10  新增是否支持键盘 esc 关闭 keyboard
  */
  if(typeof data.keyboard === "undefined"){
    data.keyboard = true
  }

  /**
   * @description 1.0.11->1.0.12  新增 操作项，动态设置loading
  */
  data.footerBtns?.forEach(act => {
    if(act && act.useDynamicLoadding === undefined){
      act.useDynamicLoadding = false;
    }
  })

  /**
   * @description 1.0.12->1.0.13  新增 层级配置
  */
  if(typeof data.isZIndex === "undefined"){
    data.isZIndex = false
  }
  if(typeof data.zIndex === "undefined"){
    data.zIndex = 1000
  }

  /**
   * @description 1.0.18->1.0.19  新增 关闭output
  */
  if (!output.get('close')) {
    output.add('close', '关闭')
  }
  if(typeof data.autoClose === "undefined"){
    data.autoClose = true
  }

  return true;
}