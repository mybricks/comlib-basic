import { Data } from "./constants";
import { setSchema } from './editors'
export default ({ input, data}: UpgradeParams<Data>): boolean => {
  setSchema(input, data.downloadType)
  return true;
};
