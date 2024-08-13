import React, { useEffect } from "react";
import css from "./css.less";

export default ({ env, data, slots, inputs, outputs }) => {
  const onClick = () => {
    outputs["click"]();
  };

  // useEffect(() => {
  //   inputs["setValue"]((ds) => {
  //     data.value = ds;
  //   });
  // }, []);

  return (
    <div className={css.rectangle} onClick={onClick} style={{ ...(data?.style ?? {}) }}>
      <div className={`${css.innerText} mybricks-rectangle-text`} style={data.textStyle}>
        {data.text}
      </div>
      {data.asSlot ? slots["container"].render() : null}
    </div>
  );
};
