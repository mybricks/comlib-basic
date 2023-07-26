import { Data } from "../../types";
export const createStyleForGrid = ({ target }: StyleModeType<Data> = {}) => ({
  title: "容器",
  options: ["background", "border"],
  target,
});

export const createStyleForRow = ({ target }: StyleModeType<Data> = {}) => ({
  title: "行",
  options: [{ type: "background", config: { disableBackgroundImage: true } }],
  target,
});

export const createStyleForCol = ({ target }: StyleModeType<Data>) => ({
  title: "单元格",
  options: [
    "background",
    "border",
    "padding"
  ],
  target,
});