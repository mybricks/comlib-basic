import { Data } from "./types";
import { getFilterSelector } from "./utils";
export default ({
  id,
  data,
  input,
  output,
  getDeclaredStyle,
  setDeclaredStyle,
  removeDeclaredStyle,
}: UpgradeParams<Data>): boolean => {
  data.rows.forEach((row) => {
    row.cols.forEach((col, index) => {
      /**
       * :not selector style
       */
      const preGlobalColSelector = `.mybricks-layout .mybricks-col${getFilterSelector(
        id
      )}`;
      const preGlobalStyle = getDeclaredStyle(preGlobalColSelector);
      if (preGlobalStyle) {
        const css = { ...preGlobalStyle.css };
        removeDeclaredStyle(preGlobalColSelector);
        setDeclaredStyle(
          "> .mybricks-layout > .mybricks-row > .mybricks-col",
          css
        );
      }

      /**
       * remove :not selector, replace with child selector
       */
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
      /**
       * remove unified selector, replace with col single style
       */
      const unifiedColSelector = `> .mybricks-layout > .mybricks-row > .mybricks-col:nth-child(${
        index + 1
      })`;
      const unifiedColStyle = getDeclaredStyle(unifiedColSelector);
      const key = `${row.key},${col.key}`;
      const fixedSelector = `> .mybricks-layout > .mybricks-row > div[data-layout-col-key="${key}"]`;
      const fixedColStyle = getDeclaredStyle(fixedSelector);
      const nextColFlag = `${row.key}@${col.key}`;
      const singleColSelector = `> .mybricks-layout > .mybricks-row > div[data-layout-col-key="${nextColFlag}"]`;
      if (unifiedColStyle) {
        const css = { ...unifiedColStyle.css };
        removeDeclaredStyle(unifiedColSelector);
        setDeclaredStyle(singleColSelector, css);
      }
      if (fixedColStyle) {
        const css = { ...fixedColStyle.css };
        removeDeclaredStyle(fixedSelector);
        setDeclaredStyle(singleColSelector, css);
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

  const setWidthComplete = output.get('setWidthComplete')
  if(!setWidthComplete) {
    output.add('setWidthComplete', "完成", {type: 'any'})
    input.get('setWidth').setRels(['setWidthComplete'])
  }

  return true;
};
