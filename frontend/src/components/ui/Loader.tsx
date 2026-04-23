import type { CSSProperties } from "react";

interface LoaderProps {
  width?: number;
  className?: string;
}

const Loader = ({ width, className }: LoaderProps) => {
  return (
    <div
      className={`loader ${className}`.trim()}
      style={{ "--loader": width ? `${width}px` : width } as CSSProperties}
    ></div>
  );
};

export default Loader;
