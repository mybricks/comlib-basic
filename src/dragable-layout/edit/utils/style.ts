import { Data } from "../../types";
export const createStyleForGrid = ({ target }: StyleModeType<Data> = {}) => ({
  title: "容器",
  options: ["background", "border", "padding"],
  target,
});

export const createStyleForRow = ({ target }: StyleModeType<Data> = {}) => ({
  title: "行",
  options: ["background", { type: "size", config: { disableWidth: true } }],
  target,
});

export const createStyleForCol = ({ target }: StyleModeType<Data>) => ({
  title: "单元格",
  options: [
    "background",
    "border",
    "padding",
    { type: "size", config: { disableWidth: true } },
    "overflow"
  ],
  target,
});
