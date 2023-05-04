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
        data.height = height
        // if (typeof height === 'number'&&height) {
        //   console.log(height)
        //   data.height = height
        // }
      }
    }
  },
  '@childAdd'({data, inputs, outputs, logs, slots}, child) {
    debugger
  },
  ":root": [
    {
      title: "文本",
      type: "text",
      value: {
        get({data}) {
          return data.content;
        },
        set({data}, value) {
          data.content = value;
        },
      },
    },
    {
      title: "单击",
      type: "_Event",
      options: {
        outputId: "click",
      },
    },
  ],
};
