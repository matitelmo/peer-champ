/**
 * Authentication Test Component
 * 
 * This component helps test the authentication system during development.
 * It provides buttons to test signup, signin, and other auth functions.
 */

'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Input } from '@/components/ui/Input';

export const AuthTest: React.FC = () => {
  const { user, loading, signIn, signUp, signOut } = useAuth();
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testPassword, setTestPassword] = useState('testpassword123');
  const [testFirstName, setTestFirstName] = useState('Test');
  const [testLastName, setTestLastName] = useState('User');
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTestSignUp = async () => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      const { error } = await signUp(testEmail, testPassword, {
        firstName: testFirstName,
        lastName: testLastName,
      });
      
      if (error) {
        setMessage(`Sign up error: ${error.message}`);
      } else {
        setMessage('Sign up successful! Check your email for verification.');
      }
    } catch (error) {
      setMessage(`Unexpected error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestSignIn = async () => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      const { error } = await signIn(testEmail, testPassword);
      
      if (error) {
        setMessage(`Sign in error: ${error.message}`);
      } else {
        setMessage('Sign in successful!');
      }
    } catch (error) {
      setMessage(`Unexpected error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestSignOut = async () => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      await signOut();
      setMessage('Sign out successful!');
    } catch (error) {
      setMessage(`Sign out error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Authentication Test Panel
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Test the authentication system during development
        </p>
      </CardHeader>
      
      <CardBody className="space-y-6">
        {/* Current Auth State */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            Current Auth State:
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
            <p><strong>User:</strong> {user ? user.email : 'Not signed in'}</p>
            <p><strong>Email Verified:</strong> {user?.email_confirmed_at ? 'Yes' : 'No'}</p>
            <p><strong>User ID:</strong> {user?.id || 'N/A'}</p>
          </div>
        </div>

        {/* Test Form */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              First Name
            </label>
            <Input
              value={testFirstName}
              onChange={(e) => setTestFirstName(e.target.value)}
              placeholder="First name"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Last Name
            </label>
            <Input
              value={testLastName}
              onChange={(e) => setTestLastName(e.target.value)}
              placeholder="Last name"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <Input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="test@example.com"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <Input
            type="password"
            value={testPassword}
            onChange={(e) => setTestPassword(e.target.value)}
            placeholder="Password"
            disabled={isLoading}
          />
        </div>

        {/* Test Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleTestSignUp}
            disabled={isLoading}
            variant="outline"
          >
            Test Sign Up
          </Button>
          
          <Button
            onClick={handleTestSignIn}
            disabled={isLoading}
            variant="outline"
          >
            Test Sign In
          </Button>
          
          {user && (
            <Button
              onClick={handleTestSignOut}
              disabled={isLoading}
              variant="outline"
            >
              Test Sign Out
            </Button>
          )}
        </div>

        {/* Message Display */}
        {message && (
          <Alert variant={message.includes('error') || message.includes('Error') ? 'error' : 'success'}>
            {message}
          </Alert>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Testing Instructions:
          </h4>
          <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
            <li>Make sure your Supabase project is set up and .env.local is configured</li>
            <li>Run the database migrations in Supabase SQL Editor</li>
            <li>Test sign up with a new email address</li>
            <li>Check your email for verification link</li>
            <li>Test sign in after email verification</li>
            <li>Test sign out functionality</li>
          </ol>
        </div>
      </CardBody>
    </Card>
  );
};

export default AuthTest;
