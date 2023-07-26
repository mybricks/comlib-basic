//import { Data, OutputIds } from './constants';

export default function ({
  input,
  output
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
  return true;
}