export interface Data {
  encryptionType: "public" | "private";
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
