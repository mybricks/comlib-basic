import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { AlignEnum, Location, InputIds, DialogButtonProps } from './constants';
import ConfigProvider from '../utils/ConfigProvider'
import { Button, Modal } from 'antd';
import * as Icons from '@ant-design/icons';

import css from './runtime.less'

export default function ({ id, env, _env, data, slots, outputs, inputs, logger }) {
  const ref = useRef<any>();
  const isMobile = env?.canvas?.type === 'mobile';

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
    _env.currentScenes.close()
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
        width={isMobile ? '100%' : data.width}
        footer={data.useFooter ? renderFooter() : null}
        onCancel={handleClose}
        centered={data.centered}
        bodyStyle={data.bodyStyle}

        maskClosable={data.maskClosable}
        keyboard={data.keyboard}
        wrapClassName={css.container}
        closable={data.closable}
        getContainer={false}
        style={data.isCustomPosition ? {
          //调整浮层位置
          top: data.vertical === 'top' ?  data.top : 'unset',
          right: data.horizontal === 'right' ?  data.right : void 0,
          bottom: data.vertical === 'bottom' ?  data.bottom : void 0, 
          left: data.horizontal === 'left' ?  data.left : void 0,
          padding: 0,
          position: 'absolute',
        } : void 0}
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
        width={isMobile ? '100%' : data.width}
        footer={data.useFooter ? renderFooter() : null}
        onCancel={handleClose}
        centered={data.centered}
        bodyStyle={data.bodyStyle}

        maskClosable={data.maskClosable}
        keyboard={data.keyboard}
        wrapClassName={`${css.container} ${id}`}
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
        } : void 0}
        mask={data.isMask}
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
        width={isMobile ? '100%' : data.width}
        footer={data.useFooter ? renderFooter() : null}
        onCancel={handleClose}
        mask={false}
        transitionName=""
        //bodyStyle={data.bodyStyle}

        wrapClassName={css.container}
        closable={data.closable}
        getContainer={false}
      >
        {slots['body'].render()}
      </Modal>
    </ConfigProvider>
  )

  const getContent = () => {
    //调试态
    if (env.runtime && env.runtime.debug) {
      return (
        <div
          className={`${css.debugMask} ${!data.centered ? css.debugMargin : ''}`}
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
      >
        {editPopup}
      </div>
    }
    //预览态 (发布态)
    return publishPopup
  }

  return getContent()
}