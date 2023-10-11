import { Data, OutputIds, bufferEncodings } from "./constants";

export default {
  "@init": ({ data }: EditorResult<Data>) => {},
  ":root": [
    {
      title: "加密算法",
      type: "select",
      options() {
        return [
          {
            label: "SM2国密算法",
            value: "SM2",
          },
          {
            label: "SM3国密算法",
            value: "SM3",
          },
          {
            label: "SM4国密算法",
            value: "SM4",
          },
        ];
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.encryptionAlgorithm;
        },
        set({ data }, val: Data["encryptionAlgorithm"]) {
          data.encryptionAlgorithm = val;
        },
      },
    },
    {
      title: "操作类型",
      type: "select",
      ifVisible({ data }: EditorResult<Data>) {
        return data.encryptionAlgorithm !== "SM3";
      },
      options() {
        return [
          {
            label: "公钥加密",
            value: "public",
          },
          {
            label: "私钥解密",
            value: "private",
          },
        ];
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.encryptionType;
        },
        set({ data, input, output }, val: Data["encryptionType"]) {
          data.encryptionType = val;
          if (data.encryptionType === "private") {
            output?.setTitle(OutputIds.ENCRYPTION_VALUE, "明文");
            input?.setTitle("input.key", "私钥");
            input?.setTitle("input.value", "密文");
          } else {
            output.setTitle(OutputIds.ENCRYPTION_VALUE, "密文");
            input?.setTitle("input.key", "公钥");
            input?.setTitle("input.value", "明文");
          }
        },
      },
    },
    {
      title: "输入编码格式",
      type: "select",
      options() {
        return bufferEncodings();
      },
      value: {
        get({ data }) {
          return data.inputEncoding;
        },
        set({ data }: EditorResult<Data>, val: Data["inputEncoding"]) {
          data.inputEncoding = val;
        },
      },
    },
    {
      title: "输出编码格式",
      type: "select",
      options() {
        return bufferEncodings();
      },
      value: {
        get({ data }) {
          return data.outputEncoding;
        },
        set({ data }: EditorResult<Data>, val: Data["outputEncoding"]) {
          data.outputEncoding = val;
        },
      },
    },
    {
      title: "密码模式",
      type: "select",
      ifVisible({ data }: EditorResult<Data>) {
        return data.encryptionAlgorithm === "SM2";
      },
      options() {
        return [
          {
            label: "C1C3C2",
            value: 1,
          },
          {
            label: "C1C2C3",
            value: 0,
          },
        ];
      },
      value: {
        get({ data }) {
          return data.cipherMode;
        },
        set({ data }: EditorResult<Data>, val: 1 | 0) {
          data.cipherMode = val;
        },
      },
    },
    {
      title: "分组密码模式",
      type: "select",
      ifVisible({ data }: EditorResult<Data>) {
        return data.encryptionAlgorithm === "SM4";
      },
      options() {
        return [
          {
            label: "ECB",
            value: 1,
          },
          {
            label: "CBC",
            value: 0,
          },
        ];
      },
      value: {
        get({ data }) {
          return data.BlockCipherModes;
        },
        set({ data }: EditorResult<Data>, val: 1 | 0) {
          data.BlockCipherModes = val;
        },
      },
    },
    {
      title: "初始向量 IV",
      type: "text",
      ifVisible({ data }: EditorResult<Data>) {
        return data.encryptionAlgorithm === "SM4" && !data.BlockCipherModes;
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.iv;
        },
        set({ data }, val: string) {
          data.iv = val;
        },
      },
    },
  ],
};
