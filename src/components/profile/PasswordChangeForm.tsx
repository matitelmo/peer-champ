/**
 * Password Change Form Component
 *
 * Allows users to change their password with current password verification.
 * Includes form validation, error handling, and loading states.
 */

'use client';

import React, { useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';

interface PasswordChangeFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordChangeFormProps {
  onSuccess?: () => void;
  className?: string;
}

export const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({
  onSuccess,
  className = '',
}) => {
  const { updatePassword } = useProfile();

  const [formData, setFormData] = useState<PasswordChangeFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Partial<PasswordChangeFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Partial<PasswordChangeFormData> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      newErrors.newPassword =
        'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword =
        'New password must be different from current password';
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

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const { success, error: updateError } = await updatePassword(
        formData.currentPassword,
        formData.newPassword
      );

      if (success) {
        setSubmitSuccess(true);
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        if (onSuccess) {
          onSuccess();
        }
        // Clear success message after 3 seconds
        setTimeout(() => setSubmitSuccess(false), 3000);
      } else {
        setSubmitError(updateError || 'Failed to update password');
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleInputChange =
    (field: keyof PasswordChangeFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }

      // Clear submit error
      if (submitError) {
        setSubmitError(null);
      }
    };

  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Change Password
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Update your password to keep your account secure.
        </p>
      </CardHeader>

      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Current Password
            </label>
            <Input
              id="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleInputChange('currentPassword')}
              placeholder="Enter your current password"
              error={!!errors.currentPassword}
              disabled={isSubmitting}
              className="w-full"
            />
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                {errors.currentPassword}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              New Password
            </label>
            <Input
              id="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleInputChange('newPassword')}
              placeholder="Enter your new password"
              error={!!errors.newPassword}
              disabled={isSubmitting}
              className="w-full"
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                {errors.newPassword}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Must be at least 8 characters with uppercase, lowercase, and
              number
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Confirm New Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              placeholder="Confirm your new password"
              error={!!errors.confirmPassword}
              disabled={isSubmitting}
              className="w-full"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Error */}
          {submitError && (
            <Alert variant="error" className="mb-4">
              {submitError}
            </Alert>
          )}

          {/* Submit Success */}
          {submitSuccess && (
            <Alert variant="success" className="mb-4">
              Password updated successfully!
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Updating Password...
              </>
            ) : (
              'Update Password'
            )}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

export default PasswordChangeForm;
