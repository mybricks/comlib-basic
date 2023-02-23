import React from "react";
import css from "./runtime.less";

export default function ({ data, style, slots }) {
  return (
    <div className={css.layout} style={data.style}>
      {slots["content"].render({ style: data.layoutStyle })}
    </div>
  );
}
