'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const navigation = [
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
];

export function Navigation() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = href;
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-medium-gray dark:bg-regalBlue-900 dark:border-regalBlue-700">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-brand flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold text-regalBlue-700 dark:text-white">
                PeerChamps
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-amaranth-500 dark:hover:text-amaranth-400 cursor-pointer',
                  pathname === item.href
                    ? 'text-amaranth-500 dark:text-amaranth-400'
                    : 'text-regalBlue-700 dark:text-regalBlue-300'
                )}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => signOut()}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
