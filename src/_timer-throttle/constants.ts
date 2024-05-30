export const InputIds = {
  Trigger: 'trigger',
};

export const OutputIds = {
  Trigger: 'trigger'
};

export const Schemas = {
  Any: {
    type: 'any'
  }
};

/**
 * 数据源
 * @param delay 延迟时间
 * @param leading 节流开始前执行
 * @param trailing 节流结束后执行
 */
export interface Data {
  delay: number;
  leading: boolean;
  trailing: boolean;
}