export function uuid(pre: string = 'u_', len = 6) {
  const seed = 'abcdefhijkmnprstwxyz0123456789', maxPos = seed.length;
  let rtn = '';
  for (let i = 0; i < len; i++) {
    rtn += seed.charAt(Math.floor(Math.random() * maxPos));
  }
  return pre + rtn;
}

export function unitConversion(value: string) {
  if (/^\d+(?:%)$/.test(value)) {
    return value
  } else if (/^(?:calc)/.test(value)) {
    return value
  } else if (/^\d+(?:vh)$/.test(value)) {
    return parseInt(value, 10) + 'vh'
  } else if (/^\d+(?:vw)$/.test(value)) {
    return parseInt(value, 10) + 'vw'
  } else {
    return /^\d+(?:px)?$/.test(value) ? parseInt(value, 10) + 'px' : void 0
  }
}