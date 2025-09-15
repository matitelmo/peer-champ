/**
 * Test Auth Status Page
 *
 * Simple page to test and debug authentication status
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';

export default function TestAuthStatusPage() {
  const { user, loading, signOut } = useAuth();
  const [session, setSession] = useState<any>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session error:', error);
        } else {
          setSession(data.session);
        }
      } catch (err) {
        console.error('Session fetch error:', err);
      } finally {
        setSessionLoading(false);
      }
    };

    getSession();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setSession(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading || sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Authentication Status Test
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Context */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              User Context (useAuth)
            </h2>
            
            {user ? (
              <div className="space-y-3">
                <Alert variant="success">
                  <div>
                    <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                      ✅ User Authenticated
                    </h3>
                    <div className="text-green-700 dark:text-green-300 space-y-1">
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>ID:</strong> {user.id}</p>
                      <p><strong>Email Confirmed:</strong> {user.email_confirmed_at ? 'Yes' : 'No'}</p>
                      <p><strong>Confirmed At:</strong> {user.email_confirmed_at || 'Not confirmed'}</p>
                      <p><strong>Created At:</strong> {user.created_at}</p>
                    </div>
                  </div>
                </Alert>
                
                <Button onClick={handleSignOut} variant="outline" className="w-full">
                  Sign Out
                </Button>
              </div>
            ) : (
              <Alert variant="error">
                <div>
                  <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                    ❌ No User
                  </h3>
                  <p className="text-red-700 dark:text-red-300">
                    User is not authenticated
                  </p>
                </div>
              </Alert>
            )}
          </div>

          {/* Session Data */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Session Data (Supabase)
            </h2>
            
            {session ? (
              <div className="space-y-3">
                <Alert variant="success">
                  <div>
                    <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                      ✅ Session Active
                    </h3>
                    <div className="text-green-700 dark:text-green-300 space-y-1">
                      <p><strong>Access Token:</strong> {session.access_token ? 'Present' : 'Missing'}</p>
                      <p><strong>Refresh Token:</strong> {session.refresh_token ? 'Present' : 'Missing'}</p>
                      <p><strong>Expires At:</strong> {new Date(session.expires_at * 1000).toLocaleString()}</p>
                      <p><strong>User ID:</strong> {session.user?.id}</p>
                    </div>
                  </div>
                </Alert>
              </div>
            ) : (
              <Alert variant="error">
                <div>
                  <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                    ❌ No Session
                  </h3>
                  <p className="text-red-700 dark:text-red-300">
                    No active session found
                  </p>
                </div>
              </Alert>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => window.location.href = '/auth/signin'}
              variant="outline"
              className="w-full"
            >
              Go to Sign In
            </Button>
            
            <Button 
              onClick={() => window.location.href = '/auth/signup'}
              variant="outline"
              className="w-full"
            >
              Go to Sign Up
            </Button>
            
            <Button 
              onClick={() => window.location.href = '/dashboard'}
              variant="outline"
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Debug Information
          </h2>
          
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
            <p><strong>User Agent:</strong> {typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A'}</p>
            <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
