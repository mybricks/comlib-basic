import React, { useContext, useMemo, useRef } from "react";
import { useMutationObserver } from "../../../hooks/useMutationObserver";
import { RuntimeContext } from "../../context";
import styles from "./index.less";

interface LayoutProps {
  className?: string;
  children?: React.ReactNode;
}

const Layout = ({ className, children, ...rest }: LayoutProps) => {
  const { env } = useContext(RuntimeContext);
  const layoutRef = useRef<HTMLDivElement>(null);
  const classnames = useMemo(() => {
    const classnames = [styles.layout];
    if (className) {
      classnames.push(className);
    }
    return classnames.join(" ");
  }, [className]);

  useMutationObserver(layoutRef, (mutationList: MutationRecord[]) => {
    if (env && (env.edit || env.runtime?.debug)) {
      mutationList.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "style"
        ) {
          const style = window.getComputedStyle(mutation.target as Element);
          if (!layoutRef.current) return;
          layoutRef.current.style.height = mutation.target.style.height === 'auto' ? mutation.target.style.height : style.height;
          layoutRef.current.style.overflowY = "auto";
        }
      });
    }
  });

  return (
    <div ref={layoutRef} className={classnames} {...rest}>
      {children}
    </div>
  );
};

export default Layout;
