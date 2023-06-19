export default {
  "@init"({data, style}) {
    // style.width = '100%';
    // style.height = '100%';
    //debugger

    // setTimeout(()=>{
    //   data.content = Math.random()
    //   console.log(data.content)
    // },1000)
  },
  '@resize': {
    options: ['width', 'height'],
    value: {
      set({data}, {width, height}) {

        // console.log(height)
        // data.height = height
        // if (typeof height === 'number'&&height) {
        //   console.log(height)
        //   data.height = height
        // }
      }
    }
  },
  ":root": {
    style: [
      {
        title: '测试分类',
        //options: ['Color', 'TextAlign'],
        target({id}) {
          console.log(id)


          return ':root'
        }
      },
      {
        title: "文本2222",
        type: "text",
        value: {
          get({data}) {
            return data.content;
          },
          set({data}, value) {
            data.content = value;
          }
        },
        binding: {
          with: 'data.content',
          schema: {
            type: 'string'
          }
        }
      },
    ],
    items: [
      {
        title: "文本",
        type: "text",
        value: {
          get({data}) {
            return data.content;
          },
          set({data}, value) {
            data.content = value;
          }
        },
        binding: {
          with: 'data.content',
          schema: {
            type: 'string'
          }
        }
      },
      {
        title: "是否多行文本",
        type: "Switch",
        value: {
          get({data}) {
            return data.multiLine;
          },
          set({data}, value) {
            data.multiLine = value;
          },
        },
      },
      // {
      //   title: "样式",
      //   type: "Style",
      //   options: {
      //     plugins: ["font", "align", "border", "bgcolor"],
      //   },
      //   value: {
      //     get({data}) {
      //       return JSON.parse(JSON.stringify(data.style))
      //     },
      //     set({data, domChanged}, value: object) {
      //       data.style = {
      //         ...data.style,
      //         ...value,
      //       }
      //
      //       domChanged(); //Dom的尺寸(因为字体、行间距等因素)可能发生变化，通知设计器做变更
      //     },
      //   },
      // },
      {
        title: "单击",
        type: "_Event",
        options: {
          outputId: "click",
        },
      },
    ],
  }
};
