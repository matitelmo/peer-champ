/**
 * Authentication Flow Test Page
 *
 * A simple page to test the complete authentication flow
 * and debug any issues.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { supabase } from '@/lib/supabase';

export default function TestAuthFlowPage() {
  const { user, loading, signOut } = useAuth();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testSupabaseConnection = async () => {
    try {
      addTestResult('Testing Supabase connection...');
      const { data, error } = await supabase.from('users').select('count').limit(1);
      if (error) {
        addTestResult(`❌ Supabase connection failed: ${error.message}`);
      } else {
        addTestResult('✅ Supabase connection successful');
      }
    } catch (error) {
      addTestResult(`❌ Supabase connection error: ${error}`);
    }
  };

  const testEmailVerification = async () => {
    if (!user?.email) {
      addTestResult('❌ No user email available for verification test');
      return;
    }

    try {
      addTestResult('Testing email verification resend...');
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });
      
      if (error) {
        addTestResult(`❌ Email verification resend failed: ${error.message}`);
      } else {
        addTestResult('✅ Email verification resend successful');
      }
    } catch (error) {
      addTestResult(`❌ Email verification error: ${error}`);
    }
  };

  useEffect(() => {
    addTestResult('Auth flow test page loaded');
    if (user) {
      addTestResult(`✅ User authenticated: ${user.email}`);
      addTestResult(`Email confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`);
    } else {
      addTestResult('❌ No user authenticated');
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Authentication Flow Test
        </h1>

        {/* User Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Current User Status
          </h2>
          {user ? (
            <div className="space-y-2">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Email Confirmed:</strong> {user.email_confirmed_at ? 'Yes' : 'No'}</p>
              <p><strong>User ID:</strong> {user.id}</p>
              <p><strong>Created At:</strong> {user.created_at}</p>
              <p><strong>Last Sign In:</strong> {user.last_sign_in_at}</p>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No user authenticated</p>
          )}
        </div>

        {/* Test Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Test Actions
          </h2>
          <div className="space-y-4">
            <Button onClick={testSupabaseConnection} variant="outline">
              Test Supabase Connection
            </Button>
            <Button onClick={testEmailVerification} variant="outline" disabled={!user}>
              Test Email Verification
            </Button>
            {user && (
              <Button onClick={signOut} variant="outline">
                Sign Out
              </Button>
            )}
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Test Results
          </h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono text-gray-700 dark:text-gray-300">
                {result}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex space-x-4">
          <Button onClick={() => window.location.href = '/auth/signup'}>
            Go to Signup
          </Button>
          <Button onClick={() => window.location.href = '/auth/signin'}>
            Go to Signin
          </Button>
          <Button onClick={() => window.location.href = '/auth/verify-email'}>
            Go to Verify Email
          </Button>
          {user && (
            <Button onClick={() => window.location.href = '/dashboard'}>
              Go to Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
