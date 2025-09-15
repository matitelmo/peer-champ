/**
 * Avatar Component
 *
 * A flexible avatar component that displays user profile images
 * with fallback support for initials or default icons.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { UserIcon } from './icons';

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallback?: React.ReactNode;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-24 h-24 text-2xl',
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'md',
  className,
  fallback,
}) => {
  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const showImage = src && !imageError && imageLoaded;
  const showFallback = !src || imageError || !imageLoaded;

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden',
        sizeClasses[size],
        className
      )}
    >
      {src && !imageError && (
        <img
          src={src}
          alt={alt}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-200',
            imageLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      )}
      
      {showFallback && (
        <div className="w-full h-full flex items-center justify-center">
          {fallback || (
            <UserIcon 
              size={size === 'sm' ? 16 : size === 'md' ? 20 : size === 'lg' ? 24 : 32} 
              className="text-gray-500 dark:text-gray-400" 
            />
          )}
        </div>
      )}
    </div>
  );
};
