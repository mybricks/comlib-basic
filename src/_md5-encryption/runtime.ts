import { Data, InputIds, OutputIds, EncryptParType } from "./constants";
import { md5 } from "js-md5";

// https://github.com/emn178/js-md5

export default function ({
  env,
  data,
  inputs,
  outputs,
  logger,
  onError,
}: RuntimeParams<Data>) {
  const { runtime } = env;
  const { useHmac, outputType } = data;
  const encrypt = ({ value, key }: EncryptParType) => {
    if (useHmac && !key) {
      console.error("MD5加密组件入参有误，请输入密钥");
      return false;
    }
    return useHmac && key
      ? md5?.hmac?.[outputType || "hex"](key, value)
      : md5?.[outputType || "hex"](value);
  };

  try {
    if (runtime) {
      inputs[InputIds.INPUT]((val: EncryptParType) => {
        if (!!val) {
          outputs[OutputIds.ENCRYPTION_VALUE](encrypt(val));
        }
      });
    }
  } catch (ex: any) {
    onError?.(ex);
    console.error("MD5加密组件运行错误.", ex);
    logger.error(`${ex}`);
  }
}
