import React, { useEffect, useState } from "react";
import css from "./runtime.less";

export default function ({ data, inputs, outputs }: any) {
  const [src, setSrc] = useState(data.uri);

  useEffect(() => {
    setSrc(data.uri);
  }, [data.uri]);

  useEffect(() => {
    inputs["setSrc"]((src) => {
      if (!src || typeof src !== "string") return;
      setSrc(src);
    });
  }, []);

  return (
    <div className={css.imageWrapper} style={data.style}>
      <img
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
        src={src}
      />
    </div>
  );
}
