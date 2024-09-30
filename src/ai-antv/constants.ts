export const DefaultCode = `import { useState, useEffect } from 'react';
import css from 'index.less';

export default ({ inputs, outputs }) => {
  return (
    <div className={css.component}>
      我是基于Ant Design的智能组件，开始和我对话吧
    </div>
  );
}`;

export const DefaultLessCode = `
.component {
  height: 100%;
  width: 100%;
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

export const DefaultJSONCode = `{
  "inputs": [
    {
      "id": "setTitle",
      "title": "设置标题",
      "schema": {
        "type": "string"
      },
      "rels": [
        "setTitleDone"
      ]
    }
  ],
  "outputs": [
    {
      "id": "click",
      "title": "单击",
      "schema": {
        "type": "string"
      }
    },
    {
      "id": "setTitleDone",
      "title": "设置标题完成",
      "schema": {
        "type": "string"
      }
    }
  ]
}
`

const ReactType =  `\/\/\/ <reference types="https://unpkg.com/browse/@types/react@17.0.73/index.d.ts" />`

export const getParamsType = (propsTypeName: string = 'any') =>  `
declare interface Params {
  inputs: Record<string, Function>;
  outputs: Record<string, Function>;
  context: {
    React: typeof React;
  };
}
`
