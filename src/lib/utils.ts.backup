/**
 * Utility Functions
 *
 * Common utility functions used throughout the application.
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names with proper Tailwind CSS conflict resolution
 *
 * @param inputs - Class names to combine
 * @returns Combined and optimized class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date to a human-readable string
 *
 * @param date - Date to format
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {}
) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(dateObj);
}

/**
 * Formats a number as currency
 *
 * @param amount - Amount to format
 * @param currency - Currency code (default: USD)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Truncates text to a specified length
 *
 * @param text - Text to truncate
 * @param length - Maximum length
 * @returns Truncated text with ellipsis
 */
export function truncateText(text: string, length: number) {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

/**
 * Generates initials from a name
 *
 * @param name - Full name
 * @returns Initials (up to 2 characters)
 */
export function getInitials(name: string) {
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
}

/**
 * Debounces a function call
 *
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Checks if a value is empty (null, undefined, empty string, empty array, empty object)
 *
 * @param value - Value to check
 * @returns True if empty
 */
export function isEmpty(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Capitalizes the first letter of a string
 *
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Generates a random ID
 *
 * @param length - Length of the ID (default: 8)
 * @returns Random ID string
 */
export function generateId(length = 8) {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Calculates reading time for text
 *
 * @param text - Text to analyze
 * @param wordsPerMinute - Reading speed (default: 200)
 * @returns Reading time in minutes
 */
export function calculateReadingTime(text: string, wordsPerMinute = 200) {
  const wordCount = text.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime;
}

/**
 * Sleep utility for async functions
 *
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after the specified time
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Type guard for checking if a value is a non-null object
 *
 * @param value - Value to check
 * @returns True if value is a non-null object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Deep merge two objects
 *
 * @param target - Target object
 * @param source - Source object
 * @returns Merged object
 */
export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>
): T {
  const result = { ...target };

  for (const key in source) {
    const targetValue = result[key];
    const sourceValue = source[key];

    if (isObject(targetValue) && isObject(sourceValue)) {
      result[key] = deepMerge(
        targetValue as Record<string, unknown>,
        sourceValue
      ) as T[Extract<keyof T, string>];
    } else {
      result[key] = sourceValue as T[Extract<keyof T, string>];
    }
  }

  return result;
}

// Lightweight analytics emitter (no external deps). Replace with real client later.
export type AnalyticsEvent =
  | 'booking_view'
  | 'booking_slot_selected'
  | 'booking_form_submitted';

export function track(event: AnalyticsEvent, payload?: Record<string, unknown>) {
  try {
    const body = {
      event,
      payload: payload ?? {},
      ts: Date.now(),
      path: typeof window !== 'undefined' ? window.location.pathname : '',
    };
    // eslint-disable-next-line no-console
    console.debug('[analytics]', body);
  } catch {
    // noop
  }
}
