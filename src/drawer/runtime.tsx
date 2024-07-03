import React, { useCallback, useEffect, useRef } from 'react';
import { AlignEnum, Location, InputIds, DialogButtonProps } from './constants';
import { Button, Drawer } from 'antd';
import * as Icons from '@ant-design/icons';

import css from './runtime.less'

export default function ({ env, _env, data, slots, outputs, inputs, logger, style }) {
  const ref = useRef<any>();
  const isMobile = env?.canvas?.type === 'mobile';
  const paddingMap = {
    top: { paddingBottom: '50px' },
    bottom: { paddingTop: '50px' },
    left: { paddingRight: '50px' },
    right: { paddingLeft: '50px' }
  }

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
        style={{ justifyContent: data.footerLayout || AlignEnum.FlexEnd, display: 'flex' }}>
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

  //调试态
  const debugDrawer = (
    <div
      className={css.debugMask}
      ref={ref}>
      <Drawer
        visible={true}
        title={data.hideTitle ? undefined : (data.isTitleCustom ? slots['title']?.render() : env.i18n(data.title))}
        width={data.width || 520}
        height={isMobile ? '100%' : data.height !== 0 ? data.height : 800}
        closable={data.closable}
        //mask={false}
        footer={data.useFooter ? renderFooter() : null}
        onClose={handleClose}
        bodyStyle={data.bodyStyle}
        placement={isMobile ? 'bottom' : data.placement}
        maskClosable={data.maskClosable}
        keyboard={data.keyboard}
        getContainer={() => env?.canvasElement || document.body}
        zIndex={data.isZIndex ? data.zIndex : void 0}
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
        title={data.hideTitle ? undefined : (data.isTitleCustom ? slots['title']?.render() : env.i18n(data.title))}
        width={data.width || 520}
        height={isMobile ? '100%' : data.height !== 0 ? data.height : 800}
        closable={data.closable}
        footer={data.useFooter ? renderFooter() : null}
        onClose={handleClose}
        bodyStyle={data.bodyStyle}
        placement={isMobile ? 'bottom' : data.placement}
        maskClosable={data.maskClosable}
        keyboard={data.keyboard}
        getContainer={() => env?.canvasElement || document.body}
        zIndex={data.isZIndex ? data.zIndex : void 0}
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
      className={css.antdDrawer}
      style={paddingMap[data.placement]}
      ref={ref}
    >
      <Drawer
        visible={true}
        title={data.hideTitle ? undefined : (data.isTitleCustom ? slots['title']?.render() : env.i18n(data.title))}
        closable={data.closable}
        footer={data.useFooter ? renderFooter() : null}
        onClose={handleClose}
        mask={false}
        width={data.width || 520}
        bodyStyle={data.bodyStyle}
        maskClosable={data.maskClosable}
        //style={{ height: data.height !== 0 ? data.height : 800, width: data.width !== 0 ? data.width : 520 }}
        style={{ 
          height: ['left', 'right'].includes(data.placement) 
            ? (typeof style.height === 'number' ? style.height : data.height) 
            : (typeof style.height === 'number' ? style.height - 50 : data.height -50), 
          width: ['top', 'bottom'].includes(data.placement) 
            ? (typeof style.width === 'number' ? style.width : data.width) 
            : (typeof style.width === 'number' ? style.width - 50 : data.width -50),
        }}
        getContainer={false}
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
    return editDrawer;
  }
  //预览态 (发布态)
  return publishDrawer;
}