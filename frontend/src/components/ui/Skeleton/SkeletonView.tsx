import type { ReactNode } from "react";

const SkeletonView = ({
  children,
  label = "Загрузка…",
  className = "",
}: { children: ReactNode; label?: string; className?: string }) => (
  <div className={`skeleton-view ${className}`.trim()} role="status">
    <span className="sr-only">{label}</span>
    <div aria-hidden="true">{children}</div>
  </div>
);

export default SkeletonView;
