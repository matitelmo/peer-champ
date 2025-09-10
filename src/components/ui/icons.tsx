/**
 * Icon Components
 *
 * Common SVG icons used throughout the application.
 * All icons are designed to be 24x24 by default but can be resized with className.
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface IconProps {
  className?: string;
  size?: number;
}

// Base icon component
const BaseIcon = ({
  children,
  className,
  size = 24,
  ...props
}: IconProps & {
  children: React.ReactNode;
  viewBox?: string;
}) => (
  <svg
    className={cn('inline-block shrink-0', className)}
    fill="none"
    height={size}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {children}
  </svg>
);

// Common icons
export const PlusIcon = ({ className, size }: IconProps) => (
  <BaseIcon className={className} size={size}>
    <path d="M5 12h14" />
    <path d="m12 5v14" />
  </BaseIcon>
);

export const ChevronDownIcon = ({ className, size }: IconProps) => (
  <BaseIcon className={className} size={size}>
    <path d="m6 9 6 6 6-6" />
  </BaseIcon>
);

export const ChevronRightIcon = ({ className, size }: IconProps) => (
  <BaseIcon className={className} size={size}>
    <path d="m9 18 6-6-6-6" />
  </BaseIcon>
);

export const ChevronLeftIcon = ({ className, size }: IconProps) => (
  <BaseIcon className={className} size={size}>
    <path d="m15 18-6-6 6-6" />
  </BaseIcon>
);

export const SearchIcon = ({ className, size }: IconProps) => (
  <BaseIcon className={className} size={size}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </BaseIcon>
);

export const EditIcon = ({ className, size }: IconProps) => (
  <BaseIcon className={className} size={size}>
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </BaseIcon>
);

export const TrashIcon = ({ className, size }: IconProps) => (
  <BaseIcon className={className} size={size}>
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </BaseIcon>
);

export const SaveIcon = ({ className, size }: IconProps) => (
  <BaseIcon className={className} size={size}>
    <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
    <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
    <path d="M7 3v4a1 1 0 0 0 1 1h8" />
  </BaseIcon>
);

export const CloseIcon = ({ className, size }: IconProps) => (
  <BaseIcon className={className} size={size}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </BaseIcon>
);

// Alias for CloseIcon
export const XIcon = CloseIcon;

export const CheckIcon = ({ className, size }: IconProps) => (
  <BaseIcon className={className} size={size}>
    <path d="M20 6 9 17l-5-5" />
  </BaseIcon>
);

export const AlertTriangleIcon = ({ className, size }: IconProps) => (
  <BaseIcon className={className} size={size}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="m12 17.02.01 0" />
  </BaseIcon>
);

export const InfoIcon = ({ className, size }: IconProps) => (
  <BaseIcon className={className} size={size}>
    <circle cx="12" cy="12" r="10" />
    <path d="m12 16v-4" />
    <path d="m12 8h.01" />
  </BaseIcon>
);

export const SettingsIcon = ({ className, size }: IconProps) => (
  <BaseIcon className={className} size={size}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2Z" />
    <circle cx="12" cy="12" r="3" />
  </BaseIcon>
);

export const UserIcon = ({ className, size }: IconProps) => (
  <BaseIcon className={className} size={size}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </BaseIcon>
);

export const MenuIcon = ({ className, size }: IconProps) => (
  <BaseIcon className={className} size={size}>
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </BaseIcon>
);

export const ExternalLinkIcon = ({ className, size }: IconProps) => (
  <BaseIcon className={className} size={size}>
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </BaseIcon>
);

export const DownloadIcon = ({ className, size }: IconProps) => (
  <BaseIcon className={className} size={size}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7,10 12,15 17,10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </BaseIcon>
);

export const UploadIcon = ({ className, size }: IconProps) => (
  <BaseIcon className={className} size={size}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17,8 12,3 7,8" />
    <line x1="12" x2="12" y1="3" y2="15" />
  </BaseIcon>
);

export const RefreshIcon = ({ className, size }: IconProps) => (
  <BaseIcon className={className} size={size}>
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M8 16H3v5" />
  </BaseIcon>
);

export const EyeIcon = ({ className, size }: IconProps) => (
  <BaseIcon className={className} size={size}>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </BaseIcon>
);

export const EyeOffIcon = ({ className, size }: IconProps) => (
  <BaseIcon className={className} size={size}>
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </BaseIcon>
);

export const CopyIcon = ({ className, size }: IconProps) => (
  <BaseIcon className={className} size={size}>
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </BaseIcon>
);

export const FilterIcon = ({ className, size }: IconProps) => (
  <BaseIcon className={className} size={size}>
    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3" />
  </BaseIcon>
);

export const SortIcon = ({ className, size }: IconProps) => (
  <BaseIcon className={className} size={size}>
    <path d="M3 6h18" />
    <path d="M7 12h10" />
    <path d="M10 18h4" />
  </BaseIcon>
);

export const CalendarIcon = ({ className, size }: IconProps) => (
  <BaseIcon className={className} size={size}>
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </BaseIcon>
);

export const ChartBarIcon = ({ className, size }: IconProps) => (
  <BaseIcon className={className} size={size}>
    <line x1="12" x2="12" y1="20" y2="10" />
    <line x1="18" x2="18" y1="20" y2="4" />
    <line x1="6" x2="6" y1="20" y2="16" />
  </BaseIcon>
);

export const UsersIcon = ({ className, size }: IconProps) => (
  <BaseIcon className={className} size={size}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </BaseIcon>
);

export const MailIcon = ({ className, size }: IconProps) => (
  <BaseIcon className={className} size={size}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-10 5L2 7" />
  </BaseIcon>
);

export const LockIcon = ({ className, size }: IconProps) => (
  <BaseIcon className={className} size={size}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <circle cx="12" cy="16" r="1" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </BaseIcon>
);

export const TrendingUpIcon = ({ className, size }: IconProps) => (
  <BaseIcon className={className} size={size}>
    <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </BaseIcon>
);

export const TrendingDownIcon = ({ className, size }: IconProps) => (
  <BaseIcon className={className} size={size}>
    <path d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
  </BaseIcon>
);

// Export all icons as a group for easier importing
export const Icons = {
  Plus: PlusIcon,
  ChevronDown: ChevronDownIcon,
  ChevronRight: ChevronRightIcon,
  ChevronLeft: ChevronLeftIcon,
  Search: SearchIcon,
  Edit: EditIcon,
  Trash: TrashIcon,
  Save: SaveIcon,
  Close: CloseIcon,
  X: XIcon,
  Check: CheckIcon,
  AlertTriangle: AlertTriangleIcon,
  Info: InfoIcon,
  Settings: SettingsIcon,
  User: UserIcon,
  Users: UsersIcon,
  Mail: MailIcon,
  Lock: LockIcon,
  TrendingUp: TrendingUpIcon,
  TrendingDown: TrendingDownIcon,
  Menu: MenuIcon,
  ExternalLink: ExternalLinkIcon,
  Download: DownloadIcon,
  Upload: UploadIcon,
  Refresh: RefreshIcon,
  Eye: EyeIcon,
  EyeOff: EyeOffIcon,
  Copy: CopyIcon,
  Filter: FilterIcon,
  Sort: SortIcon,
  Calendar: CalendarIcon,
  ChartBar: ChartBarIcon,
};
