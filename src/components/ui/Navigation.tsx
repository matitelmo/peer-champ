/**
 * Navigation Components
 *
 * Comprehensive navigation components including navbar, sidebar, breadcrumbs,
 * tabs, and pagination for building complete navigation systems.
 */

'use client';

import React, { useState, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './Button';
import {
  Bars3Icon,
  XMarkIcon,
  ChevronRightIcon,
  HomeIcon,
  UserIcon,
  Cog6ToothIcon,
  BellIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

// Types
export interface NavItem {
  label: string;
  href: string;
  icon?: ReactNode;
  badge?: string | number;
  children?: NavItem[];
  disabled?: boolean;
  external?: boolean;
}

export interface NavbarProps {
  brand?: {
    logo?: ReactNode;
    name: string;
    href?: string;
  };
  items: NavItem[];
  user?: {
    name: string;
    email: string;
    avatar?: string;
    menu?: NavItem[];
  };
  search?: {
    placeholder?: string;
    onSearch?: (query: string) => void;
  };
  notifications?: {
    count: number;
    onClick?: () => void;
  };
  className?: string;
  variant?: 'default' | 'transparent' | 'bordered';
  size?: 'sm' | 'md' | 'lg';
}

export interface SidebarProps {
  items: NavItem[];
  user?: {
    name: string;
    email: string;
    avatar?: string;
    menu?: NavItem[];
  };
  collapsed?: boolean;
  onToggle?: () => void;
  className?: string;
  variant?: 'default' | 'minimal' | 'floating';
}

export interface BreadcrumbProps {
  items: Array<{
    label: string;
    href?: string;
    icon?: ReactNode;
  }>;
  separator?: ReactNode;
  className?: string;
}

export interface TabsProps {
  items: Array<{
    label: string;
    value: string;
    icon?: ReactNode;
    badge?: string | number;
    disabled?: boolean;
  }>;
  value: string;
  onChange: (value: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Navbar Component
export const Navbar: React.FC<NavbarProps> = ({
  brand,
  items,
  user,
  search,
  notifications,
  className = '',
  variant = 'default',
  size = 'md',
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const getVariantClasses = () => {
    switch (variant) {
      case 'transparent':
        return 'bg-transparent';
      case 'bordered':
        return 'bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700';
      default:
        return 'bg-white dark:bg-gray-800 shadow-sm';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-12';
      case 'lg':
        return 'h-16';
      default:
        return 'h-14';
    }
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <nav className={`${getVariantClasses()} ${getSizeClasses()} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-full">
          {/* Brand */}
          <div className="flex items-center">
            {brand && (
              <Link
                href={brand.href || '/'}
                className="flex items-center space-x-2 text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {brand.logo && (
                  <div className="flex-shrink-0">{brand.logo}</div>
                )}
                <span className="font-semibold text-lg">{brand.name}</span>
              </Link>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {items.map((item) => (
              <div key={item.href} className="relative group">
                <Link
                  href={item.href}
                  className={`
                    flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${
                      isActive(item.href)
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                        : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }
                    ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {item.icon && (
                    <div className="flex-shrink-0">{item.icon}</div>
                  )}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </div>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            {search && (
              <div className="hidden lg:block">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={search.placeholder || 'Search...'}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    onChange={(e) => search.onSearch?.(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Notifications */}
            {notifications && (
              <button
                onClick={notifications.onClick}
                className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <BellIcon className="h-5 w-5" />
                {notifications.count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.count > 9 ? '9+' : notifications.count}
                  </span>
                )}
              </button>
            )}

            {/* User Menu */}
            {user && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <div className="hidden lg:block">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
            <div className="space-y-2">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${
                      isActive(item.href)
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                        : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }
                    ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon && (
                    <div className="flex-shrink-0">{item.icon}</div>
                  )}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Sidebar Component
export const Sidebar: React.FC<SidebarProps> = ({
  items,
  user,
  collapsed = false,
  onToggle,
  className = '',
  variant = 'default',
}) => {
  const pathname = usePathname();

  const getVariantClasses = () => {
    switch (variant) {
      case 'minimal':
        return 'bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700';
      case 'floating':
        return 'bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700';
      default:
        return 'bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700';
    }
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <div className={`${getVariantClasses()} ${className}`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {!collapsed && (
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Navigation
            </h2>
          )}
          {onToggle && (
            <button
              onClick={onToggle}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {items.map((item) => (
            <div key={item.href}>
              <Link
                href={item.href}
                className={`
                  flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${
                    isActive(item.href)
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }
                  ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  ${collapsed ? 'justify-center' : ''}
                `}
              >
                {item.icon && <div className="flex-shrink-0">{item.icon}</div>}
                {!collapsed && (
                  <>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            </div>
          ))}
        </nav>

        {/* User Section */}
        {user && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div
              className={`flex items-center space-x-3 ${collapsed ? 'justify-center' : ''}`}
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-white" />
                </div>
              )}
              {!collapsed && (
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Breadcrumb Component
export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = <ChevronRightIcon className="h-4 w-4 text-gray-400" />,
  className = '',
}) => {
  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <div className="flex-shrink-0">{separator}</div>}
          <div className="flex items-center space-x-1">
            {item.icon && <div className="flex-shrink-0">{item.icon}</div>}
            {item.href ? (
              <Link
                href={item.href}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 dark:text-white font-medium">
                {item.label}
              </span>
            )}
          </div>
        </React.Fragment>
      ))}
    </nav>
  );
};

// Tabs Component
export const Tabs: React.FC<TabsProps> = ({
  items,
  value,
  onChange,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'pills':
        return 'bg-gray-100 dark:bg-gray-700 p-1 rounded-lg';
      case 'underline':
        return 'border-b border-gray-200 dark:border-gray-700';
      default:
        return 'bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'lg':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  const getTabClasses = (item: any) => {
    const isActive = value === item.value;

    switch (variant) {
      case 'pills':
        return `
          px-4 py-2 rounded-md font-medium transition-colors
          ${
            isActive
              ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }
          ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `;
      case 'underline':
        return `
          px-4 py-2 border-b-2 font-medium transition-colors
          ${
            isActive
              ? 'border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'
          }
          ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `;
      default:
        return `
          px-4 py-2 border-b-2 font-medium transition-colors
          ${
            isActive
              ? 'border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'
          }
          ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `;
    }
  };

  return (
    <div className={`${getVariantClasses()} ${getSizeClasses()} ${className}`}>
      <div className="flex space-x-1">
        {items.map((item) => (
          <button
            key={item.value}
            onClick={() => !item.disabled && onChange(item.value)}
            className={getTabClasses(item)}
          >
            <div className="flex items-center space-x-2">
              {item.icon && <div className="flex-shrink-0">{item.icon}</div>}
              <span>{item.label}</span>
              {item.badge && (
                <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1">
                  {item.badge}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
