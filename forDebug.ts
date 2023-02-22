/**
 * MyBricks Opensource
 * https://mybricks.world
 * This source code is licensed under the MIT license.
 *
 * CheMingjun @2019
 * mybricks@126.com
 */

import layoutDef from './src/layout/com.json'
import layoutRt from './src/layout/runtime'
import layoutRtEdt from './src/layout/edit/runtime'
import layoutData from './src/layout/data.json'
import layoutEditors from './src/layout/edit/editors'


// import {T_XGraphComDef} from "@sdk";

const lib = {
  id: 'mybricks-basic-comlib',
  title: '基础组件库',
  author: 'CheMingjun',
  icon: '',
  version: '1.0.1',
  comAray: [
    merge({
      comDef: layoutDef,
      data: layoutData,
      rt: layoutRt,
      rtEdit: layoutRtEdt,
      editors: layoutEditors
    }),
  ],
  //visible: true,
  visible: true
}

export default lib

export function getCom(namespace: string) {
  return lib.comAray.find(com => com.namespace === namespace)
}

function merge({
                 comDef,
                 icon,
                 rt,
                 rtEdit,
                 data,
                 editors,
                 assistence
               }: { comDef, icon?, rt?, data?, editors?, assistence? }) {
  return Object.assign(comDef, {
    runtime: rt,
    icon: icon,
    'runtime.edit': rtEdit,
    data,
    editors,
    assistence
  })
}