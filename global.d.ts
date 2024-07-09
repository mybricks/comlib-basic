declare module '*.less' {
  const classes: { [key: string]: string };
  export default classes;
}

interface T_Props {
  outputs: {
    [keyname: string]: (...param: any) => void
  }
  inputs: any,
  data: any,
  env: any,
  slots: any
}

interface Env {
  ajax: (url: string, opt: Record<string, any>) => Promise<any>
  events: any[]
  vars?: {
    getQuery: () => any;
    getCookies: () => any;
    getRouter: () => Record<string, Function>
  }
  i18n: (text: any) => any
  [x: string]: any
}
interface RuntimeParams<T> {
  /** 组件ID **/
  id: string
  name: string
  data: T
  env: Env
  style: any
  slots: {
    [key: string]: {
      render: (props?: { wrap?: any, inputValues?: any, key?: number | string, style?: React.CSSProperties, outputs?: { [key: string]: Function } }) => React.ReactNode
      inputs: any
      [key: string]: any
    }
  }
  inputs: any
  outputs: any
  _inputs: any
  _outputs: any
  logger: any
  createPortal: any
  /** 父容器插槽 **/
  parentSlot: any
  title?: string
  onError: (params: Error | string) => null,
  undo: {
    start: (params: any) => UndoTask
  }
}

type UndoTask = {commit: Function}

interface EditorResult<T> {
  id: string
  name: string
  data: T
  focusArea: any
  output: any
  input: any
  inputs: any
  outputs: any
  slot: any,
  diagram: any
  style: React.CSSProperties
  catelog: any
  slots?: any
  env: Env
  setAutoRun: (auto?: boolean) => void
  isAutoRun: () => boolean
  setDesc: (desc?: string) => void
  /** 获取子组件data，引擎 v1.2.69 **/
  getChildByName: (name: string) => any
}

interface UpgradeParams<T> {
  id: string
  data: T
  output: any
  input: any
  slot: any
  style: any
  setAutoRun: (auto?: boolean) => void
  isAutoRun: () => boolean
  setDeclaredStyle: (selector: string, style: React.CSSProperties) => void
  getDeclaredStyle: (selector: string) => ({selector: string, css: React.CSSProperties})
  removeDeclaredStyle: (selector: string) => void
}

type StyleModeType<T> = Partial<{
  title: string;
  initValue: CSSProperties;
  target: string | ((props: EditorResult<T>) => string) | undefined;
  domTarget: string;
  options: Array<string | { type: string; config: Record<string, any> }>;
}>;

// type T_Props = {env, data, slots, inputs}

declare interface Window {
  Babel: any
  less: any
  BricksJsSandbox: any
  jstt: {
    compile(schema: Record<string, any>, name: string, options: Record<string, any>): Promise<string>
  }
}