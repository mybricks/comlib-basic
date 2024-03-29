import { Data, InputIds } from './constants';

// TODO: 调试结束清除定时器
export default function (props: RuntimeParams<Data>) {
  const { env, data, outputs, inputs } = props;
  let timer;

  if (env?.runtime && inputs) {
    inputs[InputIds.Trigger]((val) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        outputs[InputIds.Trigger](val);
      }, data.delay);
    });
    inputs[InputIds.Cancel]?.(() => {
      clearTimeout(timer);
    });
    if(typeof env?.runtime?.onComplete === 'function'){
      env.runtime.onComplete(()=>{
        clearTimeout(timer);
      })
    }
  }
}
