export const Comments = `
 interface Context {
   React: React;
 }
 /**
  * @param context 注入对象（包含React，antd，icons等）
  * @param outputs 事件输出
  * @return 自定义渲染
  */
 ({ inputs, outputs, context }: Params) => {
    const { React } = context;

    const [count, setCount] = React.useState(0)

    return <div className="component" onClick={() => setCount(c => ++c)}>
      我是自定义渲染的组件，<span>我被点击了{count}次</span>
    </div>;
 }
`;

export const DefaultCode = `({ inputs, outputs, context }: Params) => {
  const { React } = context;

  const [count, setCount] = React.useState(0)

  return <div className="component" onClick={() => setCount(c => ++c)}>
    我是自定义渲染的组件，<span>我被点击了{count}次</span>
  </div>;
}`;

export const DefaultLessCode = `
.component {
  background-color: rgba(0, 0, 0, 0.04);
  color: rgba(0, 0, 0, 0.88);
  font-size: 13px;
  padding: 10px 8px;
  & span {
    font-weight: 500;
    color: #FA6400;
  }
}
`

const ReactType =  `\/\/\/ <reference types="https://unpkg.com/browse/@types/react@17.0.73/index.d.ts" />`

export const getParamsType = (propsTypeName: string = 'any') =>  `
declare interface Params = {
  inputs: Record<string, Function>;
  outputs: Record<string, Function>;
  context: {
    React: typeof React;
  };
}
`
