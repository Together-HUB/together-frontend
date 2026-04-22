import { useState } from "react";
import Image from "next/image";
import Lightbox from "./Lightbox";

const BLUR_PLACEHOLDER =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

interface LightboxImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  /** Shared group key — reserved for future multi-image context integration */
  group?: string;
}

export default function LightboxImage({
  src,
  alt,
  width,
  height,
  fill,
  className,
  priority,
  sizes,
}: LightboxImageProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-label={`Voir ${alt} en plein écran`}
        className="cursor-zoom-in"
        onClick={() => setOpen(true)}
        onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
      >
        {fill ? (
          <Image
            src={src}
            alt={alt}
            fill
            className={className}
            priority={priority}
            sizes={sizes}
            placeholder="blur"
            blurDataURL={BLUR_PLACEHOLDER}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={width ?? 400}
            height={height ?? 300}
            className={className}
            priority={priority}
            sizes={sizes}
            placeholder="blur"
            blurDataURL={BLUR_PLACEHOLDER}
          />
        )}
      </div>
      <Lightbox
        images={[src]}
        alts={[alt]}
        initialIndex={0}
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
