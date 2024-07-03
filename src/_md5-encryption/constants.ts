export interface Data {
  outputType: string;
  useHmac: boolean;
}

export const InputIds = {
  INPUT: "input",
};

export const OutputIds = {
  ENCRYPTION_VALUE: "encryptionValue",
};

export type Message = string | number[] | ArrayBuffer | Uint8Array;

export interface EncryptParType {
  key?: string;
  value: Message;
}
