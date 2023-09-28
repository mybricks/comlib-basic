import { encryptionAlgorithmPar } from "../constants";
import JSEncrypt from "jsencrypt";

// https://www.npmjs.com/package/jsencrypt

export default (parameters: encryptionAlgorithmPar): string | false => {
  const { encryptionType, value, key } = parameters;

  if (encryptionType === "public") {
    let encryptor = new JSEncrypt();
    encryptor.setPublicKey(key);
    return encryptor.encrypt(value);
  } else {
    let decrypt = new JSEncrypt();
    decrypt.setPrivateKey(key);
    return decrypt.decrypt(value);
  }
};
