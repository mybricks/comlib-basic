export interface Output {
  id: string;
  key: string;
  title: string;
  schema: any;
};

export interface Input extends Output {
  rels: string[]
}

export enum CSS_LANGUAGE {
  Css = 'css',
  Less = 'less',
  Scss = 'scss'
}

export interface Data {
  props?: string;
  /** 已编译代码 */
  code: string;
  cssLan?: CSS_LANGUAGE;
  /** 已编译Css */
  css?: string;

  outputs: Output[];
  inputs: Input[];

  // events?: Array<IOEvent>;
  extraLib?: string

  
  /** 未编译代码，用于回显 */
  _code: string
  /** 未编译Less，用于回显 */
  _less?: string;
  /** 未编译Css，用于回显 */
  _css?: string;
  /** com.json 配置部分能力 */
  _JSON?: string;


  /** jsx编译错误提示 */
  _jsxErr?: string
  /** css编译错误提示 */
  _cssErr?: string
}
