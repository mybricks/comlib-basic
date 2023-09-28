import { Data, InputIds, OutputIds, EncryptParType } from "./constants";
import encryptionAlgorithm from "./encryptionAlgorithm";

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
      console.error("加解密组件入参有误");
      return false;
    }

    return encryptionAlgorithm[data.encryptionAlgorithm]({
      value,
      key,
      ...data,
    });
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
    console.error("加解密组件运行错误.", ex);
    logger.error(`${ex}`);
  }
}
