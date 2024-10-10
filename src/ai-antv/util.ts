import { loadExternalAssetsDeps } from './../utils/ai-code/helper'

export function uuid(pre = 'u_', len = 6) {
  const seed = 'abcdefhijkmnprstwxyz0123456789', maxPos = seed.length;
  let rtn = '';
  for (let i = 0; i < len; i++) {
    rtn += seed.charAt(Math.floor(Math.random() * maxPos));
  }
  return pre + rtn;
}


export async function polyfillChartsRuntime () {
  if (!window?.['react']) {
    window['react'] = window['React']
  }

  await loadExternalAssetsDeps([
    {
      name: 'Charts',
      deps: [
        {
          tag: 'script',
          url: 'https://assets.mybricks.world/mybricks_material_externals/ant-design-charts@1.3.5.min.js',
          library: 'Charts',
          fallbackUrls: [
            '/mfs/mybricks_material_externals/ant-design-charts@1.3.5.min.js'
          ]
        }
      ]
    }
  ]);

  if (!window?.['charts']) {
    window['charts'] = window['Charts']
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
