/**
 * Data
 * @param title      标题
 * @param okText     确认按钮内容
 * @param closable   是否显示右上角关闭按钮
 * @param centered   是否设置垂直居中
 * @param useFooter  是否使用工具条
 * @param cancelText 取消按钮内容
 * @param width      弹窗宽度
 * @param hideTitle  隐藏标题
 * @param isNew      是否为改造后的对话框
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
  // visible?: boolean;
  // title: string;
  // okText: string;
  // closable: boolean;
  centered: boolean;
  useFooter: boolean | number;
  // cancelText: string;
  width?: number;
  hideTitle: boolean;
  // isNew?: boolean;
  // bodyStyle?: React.CSSProperties;
  footerLayout: AlignEnum;
  footerBtns: DialogButtonProps[];
  // destroyOnClose?: boolean;
  // maskClosable?: boolean;
  // getContainer?: () => any;
}

export const DefaultEvent = ['ok', 'cancel'];

export enum AlignEnum {
  Unset = 'unset',
  FlexStart = 'flex-start',
  Center = 'center',
  FlexEnd = 'flex-end'
}