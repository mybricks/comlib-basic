import { ShapeProps, ShapeType, rotateTriangle } from './constants';

export default {
  '@init'({ style }) {
    style.width = 20;
    style.height = 20;
  },
  '@resize': {
    options: ['width', 'height']
  },
  ':root': {
    style: [
      {
        title: '形状',
        type: 'style',
        options: ['background'],
        target: '[data-item-type="shape"]',
        domTarget: '[data-item-type="shape"]'
      },
      {
        title: '内容',
        type: 'style',
        options: ['padding'],
        initValue: { },
        target: '[data-item-type="wrapper"]',
        domTarget: '[data-item-type="wrapper"]'
      },
      {
        title: '顶点位置',
        type: 'Select',
        options: [
          { label: '上', value: 0 },
          { label: '右', value: 90 },
          { label: '下', value: 180 },
          { label: '左', value: 270 }
        ],
        ifVisible({ data }) { // 编辑项显示的条件
          return data.type !== 'circle' && data.type !== 'rectangle';
        },
        value: {
          get({ data }: EditorResult<ShapeProps>) {
            return data.position || 0;
          },
          set({ data }: EditorResult<ShapeProps>, value: number) {
            data.clipPath = rotateTriangle(value) || "polygon(50% 0%, 0% 100%, 100% 100%)";
          }
        }
      },
    ],
    items: [
      {
        title: '形状',
        type: 'Select',
        options: [
          { value: 'circle', label: '圆或椭圆' },
          { value: 'rectangle', label: '矩形' },
          { value: 'triangle', label: '三角形' }
        ],
        value: {
          get({ data }: EditorResult<ShapeProps>) {
            return data.type;
          },
          set({ data }: EditorResult<ShapeProps>, value: ShapeType) {
            data.type = value;
          }
        }
      },
    ]
  }
};
