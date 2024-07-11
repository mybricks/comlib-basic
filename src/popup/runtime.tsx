import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { AlignEnum, Location, InputIds, DialogButtonProps } from './constants';
import ConfigProvider from '../utils/ConfigProvider'
import { Button, Modal } from 'antd';
import * as Icons from '@ant-design/icons';

import css from './runtime.less'

export default function ({ id, env, _env, data, slots, outputs, inputs, logger, style }) {
  const ref = useRef<any>();
  const isMobile = env?.canvas?.type === 'mobile';
  
  const [width, setWidth] = useState();
  const [height, setHeight] = useState();

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

  useEffect(() => {
    inputs['title']((val: string) => {
      if (typeof val !== 'string') {
        logger.error('title 必须为string类型');
      } else {
        data.title = val;
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

  useEffect(()=>{
    setWidth(typeof data.styleWidth === 'number' ? data.styleWidth - 100 : data.styleWidth);
    setHeight(typeof data.styleHeight=== 'number' ? data.styleHeight - 100 : data.styleHeight)
  },[data.styleWidth, data.styleHeight])

  //点击关闭按钮、蒙层，关闭对话框事件
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
        style={{ justifyContent: data.footerLayout || AlignEnum.FlexEnd, display: 'flex' }}>
        {(data.footerBtns || []).map((item) => {
          const todo = getWhatToDoWithoutPermission(item.permission);
          if(todo === 'hide') return null;
          else if(todo === 'hintLink') {
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
  const debugPopup = (
    <ConfigProvider locale={env.vars?.locale}>
      <Modal
        visible={true}
        title={data.hideTitle ? undefined : (data.isTitleCustom ? slots['title']?.render() : env.i18n(data.title))}
        width={isMobile ? '100%' : width}
        footer={data.useFooter ? renderFooter() : null}
        onCancel={handleClose}
        centered={data.centered}
        bodyStyle={data.bodyStyle}

        maskClosable={data.maskClosable}
        keyboard={data.keyboard}
        //wrapClassName={css.container}
        wrapClassName={`${css.editContainer} ${style.height === '100%' ? css.publishHeightContainer : ''}`}
        closable={data.closable}
        //getContainer={() => env?.canvasElement || document.body}
        getContainer={() => env?.creatPortalElement || document.body}
        style={data.isCustomPosition ? {
          //调整浮层位置
          top: data.vertical === 'top' ?  data.top : 'unset',
          right: data.horizontal === 'right' ?  data.right : void 0,
          bottom: data.vertical === 'bottom' ?  data.bottom : void 0, 
          left: data.horizontal === 'left' ?  data.left : void 0,
          padding: 0,
          position: 'absolute',
          height: height
        } : {
          height: height,  
          //height: 400,
          top: height=== '100%' ? 0 : void 0
        }}
        zIndex={data.isZIndex ? data.zIndex: void 0}
      >
        {slots['body'].render()}
      </Modal>
    </ConfigProvider>
  )
  //预览态（发布态）
  const publishPopup = (
    <ConfigProvider locale={env.vars?.locale}>
      <Modal
        visible={true}
        title={data.hideTitle ? undefined : (data.isTitleCustom ? slots['title']?.render() : env.i18n(data.title))}
        width={isMobile ? '100%' : width}
        footer={data.useFooter ? renderFooter() : null}
        onCancel={handleClose}
        centered={data.centered}
        bodyStyle={data.bodyStyle}

        maskClosable={data.maskClosable}
        keyboard={data.keyboard}
        //wrapClassName={`${css.container} ${id}`}
        wrapClassName={`${css.publishContainer} ${id} ${style.height === '100%' ? css.publishHeightContainer : ''}`}
        closable={data.closable}
        getContainer={() => env?.canvasElement || document.body}
        style={data.isCustomPosition ? {
          //调整浮层位置
          top: data.vertical === 'top' ?  data.top : 'unset',
          right: data.horizontal === 'right' ?  data.right : void 0,
          bottom: data.vertical === 'bottom' ?  data.bottom : void 0, 
          left: data.horizontal === 'left' ?  data.left : void 0,
          padding: 0,
          position: 'absolute',
        } : {
          height: height,
          top: height === '100%' ? 0 : void 0
        }}
        mask={data.isMask}
        zIndex={data.isZIndex ? data.zIndex: void 0}
      >
        {slots['body'].render()}
      </Modal>
    </ConfigProvider>
  )

  //编辑态
  const editPopup = (
    <ConfigProvider locale={env.vars?.locale}>
      <Modal
        visible={true}
        title={data.hideTitle ? undefined : (data.isTitleCustom ? slots['title']?.render() : env.i18n(data.title))}
        width={isMobile ? '100%' : (width === '100%' ? 1024 : width)}
        footer={data.useFooter ? renderFooter() : null}
        onCancel={handleClose}
        mask={false}
        transitionName=""
        //bodyStyle={data.bodyStyle}
        style={{
          height: height !== '100%' ? height : 800
        }}
        wrapClassName={css.editContainer}
        closable={data.closable}
        getContainer={false}
      >
        {slots['body'].render({
          style: {
            overflow: 'auto'
          }
        })}
      </Modal>
    </ConfigProvider>
  )


  const paddingCalc = (height, width)=>{
    if(height === '100%' && width === '100%'){
      return {
        padding: 0
      }
    }else{
      if(height === '100%'){
        return {
          padding: '0 50px'
        }
      }else if(width === '100%'){
        return {
          padding: '50px 0'
        }
      }else{
        return {}
      }
    }
  }
  const getContent = () => {
    //调试态
    if (env.runtime && env.runtime.debug) {
      return (
        <div
          className={`${css.debugMask} ${!data.centered && style.height!=='100%' ? css.debugMargin : ''}`}
        >
          <div className={`${css.mask} ${data.isMask ? '' : css.hideMask}`}>
            {debugPopup}
          </div>
        </div>
      )
      //编辑态
    } else if (env.edit) {
      return <div
        className={css.antdMask}
        style={paddingCalc(style.height, style.width)}
      >
        {editPopup}
      </div>
    }
    //预览态 (发布态)
    return publishPopup
  }

  return getContent()
}