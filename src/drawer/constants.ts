/**
 * Data
 * @param title      标题
 * @param hideTitle  隐藏标题
 * @param width      抽屉宽度
 * @param height     抽屉高度
 * @param placement  弹出位置
 * @param useFooter  是否使用工具条
 * @param footerLayout 工具条布局
 * @param footerBtns 操作项
 * @param closable   是否显示右上角关闭按钮
 * @param maskClosable 点击蒙层关闭
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
}

export interface Data {
  //visible?: boolean;
  title: string;
  hideTitle: boolean;
  width?: number;
  height?: number;
  placement: 'top' | 'right' | 'bottom' | 'left' | undefined;
  useFooter: boolean | number;
  footerLayout: AlignEnum;
  footerBtns: DialogButtonProps[];
  closable: boolean;
  maskClosable?: boolean;
}

export const DefaultEvent = ['ok', 'cancel'];

export enum AlignEnum {
  Unset = 'unset',
  FlexStart = 'flex-start',
  Center = 'center',
  FlexEnd = 'flex-end'
}