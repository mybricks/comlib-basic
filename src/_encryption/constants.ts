/**
 * @param encryptionAlgorithm 加密算法
 * @param encryptionType 操作类型
 * @param cipherMode 密码模式
 * @param BlockCipherModes 分组密码模式
 * @param iv 分组密码的初始值
 * @param inputEncoding 输入内容(明/密文)编码格式
 * @param outputEncoding 输出内容(明/密文)编码格式
 */
export interface Data {
  encryptionAlgorithm: "SM2" | "SM3" | "SM4" | "RSA";
  encryptionType: "public" | "private";
  cipherMode?: 1 | 0;
  BlockCipherModes?: 1 | 0;
  iv?: string;
  inputEncoding: BufferEncoding;
  outputEncoding: BufferEncoding;
}

export const InputIds = {
  INPUT: "input",
};

export const OutputIds = {
  ENCRYPTION_VALUE: "encryptionValue",
};

export interface EncryptParType {
  key: string;
  value: string;
}

export interface encryptionAlgorithmPar extends Data, EncryptParType {}

export type BufferEncoding =
  | "ascii"
  | "utf8"
  | "utf-8"
  | "utf16le"
  | "ucs2"
  | "ucs-2"
  | "base64"
  | "base64url"
  | "latin1"
  | "binary"
  | "hex";

export const bufferEncodings = () => [
  "ascii",
  "utf8",
  "utf-8",
  "utf16le",
  "ucs2",
  "ucs-2",
  "base64",
  "base64url",
  "latin1",
  "binary",
  "hex",
].map((encoding) => ({ label: encoding, value: encoding }));
