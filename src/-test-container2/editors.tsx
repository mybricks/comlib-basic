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
  // '@childAdd'({data, inputs, outputs, logs, slots}, child) {
  //
  // },
  '@domainModelUpdated'(params, value) {
    const { data, getChildByName } = params;
    // console.log(params, value)
    const tt = getChildByName('u_6m5Pj')
    console.log(tt)
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
