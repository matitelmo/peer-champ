/**
 * Drawer Component
 *
 * A slide-out drawer component for mobile-friendly side panels and navigation.
 * Supports different positions and animations.
 */

'use client';

import React, { useEffect, useRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';
import { XMarkIcon } from '@heroicons/react/24/outline';

// Types
export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  position?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  footer?: ReactNode;
}

// Position classes
const positionClasses = {
  left: 'left-0 top-0 h-full',
  right: 'right-0 top-0 h-full',
  top: 'top-0 left-0 w-full',
  bottom: 'bottom-0 left-0 w-full',
};

// Size classes
const sizeClasses = {
  sm: {
    left: 'w-64',
    right: 'w-64',
    top: 'h-64',
    bottom: 'h-64',
  },
  md: {
    left: 'w-80',
    right: 'w-80',
    top: 'h-80',
    bottom: 'h-80',
  },
  lg: {
    left: 'w-96',
    right: 'w-96',
    top: 'h-96',
    bottom: 'h-96',
  },
  xl: {
    left: 'w-[32rem]',
    right: 'w-[32rem]',
    top: 'h-[32rem]',
    bottom: 'h-[32rem]',
  },
  full: {
    left: 'w-full',
    right: 'w-full',
    top: 'h-full',
    bottom: 'h-full',
  },
};

// Animation classes
const animationClasses = {
  left: {
    enter: 'transform transition-transform duration-300 ease-in-out',
    enterFrom: '-translate-x-full',
    enterTo: 'translate-x-0',
    leave: 'transform transition-transform duration-300 ease-in-out',
    leaveFrom: 'translate-x-0',
    leaveTo: '-translate-x-full',
  },
  right: {
    enter: 'transform transition-transform duration-300 ease-in-out',
    enterFrom: 'translate-x-full',
    enterTo: 'translate-x-0',
    leave: 'transform transition-transform duration-300 ease-in-out',
    leaveFrom: 'translate-x-0',
    leaveTo: 'translate-x-full',
  },
  top: {
    enter: 'transform transition-transform duration-300 ease-in-out',
    enterFrom: '-translate-y-full',
    enterTo: 'translate-y-0',
    leave: 'transform transition-transform duration-300 ease-in-out',
    leaveFrom: 'translate-y-0',
    leaveTo: '-translate-y-full',
  },
  bottom: {
    enter: 'transform transition-transform duration-300 ease-in-out',
    enterFrom: 'translate-y-full',
    enterTo: 'translate-y-0',
    leave: 'transform transition-transform duration-300 ease-in-out',
    leaveFrom: 'translate-y-0',
    leaveTo: 'translate-y-full',
  },
};

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className = '',
  footer,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Handle focus management
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Focus the drawer
      setTimeout(() => {
        drawerRef.current?.focus();
      }, 100);
    } else {
      // Restore focus to the previously focused element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Don't render if not open
  if (!isOpen) return null;

  const getDrawerClasses = () => {
    const baseClasses = 'fixed bg-white dark:bg-gray-800 shadow-xl z-50';
    const positionClass = positionClasses[position];
    const sizeClass = sizeClasses[size][position];
    const animationClass = animationClasses[position].enter;

    return `${baseClasses} ${positionClass} ${sizeClass} ${animationClass} ${className}`;
  };

  const drawerContent = (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      aria-labelledby={title ? 'drawer-title' : undefined}
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleBackdropClick}
      />

      {/* Drawer */}
      <div ref={drawerRef} className={getDrawerClasses()} tabIndex={-1}>
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            {title && (
              <h3
                id="drawer-title"
                className="text-lg font-semibold text-gray-900 dark:text-white"
              >
                {title}
              </h3>
            )}

            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Close drawer"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 dark:border-gray-700">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  // Render drawer using portal
  return createPortal(drawerContent, document.body);
};

// Filter Drawer Component
export interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  onReset: () => void;
  title?: string;
  children: ReactNode;
  filters?: any;
  loading?: boolean;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  onApply,
  onReset,
  title = 'Filters',
  children,
  filters = {},
  loading = false,
}) => {
  const hasFilters = Object.keys(filters).length > 0;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      position="right"
      size="md"
      footer={
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onReset}
            disabled={loading || !hasFilters}
          >
            Reset
          </Button>
          <Button onClick={() => onApply(filters)} disabled={loading}>
            Apply Filters
          </Button>
        </div>
      }
    >
      {children}
    </Drawer>
  );
};

// Settings Drawer Component
export interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: any) => void;
  title?: string;
  children: ReactNode;
  settings?: any;
  loading?: boolean;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  onSave,
  title = 'Settings',
  children,
  settings = {},
  loading = false,
}) => {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      position="right"
      size="lg"
      footer={
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={() => onSave(settings)} disabled={loading}>
            Save Settings
          </Button>
        </div>
      }
    >
      {children}
    </Drawer>
  );
};

export default Drawer;
