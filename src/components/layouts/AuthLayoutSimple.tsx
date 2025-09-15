/**
 * Simple AuthLayout Component
 *
 * A simplified layout component for authentication pages with better desktop support.
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Container } from '../ui/Container';

export interface AuthLayoutSimpleProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

// Default logo component
const DefaultLogo = () => (
  <div className="flex items-center justify-center mb-8">
    <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
      <span className="text-white font-bold text-xl">P</span>
    </div>
    <div className="ml-3">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        PeerChamps
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Connect. Learn. Grow.
      </p>
    </div>
  </div>
);

export const AuthLayoutSimple: React.FC<AuthLayoutSimpleProps> = ({
  children,
  title,
  subtitle,
  className,
}) => {
  return (
    <div className={cn(
      'min-h-screen flex flex-col',
      'bg-gradient-to-br from-primary-50 to-secondary-50',
      'dark:from-gray-900 dark:to-gray-800',
      className
    )}>
      {/* Main content area */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Container className="w-full" size="full">
          <div className="flex justify-center w-full">
            <div className="w-full max-w-6xl">
              {/* Desktop: Two-column layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left side - Branding */}
                <div className="hidden lg:block">
                  <div className="text-center lg:text-left">
                    <DefaultLogo />
                    <div className="mt-8">
                      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {title || 'Welcome to PeerChamps'}
                      </h1>
                      <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                        {subtitle || 'Connect with industry advocates and accelerate your growth'}
                      </p>
                      <div className="space-y-4 text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                          <span>Connect with verified industry experts</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                          <span>Get personalized recommendations</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                          <span>Join a community of professionals</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right side - Auth Form */}
                <div className="w-full">
                  <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                    <CardHeader className="text-center pb-6">
                      <div className="lg:hidden mb-4">
                        <DefaultLogo />
                      </div>
                      {title && (
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {title}
                        </h2>
                      )}
                      {subtitle && (
                        <p className="text-gray-600 dark:text-gray-400">
                          {subtitle}
                        </p>
                      )}
                    </CardHeader>

                    <CardBody className="px-6 pb-6">{children}</CardBody>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© 2024 PeerChamps. All rights reserved.</p>
      </footer>
    </div>
  );
};
