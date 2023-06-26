import React, { useCallback, useRef} from 'react';
import { AlignEnum, Location } from './constants';
import { Button, Modal } from 'antd';
import * as Icons from '@ant-design/icons';

import css from './runtime.less'

export default function ({env, _env, data, slots, outputs}) {
  const ref = useRef<any>();

  //关闭按钮点击事件
  const handleClose = useCallback(() => {
    _env.currentScenes.close()
  }, [])

  //取消按钮点击事件
  const handleCancel = useCallback(() => {
    if(env.runtime){
      const index = data.footerBtns.findIndex((item) => item.id === 'cancel');
      const autoClose = data.footerBtns[index].autoClose;
      if(autoClose){
        _env.currentScenes.close()
      }else{
        outputs['cancel']()
      }
    }
  }, [])

  //确认按钮点击事件
  const handleOk = useCallback(() => {
    if(env.runtime){
      const okFn = outputs['ok']
      okFn()////TODO 获取当前连接数
    }
  }, [])

  //普通按钮点击事件
  const handleCommon = useCallback((id)=>{
    if (env.runtime) {
      outputs[id]();
    }
  },[])

  const onClick = ((id)=>{
    if(id==='ok'){
      handleOk()
    }else if(id==='cancel'){
      handleCancel()
    }else{
      handleCommon(id)
    }
  })

  const renderFooter = ()=>{
    return(
      <div
        data-toolbar 
        className="toolbar"
        style={{ justifyContent: data.footerLayout || AlignEnum.FlexEnd, display: 'flex' }}>
        {(data.footerBtns || []).map((item) => {
          const {
            title,
            id,
            type,
            visible,
            useIcon,
            location,
            icon,
            showText
          } = item;
          const Icon = useIcon && Icons && Icons[icon as string]?.render();
          return (
            <Button
              onClick={() => onClick(id)}
              data-handler-button={id}
              key={id}
              type = {type}
              hidden={!visible}
            >
              {useIcon && location !== Location.BACK && Icon}
              {showText && env.i18n(title)}
              {useIcon && location === Location.BACK && Icon}
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
        bodyStyle={data.bodyStyle}

        maskClosable={data.maskClosable}
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
        bodyStyle={data.bodyStyle}

        wrapClassName={css.container}
        closable={data.closable}
        getContainer={false}>
          {slots['body'].render()}
      </Modal>
    </div>
  )

  //调试和发布态
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