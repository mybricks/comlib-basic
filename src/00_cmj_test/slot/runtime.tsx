import React, {useEffect, ReactNode, useState} from 'react';

export default function ({env, inputs, data, logger, slots, style}) {
console.log(Math.random())

  //console.log(env.canvas.isValid('u_swBJH'))

  return (
    <div style={{border:'2px solid #DDD',padding:100}}>
      {slots.content.render()}
    </div>
  )
}
