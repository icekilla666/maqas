import { useEffect, useRef, type ReactNode } from "react";
import { Fancybox, type FancyboxInstance } from "@fancyapps/ui/dist/fancybox/";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

interface ImageViewerProps {
  src: string;
  label: string;
  children: ReactNode;
  className?: string;
}

const ImageViewer = ({ src, label, children, className = "" }: ImageViewerProps) => {
  const viewer = useRef<FancyboxInstance | undefined>(undefined);

  useEffect(() => () => {
    viewer.current?.destroy();
  }, [src]);

  return (
    <button
      type="button"
      className={`image-viewer ${className}`.trim()}
      aria-label={label}
      aria-haspopup="dialog"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        viewer.current?.destroy();
        viewer.current = Fancybox.show([{ src, type: "image" }], {
          triggerEl: event.currentTarget,
        });
      }}
    >
      {children}
    </button>
  );
};

export default ImageViewer;
