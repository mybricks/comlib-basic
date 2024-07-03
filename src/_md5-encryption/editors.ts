import { Data } from "./constants";

export default {
  "@init": ({ data }: EditorResult<Data>) => {},
  ":root": [
    {
      title: "使用HMAC, 需要输入密钥",
      type: "Switch",
      description:
        "基于哈希的消息认证码, 防止中间人攻击，篡改消息，或者伪造消息来源。需要输入密钥",
      value: {
        get({ data }: EditorResult<Data>) {
          return data.useHmac;
        },
        set({ data, input }: EditorResult<Data>, value: boolean) {
          data.useHmac = value;
          if (value) {
            input?.add({
              id: "input.key",
              title: "密钥",
              schema: { type: "string" },
            });
          } else {
            input?.remove("input.key", "密钥");
          }
        },
      },
    },
    {
      title: "输出数据编码格式",
      type: "Select",
      options() {
        return [
          {
            label: "Hex 十六进制",
            value: "hex",
          },
          {
            label: "Array",
            value: "array",
          },
          {
            label: "Digest",
            value: "digest",
          },
          {
            label: "ArrayBuffer",
            value: "arrayBuffer",
          },
          {
            label: "Buffer",
            value: "buffer",
          },
          {
            label: "Base64编码",
            value: "base64",
          },
        ];
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.outputType;
        },
        set({ data }, val: Data["outputType"]) {
          data.outputType = val;
        },
      },
    },
  ],
};
