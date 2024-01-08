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

const generateBlob = (source: any, mimeType: string | undefined) => {
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
  if (res.ok) {
    return res.blob();
  }
  throw Error(res.statusText)
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
  const { filename, downloadType } = data;
  const { runtime } = env;
  if (runtime) {
    inputs.url(async (val) => {
      if (val) {
        try {
          if (downloadType === DownloadType.Local) {
            const _filename = val.filename ?? env.i18n(filename) ?? defaultFilename;
            data.saveType = val.saveType ?? data.saveType
            const blob = generateBlob(val.url ?? val, data.saveType);
            download(blob, _filename);
            return;
          }
          const url = new URL(val.url ?? val, location.href);
          console.info(`%c [开始下载]: ${url.href}`, 'color: #1890ff; font-weight: bold;')
          const blob = await fetchBlob(url.href);
          const _filename =
            val.filename ??
            env.i18n(filename) ??
            matchFilename(url.href) ??
            defaultFilename;
          download(blob, _filename);
        } catch (error) {
          console.error(error)
        }
      }
    });
  }
}
