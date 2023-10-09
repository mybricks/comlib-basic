import { Data, DownloadType } from "./constants";

const defaultFilename = "download";
const getType = (obj) => {
  return Object.prototype.toString.call(obj).match(/\[object (.*)\]/)[1];
};
const matchFilename = (url) => {
  try {
    if (/(http|https):\/\/([\w.]+\/?)\S*/.test(url)) {
      return url.substring(url.lastIndexOf("/") + 1);
    }
  } catch (error) {
    console.error(error);
  }
};

const getBlob = (source: any, mimeType: string | undefined) => {
  console.log(source instanceof Blob);
  if (source instanceof Blob) {
    return source;
  }
  try {
    const blob = new Blob([source], {
      type: mimeType,
    });
    return blob;
  } catch (error) {
    throw error;
  }
};

const fetchBlob = async (url: string) => {
  const res = await fetch(url);
  return res.blob();
};

const download = (blob: Blob, filename: string) => {
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", blobUrl);
  link.setAttribute("download", filename);
  link.setAttribute("target", "_blank");
  link.click();
  URL.revokeObjectURL(blobUrl);
};

export default function ({ data, env, inputs, onError }: RuntimeParams<Data>) {
  const { filename, nameConfig, downloadType, saveType } = data;
  const { runtime } = env;
  if (runtime) {
    inputs.url(async (val) => {
      if (val) {
        if (downloadType === DownloadType.Local) {
          const _filename = val.filename ?? filename ?? defaultFilename;
          const blob = getBlob(val.url ?? val, saveType);
          download(blob, _filename);
          return;
        }
        if (nameConfig === 0 && getType(val) === "String") {
          const _filename = filename || matchFilename(val) || defaultFilename;
          const blob = await fetchBlob(val);
          download(blob, _filename);
        } else if (nameConfig === 1 && getType(val) === "Object") {
          const { url, filename } = val;
          const _filename = filename ?? defaultFilename;
          const blob = await fetchBlob(url);
          download(blob, _filename);
        } else {
          onError("[资源下载]：数据类型错误")
        }
      }
    });
  }
}
