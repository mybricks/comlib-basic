import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Data } from './types';
import { polyfillRuntime } from './util'

polyfillRuntime();

const ErrorStatus = ({ title = '未知错误', children = null }: { title?: string, children?: any }) => (
  <div style={{ color: 'red' }}>
    {title}
    <br />
    {children}
  </div>
);

interface CssApi {
  set: (id: string, content: string) => void
  remove: (id: string) => void
}

export default ({ data, inputs, env, outputs, logger, id }: RuntimeParams<Data>) => {
  const appendCssApi = useMemo<CssApi>(() => {
    let cssApi = {
      set: (id: string, content: string) => {
        // const el = document.getElementById(id);
        // if (el) {
        //   el.innerText = content
        //   return
        // }
        // const styleEle = document.createElement('style')
        // styleEle.id = id;
        // styleEle.innerText = content
        // document.head.appendChild(styleEle);
      },
      remove: (id: string) => {
        // const el = document.getElementById(id);
        // if (el && el.parentElement) {
        //   console.log("el.parentElement: ", el.parentElement)
        //   el.parentElement.removeChild(el)
        // }
      }
    }
    if ((env.edit || env.runtime?.debug) && env.canvas?.css) {
      // 编辑态依赖引擎注入的api
      cssApi = env.canvas.css
    } else if (!env.edit && env.runtime && !env.runtime.debug) {
      // 非引擎环境才需要set，引擎环境下在编辑时就已经通过引擎api注入了样式
      cssApi.set = (id: string, content: string) => {
        const el = document.getElementById(id);
        if (el) {
          // 只需注入一次，不会有变更（搭建时编写的less）
          return
        }
        const styleEle = document.createElement('style')
        styleEle.id = id;
        styleEle.innerText = content
        document.head.appendChild(styleEle);
      }
    }
    return cssApi
  }, [env])

  // 注入 CSS 代码
  useMemo(() => {
    if (data.css) {
      // mbcrcss = mybricks_custom_render_css缩写
      appendCssApi.set(`mbcrcss_${id}`, decodeURIComponent(data.css))
    }
  }, [data.css, appendCssApi])

  // 卸载 CSS 代码
  useEffect(() => {
    return () => {
      // mbcrcss = mybricks_custom_render缩写
      appendCssApi.remove(`mbcrcss_${id}`)
    }
  }, [])

  const errorInfo = useMemo(() => {
    if (!!data._jsxErr) {
      return {
        title: 'JSX 编译失败',
        tip: data._jsxErr
      }
    }
    if (!!data._cssErr) {
      return {
        title: 'Less 编译失败',
        tip: data._cssErr
      }
    }
  }, [data._jsxErr, data._cssErr])

  const ReactNode = useMemo(() => {
    if (errorInfo) return errorInfo.tip;

    try {
      eval(decodeURIComponent(data.code))
      const rt = window[`mbcrjsx_${id}`]
      return rt?.default;
    } catch (error) {
      return error?.toString();
    }
  }, [data.code, errorInfo]);

  const scope = useMemo(() => {
    return {
      inputs: new Proxy({}, {
        get(_, key) {
          if (env.runtime) {
            const inputId = data.inputs.find((input) => input.id === key)?.key

            if (inputId) {
              return (fn) => {
                inputs[inputId]((value, relOutputs) => {
                  fn(value, new Proxy({}, {
                    get(_, key) {
                      const outputId = data.outputs.find((input) => input.id === key)?.key || ""
                      return relOutputs[outputId]
                    }
                  }))
                })
              }
            }

            return () => {}
          }
          return () => {}
        }
      }),
      outputs: new Proxy({}, {
        get(_, key) {
          if (env.runtime) {
            const outputId = data.outputs.find((input) => input.id === key)?.key
            return outputId ? (outputs[outputId] || (() => {})) : () => {}
          }
          return () => {}
        }
      }),
      env,
      context: { React }
    }
  }, [])

  // const scope = useMemo(() => {
  //   return {
  //     inputs: new Proxy({}, {
  //       get(_, key) {
  //         if (env.runtime) {
  //           return inputs[key]
  //         }
  //         return () => {}
  //       }
  //     }),
  //     outputs: new Proxy({}, {
  //       get(_, key) {
  //         if (env.runtime) {
  //           return outputs[key]
  //         }
  //         return () => {}
  //       }
  //     }),
  //     env,
  //     context: { React }
  //   }
  // }, [])

  return (
    <>
      {typeof ReactNode === 'function' ? (
        <ReactNode {...scope} />
      ) : (
        <ErrorStatus title={errorInfo?.title}>{ReactNode}</ErrorStatus>
      )}
    </>
  )
};
