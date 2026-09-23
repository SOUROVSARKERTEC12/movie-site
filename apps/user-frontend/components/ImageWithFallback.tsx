'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Film } from 'lucide-react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fill,
  width,
  height,
  className = '',
  priority = false,
  sizes,
}) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-950 to-black border border-neutral-800 p-4 text-center select-none ${className} ${
          fill ? 'absolute inset-0 w-full h-full' : ''
        }`}
        style={!fill && width && height ? { width, height } : undefined}
      >
        <div className="w-10 h-10 rounded-full bg-neutral-800/80 flex items-center justify-center mb-2 text-neutral-400">
          <Film className="w-5 h-5" />
        </div>
        <span className="text-xs font-medium text-neutral-300 line-clamp-2 px-2 tracking-wide uppercase">
          {alt}
        </span>
        <span className="text-[10px] text-neutral-500 mt-1">CineBlack HD</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      className={className}
      priority={priority}
      sizes={sizes}
      onError={() => setError(true)}
      unoptimized
    />
  );
};
