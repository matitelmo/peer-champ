/**
 * Toast Container Component
 *
 * A container component for managing multiple toast notifications.
 * Handles positioning, stacking, and lifecycle management of toasts.
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Toast, type ToastProps } from './Toast';

export interface ToastData extends Omit<ToastProps, 'onDismiss'> {
  id: string;
  onDismiss?: (id: string) => void;
}

export interface ToastContainerProps {
  /** Array of toast data */
  toasts: ToastData[];
  /** Position of the toast container */
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
  /** Maximum number of toasts to show */
  maxToasts?: number;
  /** Additional CSS classes */
  className?: string;
}

// Position styles for the container
const positionStyles = {
  'top-left': 'top-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-4 right-4',
};

// Main ToastContainer component
const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  position = 'top-right',
  maxToasts = 5,
  className,
}) => {
  // Limit the number of toasts displayed
  const visibleToasts = toasts.slice(0, maxToasts);

  if (visibleToasts.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed z-50 flex flex-col gap-2 pointer-events-none',
        positionStyles[position],
        className
      )}
      aria-live="polite"
      aria-label="Notifications"
    >
      {visibleToasts.map((toast, index) => (
        <div
          key={toast.id}
          className="pointer-events-auto"
          style={{
            zIndex: 1000 - index, // Stack toasts with decreasing z-index
          }}
        >
          <Toast
            {...toast}
            position={position}
            onDismiss={() => toast.onDismiss?.(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

export { ToastContainer };
