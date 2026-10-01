import type { CSSProperties } from "react";
import "./skeleton.css";

interface SkeletonProps {
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  circle?: boolean;
  className?: string;
}

const Skeleton = ({ width, height = 14, circle = false, className = "" }: SkeletonProps) => (
  <div
    aria-hidden="true"
    className={`skeleton ${circle ? "skeleton--circle" : ""} ${className}`.trim()}
    style={{ width, height }}
  />
);

export default Skeleton;
