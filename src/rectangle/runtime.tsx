import {useEffect} from 'react';
import css from './css.less'

export default (props) => {
  const {env, data, slots, inputs} = props;

  useEffect(() => {
    inputs['setValue']((ds) => {
      data.value = ds;
    })
  }, [])

  return (
    <div className={css.rectangle}>
      {
        data.asSlot ? (
          slots['container'].render()
        ): null
      }
    </div>
  )
}
