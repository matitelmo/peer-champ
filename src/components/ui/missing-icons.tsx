/**
 * Missing Icon Components
 * 
 * Icons that were missing from the main icons file
 */

import React from 'react';

// Define IconProps interface locally
interface IconProps {
  className?: string;
  size?: number;
}

export const DocumentIcon = ({ className, size }: IconProps) => (
  <svg
    className={className}
    fill="none"
    height={size || 24}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width={size || 24}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
    <path d="M10 9H8" />
  </svg>
);

export const AcademicCapIcon = ({ className, size }: IconProps) => (
  <svg
    className={className}
    fill="none"
    height={size || 24}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width={size || 24}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);
