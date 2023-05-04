import { useEffect, useState } from "react";
import css from "./css.less";
import React from "react";

export default ({ env, data, slots, inputs, outputs }) => {
  return (
    <div style={{height:300,border:'1px solid red'}}>
      <div style={{height:'100%'}}>
        {slots['test'].render()}
      </div>
    </div>
  );
};
