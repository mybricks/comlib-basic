import {
  Data,
  DownloadType,
  downloadOptions,
  SaveTypeOptions,
} from "./constants";

const setSchema = (input, status) => {
  if (status === 0) {
    input?.get("url").setSchema({
      title: "输入数据",
      type: "string",
    });
  }
  if (status === 1) {
    input.get("url").setSchema({
      title: "输入数据",
      type: "object",
      properties: {
        url: {
          title: "资源链接",
          type: "string",
        },
        filename: {
          title: "资源文件名",
          type: "string",
        },
      },
    });
  }
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
      title: "文件名配置",
      type: "select",
      options: [
        {
          key: 0,
          label: "手动配置",
          value: 0,
        },
        {
          key: 1,
          label: "动态配置",
          value: 1,
        },
      ],
      value: {
        get({ data }: EditorResult<Data>) {
          return data.nameConfig;
        },
        set({ data, input }: EditorResult<Data>, val: 0 | 1) {
          setSchema(input, val);
          data.nameConfig = val;
        },
      },
    },
    {
      title: "文件名称",
      type: "text",
      ifVisible({ data }: EditorResult<Data>) {
        return data.nameConfig === 0;
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
        set({ data }: EditorResult<Data>, value: DownloadType) {
          data.downloadType = value;
        },
      },
    },
    {
      title: "保存类型",
      type: "select",
      options: {
        options: SaveTypeOptions,
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
