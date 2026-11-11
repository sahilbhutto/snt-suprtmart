import { useEffect, useState, type ReactNode } from "react";
import { cn } from "../../lib/cn";

const ImageWithFallback = ({
  src,
  alt,
  fallback,
  width,
  height,
  className,
}: {
  src?: string;
  alt: string;
  fallback: ReactNode;
  width: number;
  height: number;
  className?: string;
}) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  if (!src || failed) return <>{fallback}</>;

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={cn('size-full object-cover', className)}
    />
  );
};

export default ImageWithFallback
