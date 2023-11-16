import { Data, DownloadType } from "./constants";

const defaultFilename = "download";

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

export default function ({
  data,
  env,
  inputs,
  onError,
  logger,
}: RuntimeParams<Data>) {
  const { filename, downloadType, saveType } = data;
  const { runtime } = env;
  if (runtime) {
    inputs.url(async (val) => {
      if (val) {
        try {
          if (downloadType === DownloadType.Local) {
            const _filename = val.filename ?? env.i18n(filename) ?? defaultFilename;
            const blob = getBlob(val.url ?? val, saveType);
            download(blob, _filename);
            return;
          }
          const url = new URL(val.url ?? val);
          const blob = await fetchBlob(url.href);
          const _filename =
            val.filename ??
            matchFilename(url.href) ??
            env.i18n(filename) ??
            defaultFilename;
          download(blob, _filename);
        } catch (error) {
          logger.error("[资源下载]：数据类型错误");
          onError("[资源下载]：数据类型错误");
        }
      }
    });
  }
}
