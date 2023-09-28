import { encryptionAlgorithmPar } from "../constants";
import { SM4 } from "gm-crypto";

export default (parameters: encryptionAlgorithmPar): string | false => {
  const {
    encryptionType,
    value,
    key,
    iv,
    inputEncoding,
    outputEncoding,
    BlockCipherModes,
  } = parameters;

  if (encryptionType === "public") {
    return SM4.encrypt(value, key, {
      inputEncoding,
      outputEncoding,
      iv: !BlockCipherModes ? iv : undefined,
      mode: !BlockCipherModes ? SM4.constants.CBC : SM4.constants.ECB,
    });
  } else {
    return SM4.decrypt(value, key, {
      inputEncoding,
      outputEncoding,
      iv: !BlockCipherModes ? iv : undefined,
      mode: !BlockCipherModes ? SM4.constants.CBC : SM4.constants.ECB,
    });
  }
};
