import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Maximize, X } from 'lucide-react';
import { PropertyImage } from '../../types';

interface ImageGalleryProps {
  images: PropertyImage[];
  title: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, title }) => {
  const safeImages = images && images.length > 0 ? images : [
    { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', order: 1 }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  }, [safeImages.length]);

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  }, [safeImages.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (fullscreenOpen) {
        if (e.key === 'Escape') setFullscreenOpen(false);
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullscreenOpen, nextImage, prevImage]);

  return (
    <div className="space-y-3">
      {/* Main Image Stage */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-900 group">
        <img
          src={safeImages[currentIndex].url}
          alt={safeImages[currentIndex].alt || `${title} view ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
        />

        {/* Counter Badge */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-mono px-3 py-1 rounded-full z-10">
          {currentIndex + 1} / {safeImages.length}
        </div>

        {/* Fullscreen Expand Button */}
        <button
          onClick={() => setFullscreenOpen(true)}
          className="absolute bottom-4 right-4 p-2.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white transition-all z-10 cursor-pointer"
          title="Open fullscreen gallery"
        >
          <Maximize className="w-4 h-4" />
        </button>

        {/* Previous / Next Arrows (if > 1 image) */}
        {safeImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-10 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-10 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {safeImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-3">
          {safeImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative aspect-[16/10] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                currentIndex === idx
                  ? 'border-[#52796f] ring-2 ring-[#52796f]/40 scale-95'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img.url}
                alt={img.alt || `Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {fullscreenOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4">
          {/* Top Bar */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center text-white z-20">
            <span className="text-sm font-medium opacity-80">
              {title} ({currentIndex + 1} of {safeImages.length})
            </span>
            <button
              onClick={() => setFullscreenOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Fullscreen Image Container */}
          <div className="relative max-w-5xl max-h-[80vh] flex items-center justify-center">
            <img
              src={safeImages[currentIndex].url}
              alt={safeImages[currentIndex].alt || title}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />

            {safeImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
