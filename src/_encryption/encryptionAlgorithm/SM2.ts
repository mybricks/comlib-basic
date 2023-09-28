import { encryptionAlgorithmPar } from "../constants";
import { SM2 } from "gm-crypto";

// https://www.npmjs.com/package/gm-crypto

export default (parameters: encryptionAlgorithmPar): string | false => {
  const {
    encryptionType,
    value,
    key,
    inputEncoding,
    outputEncoding,
    cipherMode,
  } = parameters;

  // 加密的key需要加"04"
  return encryptionType === "public"
    ? SM2.encrypt(value, "04" + key, {
        inputEncoding,
        outputEncoding,
        mode: cipherMode || 1,
      })
    : SM2.decrypt(value, key, {
        inputEncoding,
        outputEncoding,
        mode: cipherMode || 1,
      });
};
