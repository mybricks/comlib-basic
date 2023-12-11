import {
  Data,
  DownloadType,
  downloadOptions,
  SaveTypeOptions,
} from "./constants";

export const setSchema = (input, downloadType: DownloadType) => {
  if (downloadType === DownloadType.Local) {
    input.get("url").setSchema({
      title: "输入数据",
      type: "object",
      properties: {
        url: {
          title: "资源链接/数据",
          type: "any",
        },
        filename: {
          title: "资源文件名",
          type: "string",
        },
        saveType: {
          title: "保存类型（mimeType规范）",
          type: "string",
        },
      },
    });
    return;
  }
  input?.get("url").setSchema({
    title: "输入数据",
    type: "object",
    properties: {
      url: {
        title: "资源链接/数据",
        type: "any",
      },
      filename: {
        title: "资源文件名",
        type: "string",
      },
    },
  });
};

const getExtname = (filename: string) => {
  const index = filename.lastIndexOf(".");
  const extName = index < 1 ? null : filename.substring(index + 1);
  if (!extName) return;
  const { value } =
    SaveTypeOptions.find(({ label }) => label.includes(extName)) ?? {};
  return value;
};

export default {
  ":root": [
    {
      title: "文件名称",
      type: "text",
      options: {
        locale: true,
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.filename;
        },
        set({ data }: EditorResult<Data>, filename: string) {
          data.filename = filename;
          if (data.downloadType === DownloadType.Local) {
            const extName = getExtname(filename);
            data.saveType = extName;
          }
        },
      },
    },
    {
      title: "下载源",
      type: "select",
      options: {
        options: downloadOptions,
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.downloadType ?? DownloadType.Network;
        },
        set({ data, input }: EditorResult<Data>, value: DownloadType) {
          setSchema(input, value)
          data.downloadType = value;
        },
      },
    },
    {
      title: "保存类型",
      type: "select",
      options: {
        options: SaveTypeOptions,
        allowClear: true
      },
      ifVisible({ data }: EditorResult<Data>) {
        return data.downloadType === DownloadType.Local;
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.saveType;
        },
        set({ data }: EditorResult<Data>, val: string) {
          data.saveType = val;
        },
      },
    },
  ],
};
