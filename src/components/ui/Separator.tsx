import React from 'react';

interface SeparatorProps {
  className?: string;
}

export const Separator: React.FC<SeparatorProps> = ({ className = '' }) => (
  <div className={`w-full h-px bg-gray-200 dark:bg-gray-700 ${className}`} />
);
