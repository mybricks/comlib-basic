import React, { useEffect } from "react";
import css from "./css.less";

export default ({ env, data, slots, inputs, outputs }) => {
  const onClick = () => {
    outputs["click"]();
  };

  return (
    <div className={`${css.circle} mybricks-circle`} onClick={onClick} style={data.style}>
      <div className={`${css.text} mybricks-circle-text`}>{data.text}</div>
      {data.asSlot ? slots["container"].render() : null}
    </div>
  );
};
