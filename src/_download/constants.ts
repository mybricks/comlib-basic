export interface Data {
  nameConfig: 0 | 1;
  filename: string;
  downloadType: DownloadType;
  saveType?: string;
}

export enum DownloadType {
  Network = "network",
  Local = "local",
}

export const downloadOptions = [
  {
    label: "网络请求",
    value: DownloadType.Network,
  },
  {
    label: "本地数据",
    value: DownloadType.Local,
  },
];

const mimeType = [
  ["txt", "text/plain"],
  ["json", "application/json"],
  ["png", "image/png"],
  ["jpg,.jpeg", "image/jpeg"],
  ["gif", "image/gif"],
  ["pdf", "application/pdf"],
  ["html", "text/html"],
  ["mp3", "audio/mpeg"],
  ["mp4", "video/mp4"],
  ["ogv,ogg", "video/ogg"],
  ["doc,dot", "application/msword"],
  [
    "docx",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  [
    "dotx",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
  ],
  ["docm", "application/vnd.ms-word.document.macroEnabled.12"],
  ["dotm", "application/vnd.ms-word.template.macroEnabled.12"],
  ["xls,xlt,xla", "application/vnd.ms-excel"],
  ["xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
  [
    "xltx",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
  ],
  ["xlsm", ".application/vnd.ms-excel.sheet.macroEnabled.12"],
  ["xltm", "application/vnd.ms-excel.template.macroEnabled.12"],
  ["xlam", "application/vnd.ms-excel.addin.macroEnabled.12"],
  ["xlsb", ".application/vnd.ms-excel.sheet.binary.macroEnabled.12"],
  ["ppt,pot,pps,ppa", "application/vnd.ms-powerpoint"],
  [
    "pptx",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ],
  [
    "potx",
    "application/vnd.openxmlformats-officedocument.presentationml.template",
  ],
  [
    "ppsx",
    "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
  ],
  ["ppam", "application/vnd.ms-powerpoint.addin.macroEnabled.12"],
  ["pptm", "application/vnd.ms-powerpoint.presentation.macroEnabled.12"],
  ["potm", "application/vnd.ms-powerpoint.template.macroEnabled.12"],
  ["ppsm", "application/vnd.ms-powerpoint.slideshow.macroEnabled.12"],
  ["mdb", "application/vnd.ms-access"],
  ["zip", "application/zip"],
];

export const SaveTypeOptions = mimeType.map((type) => ({
  label: type[0],
  value: type[1],
}));
