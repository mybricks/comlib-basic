import { Data, InputIds, OutputIds, EncryptParType } from "./constants";
import JSEncrypt from "jsencrypt";

export default function ({
  env,
  data,
  inputs,
  outputs,
  logger,
  onError,
}: RuntimeParams<Data>) {
  const encrypt = (key: string, value: string): string | false => {
    if (typeof key !== "string" || typeof value !== "string") {
      console.error("RSA加密组件入参有误");
      return false;
    }
    // 公钥加密
    if (data.encryptionType === "public") {
      let encryptor = new JSEncrypt();
      encryptor.setPublicKey(key);
      return encryptor.encrypt(value);
    }
    // 私钥解密
    else if (data.encryptionType === "private") {
      let decrypt = new JSEncrypt();
      decrypt.setPrivateKey(key);
      return decrypt.decrypt(value);
    }

    return false;
  };

  try {
    if (env.runtime) {
      inputs[InputIds.INPUT]((val: EncryptParType) => {
        if (val) {
          outputs[OutputIds.ENCRYPTION_VALUE](encrypt(val.key, val.value));
        }
      });
    }
  } catch (ex: any) {
    onError?.(ex);
    console.error("RSA加密组件运行错误.", ex);
    logger.error(`${ex}`);
  }
}
