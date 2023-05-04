import { useEffect, useState } from "react";
import css from "./css.less";
import React from "react";

export default ({ env, data, slots, inputs, outputs }) => {
  const [text, setText] = useState(data.content);

  const onClick = () => {
    outputs["click"]();
  };

  useEffect(() => {
    setText(data.content);
  }, [data.content]);

  useEffect(() => {
    inputs["setContent"]((content) => {
      setText(content);
    })

    inputs['getContent']((val,relOutputs) => {
      relOutputs['return'](data.content)
    })
  }, []);

  return (
    <div
      className={`${css.text} ${
        data?.multiLine ? css.multiLineOverflow : css.singleLineOverflow
      }`}
      style={data.style}
      onClick={onClick}
    >
      {text}
    </div>
  );
};
