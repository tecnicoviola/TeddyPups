import React, { useEffect, useRef, useState, useCallback } from 'react';

export interface GalleryPhoto {
  id?: string;
  src: string;
  alt?: string;
  caption?: string;
}

interface FullScreenImageViewerProps {
  photos: GalleryPhoto[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const FullScreenImageViewer: React.FC<FullScreenImageViewerProps> = ({
  photos,
  initialIndex = 0,
  isOpen,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [direction, setDirection] = useState<number>(1);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchStartXRef = useRef<number | null>(null);

  const totalPhotos = photos.length;

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      dialogRef.current?.showModal?.();
      const origOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = origOverflow;
      };
    } else {
      if (dialogRef.current?.open) {
        dialogRef.current.close();
      }
    }
  }, [isOpen, initialIndex]);

  const navigateTo = useCallback(
    (newIndex: number, dir: number) => {
      if (totalPhotos <= 1) return;
      setDirection(dir);
      setIsAnimating(true);
      const wrapped = ((newIndex % totalPhotos) + totalPhotos) % totalPhotos;
      setCurrentIndex(wrapped);
      setTimeout(() => setIsAnimating(false), 260);
    },
    [totalPhotos]
  );

  const handlePrevious = useCallback(() => {
    navigateTo(currentIndex - 1, -1);
  }, [currentIndex, navigateTo]);

  const handleNext = useCallback(() => {
    navigateTo(currentIndex + 1, 1);
  }, [currentIndex, navigateTo]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handlePrevious, handleNext, onClose]);

  // Touch Swipe navigation
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if ('touches' in e) {
      touchStartXRef.current = e.touches[0].clientX;
    } else {
      touchStartXRef.current = e.clientX;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (touchStartXRef.current === null) return;
    const endX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const diff = endX - touchStartXRef.current;
    touchStartXRef.current = null;

    if (diff > 50) {
      // Swiped right -> Previous
      handlePrevious();
    } else if (diff < -50) {
      // Swiped left -> Next
      handleNext();
    }
  };

  if (!isOpen || totalPhotos === 0) return null;

  const currentPhoto = photos[currentIndex] || photos[0];
  const prevPhoto = photos[((currentIndex - 1 % totalPhotos) + totalPhotos) % totalPhotos];
  const nextPhoto = photos[(currentIndex + 1) % totalPhotos];

  return (
    <dialog
      ref={dialogRef}
      aria-label="Photo viewer"
      className="tp-viewer fixed inset-0 m-0 z-[60] flex h-dvh max-h-none w-screen max-w-none flex-col border-none bg-cocoa/95 p-0 text-milk outline-none backdrop:bg-cocoa/70 select-none"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) {
          onClose();
        }
      }}
      data-lenis-prevent="true"
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-4 px-6 py-4 select-none">
        <p className="font-scrawl text-lg text-milk">
          {currentIndex + 1} / {totalPhotos}
          {currentPhoto.caption ? ` — ${currentPhoto.caption}` : ''}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close viewer"
          className="h-11 rounded-full bg-milk px-5 font-semibold text-cocoa transition-transform active:scale-95 hover:bg-milk/90"
        >
          Close
        </button>
      </div>

      {/* Main Photograph Area */}
      <div
        className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-2 cursor-pointer"
        onClick={(e) => {
          // If clicking surrounding space in center area, close viewer
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
      >
        <div
          key={currentIndex}
          className="relative max-h-full max-w-full flex items-center justify-center transition-all duration-200 ease-out cursor-default"
          onClick={(e) => e.stopPropagation()}
          style={{
            transform: isAnimating ? `translateX(${direction * 15}px)` : 'translateX(0)',
            opacity: isAnimating ? 0.85 : 1,
          }}
        >
          <img
            src={currentPhoto.src}
            alt={currentPhoto.alt || 'Happy TeddyPups family photo'}
            className="max-h-[calc(100vh-170px)] max-w-[90vw] md:max-w-[82vw] w-auto h-auto object-contain rounded-sm shadow-2xl pointer-events-auto"
            draggable={false}
          />
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex justify-center items-center gap-3 pb-[calc(1.2rem+env(safe-area-inset-bottom))] pt-3 select-none">
        <button
          type="button"
          onClick={handlePrevious}
          aria-label="Previous photo"
          className="h-12 rounded-full border-2 border-milk px-6 font-semibold text-milk hover:bg-milk/10 active:scale-95 transition-all"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next photo"
          className="h-12 rounded-full bg-honey px-6 font-semibold text-cocoa hover:bg-honey-soft active:scale-95 transition-all"
        >
          Next
        </button>
      </div>

      {/* Preload adjacent photos */}
      <div className="hidden" aria-hidden="true">
        {prevPhoto?.src && <img src={prevPhoto.src} alt="" />}
        {nextPhoto?.src && <img src={nextPhoto.src} alt="" />}
      </div>
    </dialog>
  );
};

export default FullScreenImageViewer;
