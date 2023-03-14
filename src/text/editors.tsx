export default {
  "@init"({ style }) {
    style.width = 100;
  },
  "@resize": {
    options: ["width", "height"],
  },
  ":root": [
    {
      title: "文本",
      type: "text",
      value: {
        get({ data }) {
          return data.content;
        },
        set({ data }, value) {
          data.content = value;
        },
      },
    },
    {
      title: "是否多行文本",
      type: "Switch",
      value: {
        get({ data }) {
          return data.multiLine;
        },
        set({ data }, value) {
          data.multiLine = value;
        },
      },
    },
    {
      title: "样式",
      type: "Style",
      options: {
        plugins: ["font", "align", "border", "bgcolor"],
      },
      value: {
        get({ data }) {
          return data.style;
        },
        set({ data, domChanged }, value: object) {
          data.style = {
            ...data.style,
            ...value,
          };

          domChanged(); //Dom的尺寸(因为字体、行间距等因素)可能发生变化，通知设计器做变更
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
