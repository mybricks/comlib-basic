import { Data } from './constants';

export default {
  //“any类型”
  // '@outputConnected'({ data, output }, fromPin, toPin) {
  //   //如果是“any”，schema跟着后面的schema
  //   if (fromPin.schema.type === 'any') {
  //     data.outSchema = toPin.schema;
  //     output.get('outputData').setSchema(data.outSchema);
  //   } else {
  //     //否则，schema拿到自己编辑好的
  //     data.outSchema = fromPin.schema;
  //     output.get('outputData').setSchema(data.outSchema);
  //   }
  // },
  // '@outputUpdated'({ data, input, output, slots }, pin) {
  //   //编辑区更新了，重重存储
  //   data.outSchema = pin.schema;
  // },

  //"follow类型"
  '@init': ({ data, setAutoRun, isAutoRun, output }: EditorResult<Data>) => {
    const autoRun = isAutoRun ? isAutoRun() : false;
    if (autoRun || data.runImmediate) {
      setAutoRun(true);
      data.runImmediate = true;
    }
  },
  '@outputUpdated'({ data, input, output, slots }, pin) {
    //编辑区更新了，重重存储
    data.outSchema = pin.schema;
    let oldPropertiesArr = data.properties;
    //1、首次连线时（对象和数组）
    if(oldPropertiesArr.length === 0){
      if(data.outSchema.type === 'object'){
        propUp(data, data.outSchema.properties)
      }else if(data.outSchema.type === 'array' && data.outSchema.items.type === 'object'){
        propUp(data, data.outSchema.items.properties);
      }
    //2、非首次连线时，深度比较
    }else{
      if(data.outSchema.type === 'object'){
        data.properties = propCompre(data, data.outSchema.properties)
      }else if(data.outSchema.type === 'array' && data.outSchema.items.type === 'object'){
        data.properties = propCompre(data, data.outSchema.items.properties);
      }
    }
    //加上这一句会死循环
    //output.get('outputData').setSchema(data.outSchema);
  },
  '@outputDisConnected'({ data }, fromPin, toPin) {
    data.properties = [];
  },
  ':root': [
    {
      title: '数组长度',
      type: 'inputnumber',
      options: [{ min: 1, max: 100, width: 60 }],
      value: {
        get({ data }: EditorResult<Data>) {
          return [data.arrLength];
        },
        set({ data }: EditorResult<Data>, value: number) {
          data.arrLength = value[0];
        }
      }
    },
    {
      title: '字符串长度',
      type: 'inputnumber',
      options: [{ min: 1, max: 20, width: 60 }],
      value: {
        get({ data }: EditorResult<Data>) {
          return [data.strLength];
        },
        set({ data }: EditorResult<Data>, value: number) {
          data.strLength = value[0];
        }
      }
    },
    {
      title: '随机数范围',
      type: 'InputNumber',
      options: [
        { title: '最小', min: 0, width: 100 },
        { title: '最大', max: 999999, width: 100 }
      ],
      value: {
        get({ data }: EditorResult<Data>) {
          return data.numberRange || [0, 100];
        },
        set({ data }: EditorResult<Data>, value: [number, number]) {
          data.numberRange = value;
        }
      }
    },
    {},
    {
      title: '字段配置',
      description: '目标组件数据结构为对象和数组（子项为对象）配置',
      ifVisible({ data }: EditorResult<Data>) {
        return data.properties.length > 0;
      },
      type: 'array',
      options: {
        deletable: false,
        addable: false,
        getTitle: ({ title, type, key }) => {
          return `${key}(${schemaMap[type]})`;
        },
        items: [
          {
            title: '数组长度',
            type: 'Text',
            ifVisible(item) {
              return item.type === 'array';
            },
            options: {
              type: 'number'
            },
            value: 'arrLen'
          },
          {
            title: '字符串长度',
            type: 'Text',
            ifVisible(item) {
              return item.type === 'string';
            },
            options: {
              type: 'number'
            },
            value: 'strLen'
          },
          {
            title: '最大值',
            type: 'Text',
            ifVisible(item) {
              return item.type === 'number';
            },
            options: {
              type: 'number'
            },
            value: 'maxNum'
          },
          {
            title: '最小值',
            type: 'Text',
            ifVisible(item) {
              return item.type === 'number';
            },
            options: {
              type: 'number'
            },
            value: 'minNum'
          },
          {
            title: '布尔值',
            type: 'select',
            ifVisible(item) {
              return item.type === 'boolean';
            },
            options: [
              { label: '随机', value: 'random' },
              { label: 'True', value: true },
              { label: 'False', value: false },
            ],
            value: 'booleanType'
          }
        ]
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          let newProperties = propertiesTransFun(data.properties);
          return newProperties;
        },
        set({ data, focusArea }: EditorResult<Data>, value) {
          data.properties = value;
      }
    }
  }
  ]
};

const propertiesTransFun = ((val)=>{
  let newroperties = val.map((item)=>{
    return {
      ...item,
      strLen: item.strLen ? item.strLen : 6,
      arrLen: item.arrLen ? item.arrLen : 10,
      maxNum: item.maxNum ? item.maxNum : 100,
      minNum: item.minNum ? item.minNum : 0,
      booleanType: item.booleanType ? item.booleanType : 'random' 
    }
  })
  return newroperties;
})

const schemaMap = {
  'any': '任意',
  'number': '数字',
  'string': '字符',
  'boolean': '布尔',
  'object': '对象',
  'array': '数组',
  'indexObject': '索引对象',
  'tuple': '元组',
  'enum': '枚举'
}

const propCompre = ((data, properties)=>{
  let keys = Object.keys(properties);
  let oldKeys = data.properties.map((item)=>{
    return item.key
  });
  let newPropertiesArr =  Object.values(properties).map((item: any, index)=>{
    return {
      ...item,
      key: keys[index]
    }
  });
  let lastProArr = newPropertiesArr.map((item: any, index)=>{
    if(oldKeys.indexOf(item.key) !== -1){
      return data.properties[oldKeys.indexOf(item.key)]
    }else{
      return {
        ...item,
        key: keys[index]
      }
    }
  });
  return lastProArr;
})

const propUp = ((data, properties)=>{
  let keys = Object.keys(properties);
    if(keys.length > 0){
      data.properties =  Object.values(properties).map((item: any, index)=>{
        return {
          ...item,
          key: keys[index]
        }
      });
    }
})