export function uuid(pre = 'u_', len = 6) {
  const seed = 'abcdefhijkmnprstwxyz0123456789', maxPos = seed.length;
  let rtn = '';
  for (let i = 0; i < len; i++) {
    rtn += seed.charAt(Math.floor(Math.random() * maxPos));
  }
  return pre + rtn;
}


export function polyfillRuntime () {
  if (!window?.['react']) {
    window['react'] = window['React']
  }
}

export function safeDecodeParseJsonCode(jsonCode: string) {
  try {
    return JSON.parse(decodeURIComponent(jsonCode))
  } catch (e) {
    console.error(e);
    return null;
  }
}

// export function compareIO(previousValue, currentValue): any {
//   // const previousIdSet = new Set(previousValue.map(item => item.id));
//   // const currentIdSet = new Set(currentValue.map(item => item.id));
//
//   // const deleteIds = [...previousIdSet].filter(id => !currentIdSet.has(id));
//   // const addIdsMap = [...currentIdSet].reduce((acc: any, id: any) => {
//   //     if (!previousIdSet.has(id)) {
//   //       acc[id] = true
//   //     };
//   //     return acc;
//   // }, {});
//
//   const previousIdSet = new Set(previousValue.map(item => item.id));
//   const currentIdSet = new Set(currentValue.map(item => item.id));
//
//   const deleteIds = [...previousIdSet].filter(id => !currentIdSet.has(id));
//   const addIdsMap = [...currentIdSet].reduce((acc: any, key: any) => {
//       if (!previousIdSet.has(key)) {
//         acc[key] = true
//       };
//       return acc;
//   }, {});
//
//   return { deleteIds, addIdsMap };
// }
