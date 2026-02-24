import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PhotoCarouselProps {
  images: Array<{
    src: string;
    alt: string;
    title?: string;
    description?: string;
  }>;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
}

export function PhotoCarousel({ 
  images, 
  autoPlayInterval = 4000,
  showDots = true,
  showArrows = true 
}: PhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPaused, images.length, autoPlayInterval]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000); // Resume after 5 seconds
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <div 
      className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Image Container - Horizontal Row */}
      <div 
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ 
          transform: `translateX(-${currentIndex * 100}%)`,
          width: `${images.length * 100}%`
        }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="relative flex-shrink-0 w-full h-full"
            style={{ width: `${100 / images.length}%` }}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.currentTarget;
                target.src = `https://via.placeholder.com/800x600/1e40af/ffffff?text=${encodeURIComponent(image.alt)}`;
              }}
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all hover:scale-110"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all hover:scale-110"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all rounded-full ${
                index === currentIndex
                  ? 'w-8 h-2 bg-white'
                  : 'w-2 h-2 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
