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
          if (value.position === "absolute") {
            slot.get("content").setLayout("absolute");
          } else if (
            value.position !== "absolute" &&
            value.display === "flex"
          ) {
            if (value.flexDirection === "row") {
              slot.get("content").setLayout("flex-row");
            } else if (value.flexDirection === "column") {
              slot.get("content").setLayout("flex-column");
            }
          }
          data.layoutStyle = value;
        },
      },
    },
    {
      title: "样式",
      type: "style",
      options: {
        plugins: ["background", "border", "padding"],
      },
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
