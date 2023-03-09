import {useEffect} from 'react';
import css from './css.less'

export default ({env, data, slots, inputs}) => {

  useEffect(() => {
    inputs['setValue']((ds) => {
      data.value = ds
    })
  }, [])

  // const style = {}
  // if (data.style.align === 'center') {
  //   style['textAlign'] = 'center'
  // }

  return (
    <div className={css.text} style={data.style}>
      {data.content}
    </div>
  );
};
