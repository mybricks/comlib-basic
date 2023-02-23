import React from "react";
import css from "./runtime.less";

export default function ({ data }: any) {
  return (
    <div className={css.imageWrapper} style={data.style}>
      <img
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
        src={data.uri}
      />
    </div>
  );
}
