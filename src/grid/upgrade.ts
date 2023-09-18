import { Data } from "./types";
import { getFilterSelector } from "./utils";
export default ({
  id,
  data,
  getDeclaredStyle,
  setDeclaredStyle,
  removeDeclaredStyle,
}: UpgradeParams<Data>): boolean => {
  data.rows.forEach((row) => {
    row.cols.forEach((col, index) => {
      const preGlobalColSelector = `.mybricks-layout .mybricks-col${getFilterSelector(
        id
      )}`;
      const preGlobalStyle = getDeclaredStyle(preGlobalColSelector);
      if (preGlobalStyle) {
        const css = { ...preGlobalStyle.css };
        removeDeclaredStyle(preGlobalColSelector);
        setDeclaredStyle("> .mybricks-layout > .mybricks-row > .mybricks-col", css);
      }

      const preColSelector = `.mybricks-layout .mybricks-row .mybricks-col:nth-child(${
        index + 1
      })${getFilterSelector(id)}`;
      const preStyle = getDeclaredStyle(preColSelector);
      if (preStyle) {
        const css = { ...preStyle.css };
        const newSelector = `> .mybricks-layout > .mybricks-row > .mybricks-col:nth-child(${
          index + 1
        })`;
        removeDeclaredStyle(preColSelector);
        setDeclaredStyle(newSelector, css);
      }
    });
    const preContainerSelector = `.mybricks-layout${getFilterSelector(id)}`;
    const preContainerStyle = getDeclaredStyle(preContainerSelector);
    if (preContainerStyle) {
      const css = { ...preContainerStyle.css };
      removeDeclaredStyle(preContainerSelector);
      setDeclaredStyle("> .mybricks-layout", css);
    }
  });
  return true;
};
