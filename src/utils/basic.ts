export function uuid(pre: string = "u_", len = 6) {
  const seed = "abcdefhijkmnprstwxyz0123456789",
    maxPos = seed.length;
  let rtn = "";
  for (let i = 0; i < len; i++) {
    rtn += seed.charAt(Math.floor(Math.random() * maxPos));
  }
  return pre + rtn;
}

// 获取输入项序号 
/**
 * 
 * @param param0 input
 * @description 可用于新增IO-id
 * @returns 返回已有input个数
 */
export function getInputOrder({ input }) {
  const ports = input.get();
  const { id } = ports?.pop?.() || {};

  return Number(id.replace(/\D+/, "")) + 1;
}
