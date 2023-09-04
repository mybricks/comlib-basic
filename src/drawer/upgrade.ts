//import { Data, OutputIds } from './constants';

export default function ({
  input,
  output,
  data
}): boolean {
  /**
   * @description 1.0.2->1.0.3  新增 outputs -> apply(应用), inputs -> title(修改标题)
   */
  const schema = {
    type: "string"
  };
  if (!input.get('title')) {
    input.add('title', '修改标题', schema)
  }

  const follwSchem = {
    type: "follow"
  }
  if (!output.get('apply')) {
    output.add('apply', '应用', follwSchem)
  }

  /**
   * @description 1.0.5->1.0.6  新增 自定义标题
   */
  if(typeof data.isTitleCustom === "undefined"){
    data.isTitleCustom = false
  }
  return true;
}