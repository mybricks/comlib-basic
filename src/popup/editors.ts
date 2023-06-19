import { isEmptyString, uuid } from './utils';
import { DefaultEvent, AlignEnum, Data, DialogButtonProps } from './constants';

function findConfig({ data, focusArea }, propKey?: string) {
  if (!focusArea) return;
  const id = focusArea.dataset['handlerButton'];
  const index = data.footerBtns.findIndex((item) => item.id === id);
  if (index === -1) return;
  if (typeof propKey === 'string') {
    return data.footerBtns[index][propKey];
  }
  return data.footerBtns[index];
}

/**
 * 删除/隐藏按钮
 * @param env 上下文 
 * @param btnId 确认/取消按钮的默认ID
 */
function removeBtn({ data, input, output, slot }:
  { data: Data, input: any, output: any, slot: any },
  btnId: string
) {
  const index = data.footerBtns?.findIndex(btn => btn.id === btnId);
  output.remove(btnId);
  if (!DefaultEvent.includes(btnId)) {
    data.footerBtns.splice(index, 1);
  }
}

//新增按钮操作
function addBtn({ data, input, output, slot }: { data: Data, input: any, output: any, slot: any }, defaultId?: string) {
  const { footerBtns } = data;
  const titleMap = {
    [DefaultEvent[0]]: '确认',
    [DefaultEvent[1]]: '取消',
  }
  const id = defaultId || uuid(),
    title = defaultId ? titleMap[defaultId] : `按钮${footerBtns.length + 1}`;
  const schema = {
    type: 'any'
  };

  const defaultBtn: DialogButtonProps = {
    id,
    title,
    icon: '',
    dynamicHidden: true,
    dynamicDisabled: true,
    visible: true,
    autoClose: true,
    useIcon: false,
    showText: true,
    type: 'default',
    isConnected: false
  };
  
  output.add(`点击${id}`, `点击${title}`, schema);
  output.add(id, title, schema);
  //slot.get(SlotIds.Container).inputs.add(id, `${title}`, { type: 'any' });
  //slot.get('body').outputs.add(id, `${title}`, { type: 'follow' });

  if (!DefaultEvent.includes(id)) {
    data.footerBtns.unshift(defaultBtn);
  }
}

export default {
  '@init'({style}) {
    style.width = '100%'
    style.height = '100%'
  },
  ':root': {
    style: [
      {
        title: '弹窗宽度',
        description: '设置0将使用默认宽度：520',
        type: 'Slider',
        options: {
          max: 5000,
          min: 0,
          step: 100,
          formatter: 'px'
        },
        value: {
          get({ data }) {
            return data.width;
          },
          set({ data }, value: number) {
            data.width = value || undefined;
          }
        }
      },
      // {
      //   title: '内容高度限制',
      //   description: '设置0为不限制，超出高度限制出现滚动条',
      //   type: 'Slider',
      //   options: {
      //     max: 5000,
      //     min: 0,
      //     step: 100,
      //     formatter: 'px'
      //   },
      //   value: {
      //     get({ data }) {
      //       return data.bodyStyle?.maxHeight;
      //     },
      //     set({ data }, value: string) {
      //       if (!data.bodyStyle) {
      //         data.bodyStyle = {};
      //       }
      //       data.bodyStyle = {
      //         ...data.bodyStyle,
      //         maxHeight: value || undefined
      //       };
      //     }
      //   }
      // },
      // {
      //   title: '内容背景色',
      //   type: 'colorpicker',
      //   value: {
      //     get({ data }) {
      //       return data.bodyStyle?.backgroundColor;
      //     },
      //     set({ data }, value: string) {
      //       if (!data.bodyStyle) {
      //         data.bodyStyle = {};
      //       }
      //       data.bodyStyle = {
      //         ...data.bodyStyle,
      //         backgroundColor: value
      //       };
      //     }
      //   }
      // }
    ],
    items: ({}, cate1, cate2) => {
      cate1.title = '常规';
      cate1.items = [
        {
          title: '标题',
          type: 'Text',
          value: {
            get({ data }) {
              return data.title;
            },
            set({ data }, value: string) {
              if (isEmptyString(value)) {
                data.title = value;
              }
            }
          }
        },
        {
          title: '隐藏标题',
          type: 'Switch',
          value: {
            get({ data }) {
              return data.hideTitle;
            },
            set({ data }, value: boolean) {
              data.hideTitle = value;
            }
          }
        },
        {
          title: '关闭按钮',
          type: 'Switch',
          value: {
            get({ data }) {
              return data.closable;
            },
            set({ data }, value: boolean) {
              data.closable = value;
            }
          }
        },
        {
          title: '垂直居中',
          type: 'Switch',
          value: {
            get({ data }) {
              return data.centered;
            },
            set({ data }, value: boolean) {
              data.centered = value;
            }
          },
        },
        {
          title: '工具条',
          items: [
            {
              title: '显示',
              type: 'switch',
              value: {
                get({ data }) {
                  return data.useFooter;
                },
                set({ data }, value: boolean) {
                  data.useFooter = value;
                }
              }
            },
            // {
            //   title: '新增操作',
            //   ifVisible({ data }) {
            //     return (
            //       !!data.footerBtns &&
            //       data.useFooter
            //     );
            //   },
            //   type: 'Button',
            //   value: {
            //     set({ data, input, output, slot }) {
            //       addBtn({ data, input, output, slot });
            //     }
            //   }
            // }
          ]
        }
      ];
    }
  },
  '.ant-modal-title': {
    title: '标题',
    items: [
      {
        title: '内容',
        type: 'text',
        value: {
          get({data}) {
            return data.title
          },
          set({data}, title) {
            data.title = title
          }
        }
      }
    ]
  },
  '.ant-modal-close': {
    title: '关闭按钮',
    items: [
      {
        title: '显示',
        type: 'Switch',
        value: {
          get({ data }) {
            return data.closable;
          },
          set({ data }, value: boolean) {
            data.closable = value;
          }
        }
      }
    ]
  },
  '[data-toolbar]': {
    title: '工具条',
    items: [
      {
        title: '显示',
        type: 'Switch',
        value: {
          get({ data }) {
            return data.useFooter;
          },
          set({ data }, value: boolean) {
            data.useFooter = value;
          }
        }
      },
      {
        title: '对齐方式',
        type: 'Select',
        options: [
          { value: AlignEnum.FlexStart, label: '居左' },
          { value: AlignEnum.Center, label: '居中' },
          { value: AlignEnum.FlexEnd, label: '居右' }
        ],
        value: {
          get({ data }) {
            return data.footerLayout;
          },
          set({ data }, value: AlignEnum) {
            data.footerLayout = value;
          }
        }
      }
      // {
      //   title: '新增操作',
      //   ifVisible({ data }) {
      //     return !!data.footerBtns;
      //   },
      //   type: 'Button',
      //   value: {
      //     set({ data, input, output, slot }) {
      //       addBtn({ data, input, output, slot });
      //     }
      //   }
      // }
    ]
  },
  '[data-handler-button]': {
    title: '按钮',
    items: [
      {
        title: '名称',
        type: 'Text',
        value: {
          get({ data, focusArea }) {
            return findConfig({ data, focusArea }, 'title')
          },
          set({ data, focusArea }, value: string) {
            findConfig({ data, focusArea }).title = value;
          }
        }
      },
      {
        title: '点击',
        type: '_event',
        options({data, focusArea}) {
          return {
            outputId: findConfig({ data, focusArea }, 'id')
          }
        }
      }
    ]
  }
}