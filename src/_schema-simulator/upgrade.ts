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

  /**
   * @description 1.0.1->1.0.2  新增 runImmediate
  */
  if(typeof data.runImmediate === 'undefined'){
    if(input.get('mockTouch') === undefined){
      data.runImmediate = true;
    }else{
      data.runImmediate = false;
    }
  }
  return true;
}