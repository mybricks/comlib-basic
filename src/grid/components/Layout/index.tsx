import React, { useMemo } from "react";
import styles from "./index.less";

interface LayoutProps {
  className?: string;
  children?: React.ReactNode;
}

const Layout = ({ className ,children, ...rest }: LayoutProps) => {
  const classnames = useMemo(() => {
    const classnames = [styles.layout];
    if (className) {
      classnames.push(className);
    }
    return classnames.join(" ");
  }, [className]);
  return <div className={classnames} {...rest}>{children}</div>;
};

export default Layout;
