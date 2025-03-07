/**
 * Data
 * @param title      标题
 * @param closable   是否显示右上角关闭按钮
 * @param centered   是否设置垂直居中
 * @param useFooter  是否使用工具条
 * @param width      弹窗宽度
 * @param hideTitle  隐藏标题
 * @param bodyStyle  对话框样式
 * @param footerLayout 工具条布局
 * @param footerBtns 操作项
 * @param maskClosable 点击蒙层关闭
 * @param keyboard 键盘 esc 关闭
 * @param enterkeyboard 键盘 enter 确认
 */

export enum Location {
  FRONT = 'front',
  BACK = 'back'
}

export interface DialogButtonProps {
  id: string;
  title: string;
  icon?: string;
  useIcon?: boolean;
  showText?: boolean;
  location?: Location;
  dynamicDisabled?: boolean;
  dynamicHidden?: boolean;
  hidden?: boolean;
  visible: boolean;
  isConnected?: boolean;
  useBtnLoading?: boolean;
  autoClose?: boolean;
  type: string;
  useDynamicDisabled: boolean;
  useDynamicHidden: boolean;
  disabled: boolean;
  // 权限信息
  permission?: {
    id: string;
    type: string;
    noPrivilegeType: 'hide' | 'hintLink';
    hintLink?: string;
    registerData?: {
      noPrivilege: 'hide' | 'hintLink';
      code: string;
      title: string;
    };
  };
}

export interface Data {
  //visible?: boolean;
  title: string;
  closable: boolean;
  centered: boolean;
  useFooter: boolean | number;
  width?: number;
  hideTitle: boolean;
  bodyStyle?: React.CSSProperties;
  footerLayout: AlignEnum;
  footerBtns: DialogButtonProps[];
  maskClosable?: boolean;
  isTitleCustom?: boolean;
  keyboard?: boolean;
  enterkeyboard?: boolean;

  //自定义弹出位置
  isCustomPosition?: boolean;
  horizontal?: 'left' | 'right'; 
  vertical?: 'top' | 'bottom';
  top: number,
  right: number,
  bottom: number,
  left: number,
  isMask: boolean,
  isZIndex: boolean,
  zIndex: number,
  autoClose: boolean
}

export const DefaultEvent = ['ok', 'cancel'];

export enum AlignEnum {
  Unset = 'unset',
  FlexStart = 'flex-start',
  Center = 'center',
  FlexEnd = 'flex-end'
}

export const InputIds = {
  SetDisable: 'setDisable',
  SetEnable: 'setEnable',

  SetHidden: 'setHidden',
  SetShow: 'setShow',

  SetBtnOpenLoading: 'setBtnOpenLoading',
  SetBtnCloseLoading: 'setBtnCloseLoading',
};