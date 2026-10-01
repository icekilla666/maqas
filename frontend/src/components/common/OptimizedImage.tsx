import { useState, type ImgHTMLAttributes } from "react";
import { getImageUrl, type ImageVariant } from "@/utils/imageUrl";

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet" | "crossOrigin"> {
  src: string;
  variant: ImageVariant;
}

const OptimizedImage = ({ src, variant, onError, ...props }: OptimizedImageProps) => {
  const optimizedSrc = getImageUrl(src, variant);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const useOptimized = optimizedSrc !== src && failedSrc !== optimizedSrc;
  const displayedSrc = useOptimized ? optimizedSrc : src;

  return (
    <img
      {...props}
      key={displayedSrc}
      src={displayedSrc}
      crossOrigin={useOptimized ? "anonymous" : undefined}
      onError={(event) => {
        if (useOptimized) {
          setFailedSrc(optimizedSrc);
          return;
        }
        onError?.(event);
      }}
    />
  );
};

export default OptimizedImage;
