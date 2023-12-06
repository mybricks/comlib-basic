export default function ({
  input,
  output,
  data,
}): boolean {
  /**
   * @description 1.0.0->1.0.1  新增 properties
  */
  if(typeof data.properties === 'undefined'){
    data.properties = [];
  }

  return true;
}