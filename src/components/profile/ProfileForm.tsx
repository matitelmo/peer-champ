/**
 * Profile Form Component
 *
 * Allows users to view and edit their profile information.
 * Includes form validation, error handling, and loading states.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import type { UserRole } from '@/hooks/useRBAC';

interface ProfileFormData {
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  profile: {
    department?: string;
    phone?: string;
    bio?: string;
    timezone?: string;
    language?: string;
  };
}

interface ProfileFormProps {
  onSuccess?: () => void;
  className?: string;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  onSuccess,
  className = '',
}) => {
  const { profile, loading, error, updateProfile } = useProfile();

  const [formData, setFormData] = useState<ProfileFormData>({
    first_name: '',
    last_name: '',
    email: '',
    role: 'sales_rep',
    profile: {
      department: '',
      phone: '',
      bio: '',
      timezone: 'America/New_York',
      language: 'en',
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        role: profile.role || 'sales_rep',
        profile: {
          department: String(profile.profile?.department || ''),
          phone: String(profile.profile?.phone || ''),
          bio: String(profile.profile?.bio || ''),
          timezone: String(profile.profile?.timezone || 'America/New_York'),
          language: String(profile.profile?.language || 'en'),
        },
      });
    }
  }, [profile]);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
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
      const { success, error: updateError } = await updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        role: formData.role,
        profile: formData.profile,
      });

      if (success) {
        setSubmitSuccess(true);
        if (onSuccess) {
          onSuccess();
        }
        // Clear success message after 3 seconds
        setTimeout(() => setSubmitSuccess(false), 3000);
      } else {
        setSubmitError(updateError || 'Failed to update profile');
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleInputChange =
    (field: keyof ProfileFormData) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const value = e.target.value;

      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => { const newErrors = { ...prev }; delete newErrors[field]; return newErrors; });
      }
    };


  // Handle profile object changes
  const handleProfileChange =
    (field: keyof ProfileFormData['profile']) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const value = e.target.value;

      setFormData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          [field]: value,
        },
      }));
    };

  // Handle select changes (for Select component that takes string value)
  const handleSelectChange =
    (field: keyof ProfileFormData) =>
    (value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Clear error when user selects
      if (errors[field]) {
        setErrors((prev) => { const newErrors = { ...prev }; delete newErrors[field]; return newErrors; });
      }

      // Clear submit error
      if (submitError) {
        setSubmitError(null);
      }

    };
  // Handle profile select changes (for Select component that takes string value)
  const handleProfileSelectChange =
    (field: keyof ProfileFormData['profile']) =>
    (value: string) => {
      setFormData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          [field]: value,
        },
      }));

      // Clear error when user selects
      if (errors[field]) {
        setErrors((prev) => { const newErrors = { ...prev }; delete newErrors[field]; return newErrors; });
      }

      // Clear submit error
      if (submitError) {
        setSubmitError(null);
      }
    };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error" className="mb-4">
        {error}
      </Alert>
    );
  }

  return (
    <Card className={`w-full max-w-2xl mx-auto ${className}`}>
      <CardHeader>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Profile Settings
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Update your personal information and preferences.
        </p>
      </CardHeader>

      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Basic Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="first_name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  First Name
                </label>
                <Input
                  id="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={handleInputChange('first_name')}
                  placeholder="Enter your first name"
                  variant={errors.first_name ? 'error' : 'default'}
                  disabled={isSubmitting}
                  className="w-full"
                />
                {errors.first_name && (
                  <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                    {errors.first_name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="last_name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Last Name
                </label>
                <Input
                  id="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={handleInputChange('last_name')}
                  placeholder="Enter your last name"
                  variant={errors.last_name ? 'error' : 'default'}
                  disabled={isSubmitting}
                  className="w-full"
                />
                {errors.last_name && (
                  <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                    {errors.last_name}
                  </p>
                )}
              </div>
            </div>

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
                variant={errors.email ? 'error' : 'default'}
                disabled={isSubmitting}
                className="w-full"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Role
              </label>
              <Select
                id="role"
                value={formData.role}
                onChange={handleSelectChange('role')}
                variant={errors.role ? 'error' : 'default'}
                disabled={isSubmitting}
                className="w-full"
                options={[
                  { value: "sales_rep", label: "Sales Representative" },
                  { value: "admin", label: "Administrator" },
                  { value: "advocate", label: "Advocate" }
                ]}
              />
              {errors.role && (
                <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                  {errors.role}
                </p>
              )}
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Professional Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="department"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Department
                </label>
                <Input
                  id="department"
                  type="text"
                  value={formData.profile.department || ''}
                  onChange={handleProfileChange('department')}
                  placeholder="e.g., Sales, Marketing"
                  disabled={isSubmitting}
                  className="w-full"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Phone Number
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.profile.phone || ''}
                  onChange={handleProfileChange('phone')}
                  placeholder="+1 (555) 123-4567"
                  disabled={isSubmitting}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Bio
              </label>
              <textarea
                id="bio"
                value={formData.profile.bio || ''}
                onChange={handleProfileChange('bio')}
                placeholder="Tell us about yourself..."
                disabled={isSubmitting}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Preferences
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="timezone"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Timezone
                </label>
                <Select
                  id="timezone"
                  value={formData.profile.timezone || 'America/New_York'}
                  onChange={handleProfileSelectChange('timezone')}
                  disabled={isSubmitting}
                  className="w-full"
                  options={[
                    { value: "America/New_York", label: "Eastern Time" },
                    { value: "America/Chicago", label: "Central Time" },
                    { value: "America/Denver", label: "Mountain Time" },
                    { value: "America/Los_Angeles", label: "Pacific Time" },
                    { value: "Europe/London", label: "London" },
                    { value: "Europe/Paris", label: "Paris" },
                    { value: "Asia/Tokyo", label: "Tokyo" },
                    { value: "Asia/Shanghai", label: "Shanghai" }
                  ]}
                />
              </div>
              <div>
                <label
                  htmlFor="language"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Language
                </label>
                <Select
                  id="language"
                  value={formData.profile.language || 'en'}
                  onChange={handleProfileSelectChange('language')}
                  disabled={isSubmitting}
                  className="w-full"
                  options={[
                    { value: "en", label: "English" },
                    { value: "es", label: "Spanish" },
                    { value: "fr", label: "French" },
                    { value: "de", label: "German" },
                    { value: "it", label: "Italian" },
                    { value: "pt", label: "Portuguese" },
                    { value: "zh", label: "Chinese" },
                    { value: "ja", label: "Japanese" }
                  ]}
                />
              </div>
            </div>
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
              Profile updated successfully!
            </Alert>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Updating...
                </>
              ) : (
                'Update Profile'
              )}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export default ProfileForm;
