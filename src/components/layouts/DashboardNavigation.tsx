/**
 * Dashboard Navigation Component
 *
 * Main navigation component for the dashboard with links to all major features.
 * Provides role-based navigation and user context.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui';
import {
  HomeIcon,
  BuildingOfficeIcon,
  UsersIcon,
  PhoneIcon,
  ChartBarIcon,
  UserIcon,
  CalendarIcon,
} from '@/components/ui/icons';

interface DashboardNavigationProps {
  className?: string;
}

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    description: 'Overview and analytics',
  },
  {
    name: 'Opportunities',
    href: '/opportunities',
    icon: BuildingOfficeIcon,
    description: 'Manage sales opportunities',
  },
  {
    name: 'Advocates',
    href: '/advocates',
    icon: UsersIcon,
    description: 'Customer advocate management',
  },
  {
    name: 'Case Studies',
    href: '/case-studies',
    icon: UserIcon, // Using UserIcon as placeholder
    description: 'Manage case studies and success stories',
  },
  {
    name: 'Scheduling',
    href: '/scheduling',
    icon: CalendarIcon,
    description: 'Schedule reference calls',
  },
  {
    name: 'Reference Calls',
    href: '/reference-calls',
    icon: PhoneIcon,
    description: 'Schedule and track calls',
  },
  {
    name: 'Matching',
    href: '/matching',
    icon: ChartBarIcon,
    description: 'AI-powered advocate matching',
  },
  {
    name: 'Onboarding',
    href: '/onboarding',
    icon: UserIcon, // Using UserIcon as placeholder
    description: 'Company setup and user invitation',
  },
];

const userMenuItems = [
  {
    name: 'Profile',
    href: '/profile',
    icon: UserIcon,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: UserIcon,
  },
  {
    name: 'Notifications',
    href: '/notifications',
    icon: UserIcon,
  },
];

export const DashboardNavigation: React.FC<DashboardNavigationProps> = ({
  className = '',
}) => {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <nav className={cn('bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Main Navigation */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-brand flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                PeerChamps
              </span>
            </Link>

            {/* Main Navigation Links */}
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'border-amaranth-500 text-gray-900 dark:text-white'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    )}
                    title={item.description}
                  >
                    <item.icon size={16} className="mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.email}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.user_metadata?.role || 'User'}
                </p>
              </div>
            </div>

            {/* User Menu Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                <UserIcon size={20} />
                <span className="hidden md:block text-sm font-medium">Account</span>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {userMenuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <item.icon size={16} className="mr-3" />
                    {item.name}
                  </Link>
                ))}
                <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                <button
                  onClick={() => signOut()}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span className="mr-3">🚪</span>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors',
                  isActive
                    ? 'bg-amaranth-50 text-amaranth-700 dark:bg-amaranth-900 dark:text-amaranth-300'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300'
                )}
              >
                <item.icon size={20} className="mr-3" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
