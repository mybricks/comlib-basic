import React, { useEffect, useRef, useState } from "react";
import css from "./runtime.less";

export default function ({ data }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} className={css.imageWrapper}>
      <img src={data.uri} />
    </div>
  );
}
