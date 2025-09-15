/**
 * AuthLayout Demo Component
 *
 * A simplified demo showcasing the AuthLayout component.
 */

'use client';

import React, { useState } from 'react';
import { AuthNavigation } from './layouts';
import {
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardDescription,
  Section,
  Container,
  Checkbox,
  Button,
} from './ui';

const AuthLayoutDemo: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentFlow, setCurrentFlow] = useState<
    'signin' | 'signup' | 'forgot-password' | 'reset-password'
  >('signin');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 2000);
  };

  const renderAuthForm = () => {
    switch (currentFlow) {
      case 'signin':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Welcome Back</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Sign in to your account to continue
              </p>
            </div>
            <Input
              type="email"
              placeholder="Enter your email"
              label="Email"
              required
            />
            <Input
              type="password"
              placeholder="Enter your password"
              label="Password"
              required
            />
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
            <div className="text-center">
              <span className="text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
              </span>
              <button
                type="button"
                className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
                onClick={() => setCurrentFlow('signup')}
              >
                Sign up
              </button>
            </div>
          </form>
        );

      case 'signup':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Create Account</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Join PeerChamps and start your learning journey
              </p>
            </div>
            <Input
              type="email"
              placeholder="Enter your email"
              label="Email"
              required
            />
            <Input
              type="password"
              placeholder="Create a password"
              label="Password"
              required
            />
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
            <div className="text-center">
              <span className="text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
              </span>
              <button
                type="button"
                className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
                onClick={() => setCurrentFlow('signin')}
              >
                Sign in
              </button>
            </div>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <Section
        title="AuthLayout Component"
        description="A comprehensive layout component for authentication pages."
      />

      <Container>
        <Card>
          <CardHeader>
            <CardTitle>Interactive AuthLayout Demo</CardTitle>
            <CardDescription>
              Live demonstration of the AuthLayout component with different
              authentication flows.
            </CardDescription>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium">Auth Flow Navigation:</h4>
              <AuthNavigation
                currentFlow={currentFlow}
                onFlowChange={setCurrentFlow}
              />
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Current Form:</h4>
              <div className="border rounded-lg p-6 bg-gray-50 dark:bg-gray-800">
                {renderAuthForm()}
              </div>
            </div>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default AuthLayoutDemo;
