import {useEffect} from 'react';
import css from './css.less'

export default ({env, data, slots, inputs}) => {
  useEffect(() => {
    inputs['setValue']((ds) => {
      data.value = ds;
    });
  }, []);

  return (
    <div className={css.listView}>
      {
        data.items.map((item, index) => {
          return slots[item.id].render()
        })
      }
    </div>
  );
};
