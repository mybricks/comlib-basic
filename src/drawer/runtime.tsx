import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AlignEnum, Location, InputIds, DialogButtonProps } from './constants';
import { Button, Drawer } from 'antd';
import * as Icons from '@ant-design/icons';

import css from './runtime.less'

export default function ({ id, env, _env, data, slots, outputs, inputs, logger, style }) {
  const ref = useRef<any>();
  const isMobile = env?.canvas?.type === 'mobile';
  const paddingMap = {
    top: { paddingBottom: '50px' },
    bottom: { paddingTop: '50px' },
    left: { paddingRight: '50px' },
    right: { paddingLeft: '50px' }
  }

  const paddingCalc = (placement, width, height) => {
    let padding = paddingMap[placement];
    if(['left', 'right'].includes(placement) && width === '100%'){
      padding = {}
    }

    if(['top', 'bottom'].includes(placement) && height === '100%'){
      padding = {}
    }

    return padding
  }

  const [width, setWidth] = useState();
  const [height, setHeight] = useState();

  const [container, setContainer] = useState<any>(false);
  /**
   * 获取没有权限时组件要做的操作
   * 返回值如下：
   *  1. hide: 隐藏
   *  2. hintLink: 展示跳转链接
   *  3. none: 什么都不用做
   * @param id 权限ID
   * @returns 没有权限时需要做的事情吗，如果有权限返回 none
   */
  const getWhatToDoWithoutPermission = (
    permission: DialogButtonProps['permission']
  ): 'none' | 'hide' | 'hintLink' => {
    const hasPermission = !(env.runtime && permission?.id && !env?.hasPermission(permission?.id));
    if (hasPermission) return 'none';

    if (permission.registerData?.noPrivilege) {
      return permission.registerData.noPrivilege;
    }
    return 'hide';
  };


  useEffect(()=>{
    if(data.placement === "left" || data.placement === "right") {
      setWidth(typeof data.styleWidth === 'number' ? data.styleWidth - 50 : data.styleWidth);
      setHeight(data.styleHeight);
    }else{
      setHeight(typeof data.styleHeight === 'number' ? data.styleHeight - 50 : data.styleHeight);
      setWidth(data.styleWidth);
    }
  }, [data.styleHeight, data.styleWidth, data.placement])
  useEffect(() => {
    inputs['title']((val: string, relOutputs) => {
      if (typeof val !== 'string') {
        logger.error('title 必须为string类型');
      } else {
        data.title = val;
        relOutputs['setTitleDone'](val);
      }
    });
    if (env.runtime) {
      (data.footerBtns || []).forEach((item) => {
        const { id } = item;
        inputs[`${InputIds.SetDisable}_${id}`]?.(() => {
          item.disabled = true;
        });
        inputs[`${InputIds.SetEnable}_${id}`]?.(() => {
          item.disabled = false;
        });
        inputs[`${InputIds.SetHidden}_${id}`]?.(() => {
          item.visible = false;
        });
        inputs[`${InputIds.SetShow}_${id}`]?.(() => {
          item.visible = true;
        })
        inputs[`${InputIds.SetBtnOpenLoading}_${id}`]?.(() => {
          item.loading = true;
        });
        inputs[`${InputIds.SetBtnCloseLoading}_${id}`]?.(() => {
          item.loading = false;
        })
      });
    }
  }, [])

  //关闭按钮点击事件
  const handleClose = useCallback(() => {
    if (env.runtime) {
      if((data.autoClose && data.closable) || data.maskClosable){
        _env.currentScenes.close();
        outputs['close']();
      }else{
        outputs['close']();
      }
    }
  }, [])

  //取消按钮点击事件
  const handleCancel = useCallback(() => {
    if (env.runtime) {
      const index = data.footerBtns.findIndex((item) => item.id === 'cancel');
      const autoClose = data.footerBtns[index].autoClose;
      if (autoClose) {
        _env.currentScenes.close();
        outputs['cancel']();
      } else {
        outputs['cancel']()
      }
    }
  }, [])

  //确认按钮点击事件
  const handleOk = useCallback(() => {
    if (env.runtime) {
      const okFn = outputs['ok']
      okFn()////TODO 获取当前连接数
    }
  }, [])

  //普通按钮点击事件
  const handleCommon = useCallback((id) => {
    if (env.runtime) {
      outputs[id]();
    }
  }, [])

  const onClick = ((id) => {
    if (id === 'ok') {
      handleOk()
    } else if (id === 'cancel') {
      handleCancel()
    } else {
      handleCommon(id)
    }
  })

  const renderFooter = () => {
    return (
      <div
        data-toolbar
        className={isMobile ? css.mobileFooter : "toolbar"}
        style={{ justifyContent: data.footerLayout || AlignEnum.FlexEnd, display: 'flex', flexFlow: 'wrap' }}>
        {(data.footerBtns || []).map((item) => {
          const todo = getWhatToDoWithoutPermission(item.permission);
          if (todo === 'hide') return null;
          else if (todo === 'hintLink') {
            return (
              <a
                href={item.permission?.hintLink}
                target="_blank"
                style={{ textDecoration: 'underline' }}
              >
                {item.permission?.registerData?.title || '无权限'}
              </a>
            );
          }

          const {
            title,
            id,
            type,
            size,
            visible,
            useIcon,
            location,
            icon,
            showText,
            disabled,
            loading
          } = item;
          const Icon = useIcon && Icons && Icons[icon as string]?.render();
          return (
            <Button
              onClick={() => onClick(id)}
              data-handler-button={id}
              key={id}
              type={type}
              size={size}
              hidden={!visible}
              disabled={disabled}
              loading={loading}
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

  useEffect(()=>{
    if(typeof width === 'number'
        && env?.canvasElement 
        && width > env?.canvasElement.clientWidth 
        && ["left", "right"].includes(data.placement)){
      setContainer(env?.creatPortalElement || document.body)
      return
    }
    if(typeof height === 'number'
        && env?.canvasElement 
        && height > env?.canvasElement.clientHeight 
        && ["top", "bottom"].includes(data.placement)){
      setContainer(env?.creatPortalElement || document.body)
      return
    }
  },[width, height])

  //调试态
  const debugDrawer = (
    <div
      className={css.debugMask}
      ref={ref}>
      <Drawer
        visible={true}
        title={data.hideTitle ? undefined : (data.isTitleCustom ? slots['title']?.render() : env.i18n(data.title))}
        width={width || 520}
        height={isMobile ? '100%' : height || 800}
        closable={data.closable}
        //mask={false}
        footer={data.position === 'footer' && data.isShow ? renderFooter() : null}
        onClose={handleClose}
        bodyStyle={data.bodyStyle}
        placement={isMobile ? 'bottom' : data.placement}
        maskClosable={data.maskClosable}
        keyboard={data.keyboard}
        getContainer={container}
        //getContainer={() => env?.canvasElement || document.body}
        //getContainer={() => env?.creatPortalElement || document.body}
        zIndex={data.isZIndex ? data.zIndex : void 0}
        extra={data.position === 'extra' && data.isShow ? renderFooter() : null}
      >
        <div className={css.slotContainer}>
          {slots['body'].render({
            style: { overflow: 'auto' }
          })}
        </div>
      </Drawer>
    </div>
  )
  //预览和发布态
  const publishDrawer = (
    <div
      ref={ref}>
      <Drawer
        visible={true}
        className={id}
        title={data.hideTitle ? undefined : (data.isTitleCustom ? slots['title']?.render() : env.i18n(data.title))}
        width={width || 520}
        height={isMobile ? '100%' : height || 800}
        closable={data.closable}
        footer={data.position === 'footer' && data.isShow  ? renderFooter() : null}
        onClose={handleClose}
        bodyStyle={data.bodyStyle}
        placement={isMobile ? 'bottom' : data.placement}
        maskClosable={data.maskClosable}
        keyboard={data.keyboard}
        getContainer={() => env?.canvasElement || document.body}
        zIndex={data.isZIndex ? data.zIndex : void 0}
        extra={data.position === 'extra' && data.isShow ? renderFooter() : null}
      >
        <div className={css.slotContainer}>
          {slots['body'].render({
            style: { overflow: 'auto' }
          })}
        </div>
      </Drawer>
    </div>
  )

  //编辑态
  const editDrawer = (
    <div
      className={`${css.antdDrawer} 
        ${width === 'fit-content'&& ['left', 'right'].includes(data.placement) ? css.drawerWidthContent : ''}
        ${height === 'fit-content'&& ['top', 'bottom'].includes(data.placement) ? css.drawerHeightContent : ''}`
      }
      style = {paddingCalc(data.placement ,width, height)}
      ref={ref}
    >
      <Drawer
        visible={true}
        title={data.hideTitle ? undefined : (data.isTitleCustom ? slots['title']?.render() : env.i18n(data.title))}
        closable={data.closable}
        //footer={data.useFooter ? renderFooter() : null}
        footer={data.position === 'footer' && data.isShow ? renderFooter() : null}
        onClose={handleClose}
        mask={false}
        bodyStyle={data.bodyStyle}
        maskClosable={data.maskClosable}
        style={{ 
          height: ['left', 'right'].includes(data.placement) 
            ? typeof height !== 'number' ? 800 : height
            : height === '100%' ? 800 : height, 
          width: ['top', 'bottom'].includes(data.placement) 
            ? (typeof width !== 'number' ? 1024 : width) 
            : width === '100%' ? 1024 : width,
        }}
        styles={{
          content: {
            height: ['left', 'right'].includes(data.placement) 
            ? typeof height !== 'number' ? 800 : height
            : height === '100%' ? 800 : height, 
          width: ['top', 'bottom'].includes(data.placement) 
            ? (typeof width !== 'number' ? 1024 : width) 
            : width === '100%' ? 1024 : width,
          }
        }}
        getContainer={false}
        extra={data.position === 'extra' && data.isShow ? renderFooter() : null}
      >
        <div className={css.slotContainer}>
          {slots['body'].render({
            style: { overflow: 'auto' }
          })}
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
  } else if (env.edit) {
    return editDrawer
  }
  //预览态 (发布态)
  return publishDrawer;
}