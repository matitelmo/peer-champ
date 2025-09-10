/**
 * AuthLayout Demo Component
 *
 * A comprehensive demo showcasing the AuthLayout component with various
 * configurations and use cases for authentication flows.
 */

'use client';

import React, { useState } from 'react';
import { AuthNavigation, AuthForm } from './layouts';
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
} from './ui';

const AuthLayoutDemo: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    'login' | 'register' | 'forgot-password'
  >('login');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => setIsSubmitting(false), 2000);
  };

  const renderAuthForm = () => {
    switch (currentStep) {
      case 'login':
        return (
          <AuthForm
            title="Welcome Back"
            description="Sign in to your account to continue"
            submitText="Sign In"
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            actions={
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center">
                    <Checkbox />
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      Remember me
                    </span>
                  </label>
                  <button
                    type="button"
                    className="text-primary-600 hover:text-primary-500 dark:text-primary-400"
                    onClick={() => setCurrentStep('forgot-password')}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="text-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    {`Don't have an account?`}{' '}
                  </span>
                  <button
                    type="button"
                    className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
                    onClick={() => setCurrentStep('register')}
                  >
                    Sign up
                  </button>
                </div>
              </div>
            }
          >
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
          </AuthForm>
        );

      case 'register':
        return (
          <AuthForm
            title="Create Account"
            description="Join PeerChamps and start your learning journey"
            submitText="Create Account"
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            actions={
              <div className="text-center">
                <span className="text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                </span>
                <button
                  type="button"
                  className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
                  onClick={() => setCurrentStep('login')}
                >
                  Sign in
                </button>
              </div>
            }
          >
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="text"
                placeholder="First name"
                label="First Name"
                required
              />
              <Input
                type="text"
                placeholder="Last name"
                label="Last Name"
                required
              />
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
            <Input
              type="password"
              placeholder="Confirm your password"
              label="Confirm Password"
              required
            />
            <div className="flex items-start">
              <Checkbox className="mt-1" />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                I agree to the{' '}
                <a
                  href="#"
                  className="text-primary-600 hover:text-primary-500 dark:text-primary-400"
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href="#"
                  className="text-primary-600 hover:text-primary-500 dark:text-primary-400"
                >
                  Privacy Policy
                </a>
              </span>
            </div>
          </AuthForm>
        );

      case 'forgot-password':
        return (
          <AuthForm
            title="Reset Password"
            description={`Enter your email address and we'll send you a link to reset your password`}
            submitText="Send Reset Link"
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            actions={
              <div className="text-center">
                <span className="text-gray-600 dark:text-gray-400">
                  Remember your password?{' '}
                </span>
                <button
                  type="button"
                  className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
                  onClick={() => setCurrentStep('login')}
                >
                  Sign in
                </button>
              </div>
            }
          >
            <Input
              type="email"
              placeholder="Enter your email"
              label="Email"
              required
            />
          </AuthForm>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <Section
        title="AuthLayout Component"
        description="A comprehensive layout component for authentication pages with centered content, branding, and responsive behavior."
      />

      {/* AuthLayout Variants */}
      <Container>
        <Card>
          <CardHeader>
            <CardTitle>AuthLayout Variants</CardTitle>
            <CardDescription>
              Different background variants and sizes for various authentication
              scenarios.
            </CardDescription>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium">Background Variants:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Default (Gradient)</h5>
                  <div className="h-32 rounded-lg bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 border flex items-center justify-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Default Variant
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Minimal</h5>
                  <div className="h-32 rounded-lg bg-white dark:bg-gray-900 border flex items-center justify-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Minimal Variant
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Gradient</h5>
                  <div className="h-32 rounded-lg bg-gradient-to-br from-primary-100 via-secondary-100 to-accent-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 border flex items-center justify-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Gradient Variant
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Dark</h5>
                  <div className="h-32 rounded-lg bg-gray-900 dark:bg-black border flex items-center justify-center">
                    <span className="text-sm text-white">Dark Variant</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Size Variants:</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {['sm', 'md', 'lg', 'xl', '2xl'].map((size) => (
                  <div key={size} className="space-y-2">
                    <h5 className="text-sm font-medium capitalize">{size}</h5>
                    <div
                      className={`h-16 rounded border bg-gray-50 dark:bg-gray-800 flex items-center justify-center ${
                        size === 'sm'
                          ? 'max-w-sm'
                          : size === 'md'
                            ? 'max-w-md'
                            : size === 'lg'
                              ? 'max-w-lg'
                              : size === 'xl'
                                ? 'max-w-xl'
                                : 'max-w-2xl'
                      }`}
                    >
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {size}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      </Container>

      {/* Interactive AuthLayout Demo */}
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
                currentStep={currentStep}
                items={[
                  { key: 'login', label: 'Sign In', href: '#' },
                  { key: 'register', label: 'Sign Up', href: '#' },
                  {
                    key: 'forgot-password',
                    label: 'Reset Password',
                    href: '#',
                  },
                ]}
              />
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Current Form:</h4>
              <div className="border rounded-lg p-6 bg-gray-50 dark:bg-gray-800">
                {renderAuthForm()}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Layout Features:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">
                    ✅ Implemented Features:
                  </h5>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Centered card container for auth forms</li>
                    <li>• Branding area with logo</li>
                    <li>• Background styling options</li>
                    <li>• Responsive behavior for mobile devices</li>
                    <li>• Support for additional information sections</li>
                    <li>• Navigation for auth flows</li>
                    <li>• Back button and help link support</li>
                    <li>• Custom header and footer content</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">🎨 Styling Features:</h5>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Multiple background variants</li>
                    <li>• Configurable card sizes</li>
                    <li>• Dark mode support</li>
                    <li>• Backdrop blur effects</li>
                    <li>• Gradient backgrounds</li>
                    <li>• Responsive typography</li>
                    <li>• Consistent spacing</li>
                    <li>• Accessibility compliance</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </Container>

      {/* Usage Examples */}
      <Container>
        <Card>
          <CardHeader>
            <CardTitle>Usage Examples</CardTitle>
            <CardDescription>
              Common implementation patterns and use cases for the AuthLayout
              component.
            </CardDescription>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium">Basic Login Page:</h4>
              <div className="p-4 border rounded-lg bg-secondary-50 dark:bg-secondary-900/20">
                <pre className="text-sm text-gray-700 dark:text-gray-300 overflow-x-auto">
                  {`<AuthLayout
  title="Welcome Back"
  subtitle="Sign in to your account"
  showBackButton
  onBack={() => router.back()}
>
  <AuthForm submitText="Sign In">
    <Input type="email" label="Email" required />
    <Input type="password" label="Password" required />
  </AuthForm>
</AuthLayout>`}
                </pre>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">
                Registration Page with Custom Logo:
              </h4>
              <div className="p-4 border rounded-lg bg-secondary-50 dark:bg-secondary-900/20">
                <pre className="text-sm text-gray-700 dark:text-gray-300 overflow-x-auto">
                  {`<AuthLayout
  variant="gradient"
  size="lg"
  title="Join PeerChamps"
  subtitle="Create your account to get started"
  logo={<CustomLogo />}
  additionalInfo={<TermsAndConditions />}
>
  <AuthForm submitText="Create Account">
    {/* Registration form fields */}
  </AuthForm>
</AuthLayout>`}
                </pre>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Password Reset with Help Link:</h4>
              <div className="p-4 border rounded-lg bg-secondary-50 dark:bg-secondary-900/20">
                <pre className="text-sm text-gray-700 dark:text-gray-300 overflow-x-auto">
                  {`<AuthLayout
  variant="minimal"
  title="Reset Password"
  showHelp
  helpUrl="/support"
  helpLabel="Contact Support"
>
  <AuthForm submitText="Send Reset Link">
    <Input type="email" label="Email" required />
  </AuthForm>
</AuthLayout>`}
                </pre>
              </div>
            </div>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default AuthLayoutDemo;
