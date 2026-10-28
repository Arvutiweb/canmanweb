'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ProductImageGalleryProps {
  images: string[];
  title: string;
}

export default function ProductImageGallery({ images, title }: ProductImageGalleryProps) {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div>
      <div className="relative aspect-square overflow-hidden bg-[#f8f9fb]">
        <Image
          src={images[activeImage]}
          alt={title}
          fill
          className="h-full w-full object-contain p-6"
          unoptimized
        />
      </div>
      <div className="mt-4 flex gap-3 overflow-x-auto">
        {images.map((src, index) => (
          <button
            key={src + index}
            type="button"
            onClick={() => setActiveImage(index)}
            className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border bg-[#f8f9fb] transition hover:border-black"
            aria-label={`Show image ${index + 1} of ${title}`}
            aria-pressed={activeImage === index}
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-contain p-2"
              unoptimized
            />
          </button>
        ))}
      </div>
    </div>
  );
}
