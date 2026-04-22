import { useEffect, useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BLUR_PLACEHOLDER =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

interface LightboxProps {
  images: string[];
  alts?: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function Lightbox({
  images,
  alts = [],
  initialIndex = 0,
  isOpen,
  onClose,
}: LightboxProps) {
  const [current, setCurrent] = useState(initialIndex);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  useEffect(() => {
    if (isOpen) setCurrent(initialIndex);
  }, [isOpen, initialIndex]);

  const prev = useCallback(
    () => setCurrent((i) => (i - 1 + images.length) % images.length),
    [images.length]
  );

  const next = useCallback(
    () => setCurrent((i) => (i + 1) % images.length),
    [images.length]
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && images.length > 1) prev();
      if (e.key === "ArrowRight" && images.length > 1) next();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose, prev, next, images.length]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dy) > Math.abs(dx) && dy > 60) {
      onClose();
    } else if (images.length > 1 && Math.abs(dx) > 50) {
      if (dx < 0) next();
      else prev();
    }
  };

  const currentAlt = alts[current] ?? `Image ${current + 1}`;
  const hasMultiple = images.length > 1;

  const content = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label="Visionneuse d'images"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={onClose}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Fermer"
            className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/40 backdrop-blur rounded-full p-2 text-white transition-colors"
          >
            <X size={20} />
          </button>

          {/* Image container */}
          <div
            className="relative cursor-default"
            style={{ width: "90vw", height: "90vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[current]}
              alt={currentAlt}
              fill
              className="object-contain drop-shadow-2xl"
              sizes="90vw"
              placeholder="blur"
              blurDataURL={BLUR_PLACEHOLDER}
            />
          </div>

          {/* Caption */}
          {currentAlt && (
            <p className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/80 text-sm text-center max-w-xl px-4 pointer-events-none">
              {currentAlt}
            </p>
          )}

          {/* Counter */}
          {hasMultiple && (
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm pointer-events-none">
              <span aria-live="polite">
                {current + 1} / {images.length}
              </span>
            </p>
          )}

          {/* Prev / Next arrows — hidden on mobile (swipe to navigate) */}
          {hasMultiple && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Image précédente"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex bg-white/20 hover:bg-white/40 backdrop-blur rounded-full p-3 text-white transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Image suivante"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex bg-white/20 hover:bg-white/40 backdrop-blur rounded-full p-3 text-white transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (typeof window === "undefined") return null;
  return createPortal(content, document.body);
}
