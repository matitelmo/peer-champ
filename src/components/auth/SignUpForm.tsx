/**
 * Sign Up Form Component
 *
 * Handles user registration with email, password, and optional user details.
 * Includes form validation, error handling, and loading states.
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';

interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface SignUpFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
  className?: string;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  onSuccess,
  redirectTo = '/auth/verify-email',
  className = '',
}) => {
  const { signUp } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Partial<SignUpFormData>>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Partial<SignUpFormData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setAuthError(null);

    try {
      const { error } = await signUp(formData.email, formData.password, {
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      if (error) {
        setAuthError(error.message || 'An error occurred during sign up');
      } else {
        // Success - redirect or call onSuccess
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(redirectTo);
        }
      }
    } catch (error) {
      setAuthError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange =
    (field: keyof SignUpFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        e.target.type === 'checkbox' ? e.target.checked : e.target.value;

      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }

      // Clear auth error
      if (authError) {
        setAuthError(null);
      }
    };

  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create Account
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Join PeerChamps and start connecting with advocates.
        </p>
      </CardHeader>

      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                First Name
              </label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange('firstName')}
                placeholder="First name"
                variant={!!errors.firstName ? "error" : "default"}
                disabled={isLoading}
                className="w-full"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                  {errors.firstName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Last Name
              </label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange('lastName')}
                placeholder="Last name"
                variant={!!errors.lastName ? "error" : "default"}
                disabled={isLoading}
                className="w-full"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              placeholder="Enter your email"
              variant={!!errors.email ? "error" : "default"}
              disabled={isLoading}
              className="w-full"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange('password')}
              placeholder="Create a password"
              variant={!!errors.password ? "error" : "default"}
              disabled={isLoading}
              className="w-full"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                {errors.password}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Must be at least 8 characters with uppercase, lowercase, and
              number
            </p>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              placeholder="Confirm your password"
              variant={!!errors.confirmPassword ? "error" : "default"}
              disabled={isLoading}
              className="w-full"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Terms Agreement */}
          <div>
            <label className="flex items-start">
              <input
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={handleInputChange('agreeToTerms')}
                disabled={isLoading}
                className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                I agree to the{' '}
                <a
                  href="/terms"
                  className="text-primary-600 hover:text-primary-500"
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href="/privacy"
                  className="text-primary-600 hover:text-primary-500"
                >
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.agreeToTerms && (
              <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                You must agree to the terms and conditions
              </p>
            )}
          </div>

          {/* Auth Error */}
          {authError && (
            <Alert variant="error" className="mb-4">
              {authError}
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <a
              href="/auth/signin"
              className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Sign in here
            </a>
          </p>
        </div>
      </CardBody>
    </Card>
  );
};

export default SignUpForm;
