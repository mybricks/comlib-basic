import React, { useMemo, useCallback } from 'react'

import css from './runtime.less'

export default function ({
  env,
  _env,
  data,
  slots,
  outputs
}) {

  const handleClose = useCallback(() => {
    _env.currentScenes.close()
  }, [])

  const handleCancel = useCallback(() => {
    outputs['cancel']()
  }, [])

  const handleOk = useCallback(() => {
    outputs['ok']()
  }, [])

  const jsx = (
    <div className={css.popup}>
      <div className={css.content}>
        <button className={css.close} onClick={handleClose}>
          <span className={css.x}>
            <span className={css.antion}>
              <svg viewBox='64 64 896 896' focusable='false' data-icon='close' width='1em' height='1em' fill='currentColor' aria-hidden='true'><path d='M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z'></path></svg>
            </span>
          </span>
        </button>

        <div className={css.header}>
          <div className={css.title} data-title>{data.title}</div>
        </div>

        <div className={`${css.body} ${env.edit ? css.bodyEdit : ''}`}>
          {slots['body'].render()}
        </div>

        <div className={css.footer}>
          <button
            className={`${css.button} ${css.buttonDefault}`}
            data-handler-button='cancel'
            onClick={handleCancel}
          >
            <span>取消</span>  
          </button>
          <button
            className={`${css.button} ${css.buttonPrimary}`}
            data-handler-button='ok'
            onClick={handleOk}
          >
            <span>确定</span>  
          </button>
        </div>        
      </div>
    </div>
  )

  if (!env.edit) {
    return (
      <div className={css.mask}>
        {jsx}
      </div>
    )
  }

  return jsx
}

function Popup() {
  
}