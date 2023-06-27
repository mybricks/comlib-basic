import {useEffect, useState} from "react";
import css from "./css.less";
import React from "react";

export default ({env, data, slots, inputs, outputs}) => {
  return (
    <div className={css.view}>
      <div style={{height: '100%'}}>
        {slots['test'].render({
          wrap(comAry: { id, name, jsx, def, inputs, outputs }) {
            if (comAry && comAry.length > 0) {
              const com0 = comAry[0]

              if (env.runtime) {
                com0.outputs.click.getConnections()
              }


              return (
                <div>
                  {com0.jsx}
                </div>
              )
            }
          }, outputs: {
            click(val) {
              debugger
            }
          }
        })}
      </div>
    </div>
  );
};
