/**
 * useToast Hook
 *
 * A custom hook for managing toast notifications.
 * Provides functions to add, remove, and manage toast state.
 */

'use client';

import React from 'react';
import { type ToastData } from './ToastContainer';

export interface ToastOptions {
  /** Toast title */
  title?: string;
  /** Toast description */
  description?: string;
  /** Toast variant */
  variant?: 'default' | 'info' | 'success' | 'warning' | 'error';
  /** Auto-dismiss duration in milliseconds (0 = no auto-dismiss) */
  duration?: number;
  /** Whether the toast can be dismissed */
  dismissible?: boolean;
  /** Custom icon component */
  icon?: React.ReactNode;
  /** Whether to show the default icon for the variant */
  showIcon?: boolean;
  /** Action buttons */
  actions?: React.ReactNode;
}

export interface ToastReturn {
  /** Array of active toasts */
  toasts: ToastData[];
  /** Add a new toast */
  toast: (options: ToastOptions) => string;
  /** Remove a toast by ID */
  dismiss: (id: string) => void;
  /** Remove all toasts */
  dismissAll: () => void;
  /** Update an existing toast */
  update: (id: string, options: Partial<ToastOptions>) => void;
}

// Generate unique ID for toasts
const generateId = (): string => {
  return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Custom hook for managing toast state
export const useToast = (): ToastReturn => {
  const [toasts, setToasts] = React.useState<ToastData[]>([]);

  const toast = React.useCallback((options: ToastOptions): string => {
    const id = generateId();
    const newToast: ToastData = {
      id,
      ...options,
    };

    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const dismissAll = React.useCallback(() => {
    setToasts([]);
  }, []);

  const update = React.useCallback(
    (id: string, options: Partial<ToastOptions>) => {
      setToasts((prev) =>
        prev.map((toast) =>
          toast.id === id ? { ...toast, ...options } : toast
        )
      );
    },
    []
  );

  return {
    toasts,
    toast,
    dismiss,
    dismissAll,
    update,
  };
};

// Convenience functions for common toast types
export const createToastHelpers = (
  toast: (options: ToastOptions) => string
) => ({
  success: (
    title: string,
    description?: string,
    options?: Partial<ToastOptions>
  ) => toast({ title, description, variant: 'success', ...options }),

  error: (
    title: string,
    description?: string,
    options?: Partial<ToastOptions>
  ) => toast({ title, description, variant: 'error', ...options }),

  warning: (
    title: string,
    description?: string,
    options?: Partial<ToastOptions>
  ) => toast({ title, description, variant: 'warning', ...options }),

  info: (
    title: string,
    description?: string,
    options?: Partial<ToastOptions>
  ) => toast({ title, description, variant: 'info', ...options }),

  default: (
    title: string,
    description?: string,
    options?: Partial<ToastOptions>
  ) => toast({ title, description, variant: 'default', ...options }),
});

export type ToastHelpers = ReturnType<typeof createToastHelpers>;
