import React, { useCallback, useRef} from 'react';
import { AlignEnum, Location } from './constants';
import { Button, Drawer } from 'antd';
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
        _env.currentScenes.close();
        outputs['cancel']();
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
        className={css.toolbar}
        style={{ justifyContent: data.footerLayout || AlignEnum.FlexEnd }}>
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
              className={css['footer-btns']}
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

  //调试态
  const debugDrawer = (
    <div 
      className={css.debugMask} 
      ref={ref}>
        <Drawer
          visible = {true}
          title={data.hideTitle ? undefined : env.i18n(data.title)}
          width={data.width !== 0 ? data.width : 520}
          height={data.height !== 0 ? data.height : 800}
          closable={data.closable}
          footer={data.useFooter ? renderFooter() : null}
          onClose={handleClose}
          mask={false}
          bodyStyle={data.bodyStyle}
          placement={data.placement}
          maskClosable={data.maskClosable}
          getContainer={false}
        >
        <div className={css.slotContainer}>
          {slots['body'].render()}
        </div>
        </Drawer>
    </div>
  )
  //预览和发布态
  const publishDrawer = (
    <div 
      ref={ref}>
        <Drawer
          visible = {true}
          title={data.hideTitle ? undefined : env.i18n(data.title)}
          width={data.width !== 0 ? data.width : 520}
          height={data.height !== 0 ? data.height : 800}
          closable={data.closable}
          footer={data.useFooter ? renderFooter() : null}
          onClose={handleClose}
          mask={false}
          bodyStyle={data.bodyStyle}
          placement={data.placement}
          maskClosable={data.maskClosable}
          getContainer={false}
        >
        <div className={css.slotContainer}>
          {slots['body'].render()}
        </div>
        </Drawer>
    </div>
  )
  //编辑态
  const editDrawer = (
    <div 
      className={css.antdDrawer}
      ref={ref}
    >
      <Drawer
      visible = {true}
      title={data.hideTitle ? undefined : env.i18n(data.title)}
      closable={data.closable}
      footer={data.useFooter ? renderFooter() : null}
      onClose={handleClose}
      mask={false}
      bodyStyle={data.bodyStyle}
      maskClosable={data.maskClosable}
      style={{height: data.height !== 0 ? data.height : 800, width: data.width !== 0 ? data.width : 520}}
      getContainer={false}
    >
      <div className={css.slotContainer}>
        {slots['body'].render()}
      </div>
    </Drawer>
    </div>
  )
  
  //调试态
  if (env.runtime && env.runtime.debug) {
    return (
      <div className={css.mask}>
        {debugDrawer}
      </div>
    )
  //编辑态
  }else if(env.edit){
    return editDrawer;
  }
  //预览态 (发布态)
  return publishDrawer;
}