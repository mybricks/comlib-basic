import { RefObject, useEffect } from "react";
const useMutationObserver = (
  target: RefObject<HTMLElement>,
  callback: MutationCallback,
  options: MutationObserverInit = {}
) => {
  const config = { attributes: true, ...options };
  useEffect(() => {
    const dom = target.current?.parentElement;
    if (!dom) return;
    const observer = new MutationObserver(callback);
    observer.observe(dom, config);
    return () => {
      observer.disconnect();
    };
  }, [target]);
};

export { useMutationObserver };
