import React, { useMemo, useRef } from "react";
import { useResizeObserver } from '../../../hooks/useResizeObserver'
import styles from "./index.less";

interface LayoutProps {
  className?: string;
  children?: React.ReactNode;
}

const Layout = ({ className, children, ...rest }: LayoutProps) => {
  const layoutRef = useRef<HTMLDivElement>(null)
  const classnames = useMemo(() => {
    const classnames = [styles.layout];
    if (className) {
      classnames.push(className);
    }
    return classnames.join(" ");
  }, [className]);

  useResizeObserver(layoutRef, (entries: ResizeObserverEntry[]) => {
    if (!layoutRef.current) return;
    const { contentRect } = entries[0]
    layoutRef.current.style.height = `${contentRect.height}px`
    layoutRef.current.style.overflowY = 'auto'
  })

  return <div ref={layoutRef} className={classnames} {...rest}>{children}</div>;
};

export default Layout;
