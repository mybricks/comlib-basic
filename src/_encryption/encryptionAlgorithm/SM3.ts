import { encryptionAlgorithmPar } from "../constants";
import { SM3 } from "gm-crypto";

// https://www.npmjs.com/package/gm-crypto

export default (parameters: encryptionAlgorithmPar): string | false => {
  const { value, inputEncoding, outputEncoding } = parameters;

  return SM3.digest(value, inputEncoding, outputEncoding);
};
