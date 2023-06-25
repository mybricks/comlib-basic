import React, {useMemo, useCallback, useRef, useEffect} from 'react';
import { AlignEnum } from './constants';
import { Button, Modal } from 'antd';

import css from './runtime.less'

export default function ({env, _env, data, slots, outputs}) {
  const ref = useRef<any>();

  const handleClose = useCallback(() => {
    _env.currentScenes.close()
  }, [])

  const handleCancel = useCallback(() => {
    outputs['cancel']()
  }, [])

  const handleOk = useCallback(() => {
    const okFn = outputs['ok']
    okFn()////TODO 获取当前连接数
  }, [])

  const renderFooter = ()=>{
    return(
      <div
        data-toolbar 
        style={{ justifyContent: data.footerLayout || AlignEnum.FlexEnd, display: 'flex' }}>
        {(data.footerBtns || []).map((item) => {
          const {
            title,
            id,
            type,
            visible
          } = item;
          return (
            <Button
              onClick={id==='cancel' ? handleCancel : handleOk}
              data-handler-button={id}
              key={id}
              type = {type}
            >
              {env.i18n(title)}
            </Button>
          );
        })}
      </div>
    )
  }

  //调试和发布态
  const debugPopup = (
    <div 
      className={css.debugMask} 
      ref={ref}>
        <Modal
        visible = {true}
        title={data.hideTitle ? undefined : env.i18n(data.title)}
        width={data.width}
        footer={data.useFooter ? renderFooter() : null}
        onCancel={handleClose}
        centered={data.centered}

        wrapClassName={css.container}
        closable={data.closable}
        getContainer={()=>{
          if(ref){
            return ref.current
          }
        }}>
        {slots['body'].render()}
        </Modal>
    </div>
  )
  //编辑态
  const editPopup = (
    <div 
      className={css.antdMask}
      ref={ref}
    >
      <Modal
        visible = {true}
        title={data.hideTitle ? undefined : env.i18n(data.title)}
        width={data.width}
        footer={data.useFooter ? renderFooter() : null}
        onCancel={handleClose}
        mask={false}
        transitionName=""

        wrapClassName={css.container}
        closable={data.closable}
        getContainer={false}>
          {slots['body'].render()}
      </Modal>
    </div>
  )

  //非编辑态
  if (!env.edit) {
    return (
      <div className={css.mask}>
        {debugPopup}
      </div>
    )
  }

  //编辑态
  return editPopup;
}