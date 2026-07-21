'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export interface CarouselImage {
  src: string;
  alt?: string;
}

export interface CarouselBlockProps {
  images: CarouselImage[];
  className?: string;
}

export default function CarouselBlock({ images, className }: CarouselBlockProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToIndex = (index: number) => {
    if (!containerRef.current) return;
    const clampedIndex = Math.max(0, Math.min(images.length - 1, index));
    const container = containerRef.current;
    const slide = container.children[clampedIndex] as HTMLElement | undefined;
    if (!slide) return;

    const targetLeft = slide.offsetLeft;
    container.scrollTo({ left: targetLeft, behavior: 'smooth' });
    setCurrentIndex(clampedIndex);
  };

  const handleNext = () => {
    scrollToIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    scrollToIndex(currentIndex - 1);
  };

  if (!images.length) return null;

  const wrapperClasses = [
    'relative',
    'w-full',
    'max-w-[1112px]',
    'h-[352px]',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClasses} data-name="Carousel Block">
      <div
        ref={containerRef}
        className="absolute left-[49px] right-[49px] h-full flex items-center gap-2 overflow-x-auto overflow-y-hidden px-2 py-1 scroll-smooth"
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="relative h-full w-1/2 flex-none rounded-xl overflow-hidden"
          >
            <Image
              src={image.src}
              alt={image.alt ?? ''}
              fill
              className="object-contain"
              sizes=" 33vw, 100vw"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous image"
        onClick={handlePrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 h-[60px] w-[30px] bg-white/85 border border-black/50 flex items-center justify-center rounded-md"
      >
        <span className="sr-only">Previous</span>
        <span aria-hidden className="text-[#1e1e1e]"><ArrowLeft /></span>
      </button>

      <button
        type="button"
        aria-label="Next image"
        onClick={handleNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 h-[60px] w-[30px] bg-white/85 border border-black/50 flex items-center justify-center rounded-md"
      >
        <span className="sr-only">Next</span>
        <span aria-hidden className="text-[#1e1e1e]"><ArrowRight /></span>
      </button>
    </div>
  );
}
