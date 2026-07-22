import Loader from "./Loader";

interface AbsoluteLoaderProps {
  open?: boolean;
  width?: number;
  className?: string;
}

const LoaderBackdrop = ({
  open = true,
  width = 42,
  className = "",
}: AbsoluteLoaderProps) => {
  if (!open) return null;

  return (
    <div
      className={`absolute-loader ${className}`.trim()}
      role="status"
      aria-live="polite"
    >
      <Loader width={width} />
    </div>
  );
};

export default LoaderBackdrop;
