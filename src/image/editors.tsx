export default {
  "@init"({ style, data, output }) {
    style.width = 64;
    style.height = 64;
  },
  "@resize": {
    options: ["width", "height"],
  },
  ":root": [
    {
      title: "图片",
      type: "imageSelector",
      value: {
        get({ data }) {
          return data.uri;
        },
        set({ data }, v) {
          data.uri = v;
        },
      },
    },
    {
      title: "样式",
      type: "style",
      value: {
        get({ data }) {
          return data.style;
        },
        set({ data }, v) {
          data.style = v;
        },
      },
    },
  ],
};
