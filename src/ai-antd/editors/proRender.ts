import {transformTsx} from "../transform";
import {uuid} from "../util";

import LibsReg from './libs'

// setTimeout(v=>{
//   requireFromCdn('browser-es-module-loader/dist/babel-browser-build.js', (module) => {
//
//   })
// },2000)

const loadedLibs = {}

export default function proRender({id, data}, renderCode) {
  const setRender = () => {
    transformTsx(renderCode, {id}).then(code => {
      //debugger

      data._renderCode = code;
      data._jsxErr = ''
    }).catch(e => {
      //debugger

      data._jsxErr = e?.message ?? '未知错误'
    })
  }

  const importRegex = /import\s+((?:[\s\S]*?))\s+from(\s+)?['"]([^'"]+)['"]/g;

  const loadLibs = []

  renderCode = renderCode.replace(importRegex, (match, vars, oo, npm) => {
    const un = npm.toUpperCase()
    if (un !== 'REACT' && un !== 'INDEX.LESS' && un !== 'ANTD') {
      //debugger
      const lib = LibsReg.find(lib => lib.title.toUpperCase() === un)
      if (lib) {
        loadLibs.push(lib)
        return `const ${vars} = ${lib.moduleDef}`
      } else {

      }
    }

    return match
  })

  //console.log('renderCode:::', renderCode)

  // if (loadLibs.length > 0) {////TODO
  //   loadLibs.forEach(lib => {
  //     if (lib.js) {
  //       requireFromCdn(lib.js).then(()=>{
  //         setRender()
  //       })
  //
  //       //
  //     }
  //
  //   })
  // } else {
  setRender()
  //}
}

async function requireFromCdn(url) {
  // const uid = uuid()
  //
  // let tempFns = window['_tempFns_']
  // if (!tempFns) {
  //   tempFns = window['_tempFns_'] = {}
  // }
  //
  // tempFns[uid] = callback
  //const cdnUrl = `http://unpkg.com/${npmName}`

  return new Promise((resolve, reject) => {
    if (loadedLibs[url]) {
      resolve()
      return
    }

    loadedLibs[url] = true

    const el = document.createElement('script');
    el.src = url
    //el.type = 'module'
    //el.async = false
    document.body.appendChild(el)

    // el.text = `
    //   import('${cdnUrl}').then(function(){
    //         debugger
    //
    //
    //   console.log(':::::::',module)
    //   window['_tempFns_']['${uid}'](module)
    //   })
    // `
    //
    // el.text = `
    //   const * as tt from import('${cdnUrl}').then(function(){
    //         debugger
    //
    //
    //   console.log(':::::::',arguments)
    //   window['_tempFns_']['${uid}'](module)
    //   })
    // `

    el.onload = function (args) {
      //debugger
      resolve()
      //console.log(arguments)
      //window['_tempFns_'][`${uid}`]()
      // debugger
      // resolve(true)
    }

    el.onerror = () => {
      reject(new Error(`加载${url}失败`))
    }
  })
}

function loadNpm(npmName) {

}