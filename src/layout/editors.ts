import { CSSProperties } from "react";

export default {
  "@init"({ style, data, output }) {
    style.width = 180;
    style.height = 180;
  },
  "@resize": {
    options: ["width", "height"],
  },
  ":root": [
    {
      title: "布局",
      type: "layout",
      options: [],
      value: {
        get({ data }) {
          return data.layoutStyle;
        },
        set({ data, slot }, value) {
          data.layoutStyle = value;
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
