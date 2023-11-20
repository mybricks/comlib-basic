import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { AlignEnum, Location, InputIds } from './constants';
import ConfigProvider from '../utils/ConfigProvider'
import { Button, Modal } from 'antd';
import * as Icons from '@ant-design/icons';

import css from './runtime.less'

export default function ({ id, env, _env, data, slots, outputs, inputs, logger }) {
  const ref = useRef<any>();
  const isMobile = env?.canvas?.type === 'mobile';

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
          const {
            title,
            id,
            type,
            visible,
            useIcon,
            location,
            icon,
            showText,
            disabled
          } = item;
          const Icon = useIcon && Icons && Icons[icon as string]?.render();
          return (
            <Button
              onClick={() => onClick(id)}
              data-handler-button={id}
              key={id}
              type={type}
              hidden={!visible}
              disabled={disabled}
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
        bodyStyle={data.bodyStyle}

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
          className={css.debugMask}
        >
          <div className={css.mask}>
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