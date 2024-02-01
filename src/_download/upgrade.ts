import { Data } from "./constants";
import { setSchema } from './editors'
export default ({ input, output, data}: UpgradeParams<Data>): boolean => {
  setSchema(input, data.downloadType)

  const complete = output.get('complete')
  if(!complete) {
    output.add('complete', '完成', {type: 'any'})
    input.get('url').setRels(['complete'])
  }
  
  return true;
};
