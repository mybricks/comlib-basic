import React, { useEffect } from "react";
import css from "./css.less";

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
    <div className={css.rectangle} onClick={onClick}>
      {data.asSlot ? slots["container"].render() : null}
    </div>
  );
};
