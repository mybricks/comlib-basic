# JS计算组件

<div align="center">
   <img src="./icon.png"/>
</div>

> 一个JS计算组件理解为一个JS函数，提供搭建过程中必要的JS逻辑代码执行能力，旨在解决一些复杂的数据处理，逻辑运算等问题

## 使用
在逻辑卡片中**右键**或者**连线时**弹出的逻辑组件中选择**JS计算组件**。如

<div align="center">
   <img src="./use.png"/>
</div>

## 输入项
JS计算组件的输入项类比函数入参，多个输入项对应多个入参数，在代码块的inputs中获取即可。

*注意：多个输入项时，只有当每个输入项均触发执行时，JS代码块才会触发执行*
## 输出项
JS计算组件的输出项与函数的返回略有不同，组件的每个输出项通过在代码块中显示调用对应output函数触发执行。如：
```typeScript
({ outputs, inputs }) => {
  const [ inputValue0 ] = inputs;
  const [ output0, output1 ] = outputs;
  output0(inputValue0);
  output1(inputValue0);
}
```
上面的output0， output1分别触发id为output0和output1的输出项执行

<div style="color: red;font-style: italic;">在代码块中不建议用return返回或者结束后续代码执行，数据返回通过调用对应output执行即可</div>

## 代码块

一切符合JS语法规范的代码均可以在代码块区域编辑，例如访问window，获取Cookie等。并且右上角提供了代码区域放大编辑功能

注意：不建议在代码编辑区进行路由跳转操作，这样对于搭建页面调试和逻辑排查极为不友好。对于路由跳转，有专门**路由跳转**组件