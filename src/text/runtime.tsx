import { useEffect } from "react";
import css from "./css.less";
import React from "react";

export default ({ env, data, slots, inputs, outputs }) => {
  const onClick = () => {
    outputs["click"]();
  };

  useEffect(() => {
    inputs["setValue"]((ds) => {
      data.value = ds;
    });
  }, []);

  return (
    <div className={css.text} style={data.style} onClick={onClick}>
      {data.content}
    </div>
  );
};
