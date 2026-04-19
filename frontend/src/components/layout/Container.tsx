import type { ReactNode } from "react";

interface ContainerProps {
  className?: string;
  children: ReactNode;
}

const Container = ({ className = "", children }: ContainerProps) => {
  return <div className={`container ${className}`.trim()}>{children}</div>;
};

export default Container;
