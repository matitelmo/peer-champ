/**
 * Advocate Profile Form
 *
 * Form component for viewing and editing advocate profiles.
 * Handles form validation, submission, and error states.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useAdvocates } from '@/hooks/useAdvocates';
import { UpdateAdvocateData } from '@/lib/services/advocateService';import {
  Advocate,

  AdvocateStatus,
  CompanySize,
  RewardType,
} from '@/types/database';
import {
  Button,
  Input,
  Textarea,
  Select,
  Checkbox,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardDescription,
  Alert,
  LoadingButton,
  Badge,
} from '@/components/ui';
import {
  UserIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  StarIcon,
  CalendarIcon,
  PhoneIcon,
  EnvelopeIcon,
} from '@/components/ui/icons';

interface AdvocateProfileFormProps {
  advocateId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
}

const COMPANY_SIZES: { value: CompanySize; label: string }[] = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '501-1000', label: '501-1000 employees' },
  { value: '1000+', label: '1000+ employees' },
];

const STATUS_OPTIONS: { value: AdvocateStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
  { value: 'blacklisted', label: 'Blacklisted' },
];

const REWARD_TYPES: { value: RewardType; label: string }[] = [
  { value: 'gift_card', label: 'Gift Card' },
  { value: 'donation', label: 'Charitable Donation' },
  { value: 'company_swag', label: 'Company Swag' },
  { value: 'cash', label: 'Cash Payment' },
];

const COMMON_USE_CASES = [
  'API Integration',
  'Data Analytics',
  'Cloud Migration',
  'Process Automation',
  'Quality Control',
  'Supply Chain',
  'Customer Experience',
  'Digital Transformation',
  'Security Implementation',
  'Performance Optimization',
];

const COMMON_EXPERTISE_AREAS = [
  'Technical Architecture',
  'Enterprise Integration',
  'Cloud Computing',
  'Operations Management',
  'Process Optimization',
  'Quality Assurance',
  'Data Management',
  'Security',
  'DevOps',
  'Business Intelligence',
];

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney',
];

const LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Portuguese',
  'Chinese',
  'Japanese',
  'Korean',
  'Arabic',
];

export const AdvocateProfileForm: React.FC<AdvocateProfileFormProps> = ({
  advocateId,
  onSuccess,
  onCancel,
  className = '',
}) => {
  const {
    currentAdvocate,
    loading,
    updating,
    error,
    fetchAdvocate,
    updateAdvocateData,
  } = useAdvocates();

  // Form state
  const [formData, setFormData] = useState<UpdateAdvocateData>({});
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [hasChanges, setHasChanges] = useState(false);

  // Load advocate data
  useEffect(() => {
    if (advocateId) {
      fetchAdvocate(advocateId);
    }
  }, [advocateId, fetchAdvocate]);

  // Initialize form data when advocate is loaded
  useEffect(() => {
    if (currentAdvocate) {
      setFormData({
        name: currentAdvocate.name,
        email: currentAdvocate.email,
        title: currentAdvocate.title ?? undefined,
        company_name: currentAdvocate.company_name ?? undefined,
        phone: currentAdvocate.phone ?? undefined,
        industry: currentAdvocate.industry ?? undefined,
        company_size: currentAdvocate.company_size ?? undefined,
        geographic_region: currentAdvocate.geographic_region ?? undefined,
        use_cases: currentAdvocate.use_cases ?? undefined,
        expertise_areas: currentAdvocate.expertise_areas ?? undefined,
        success_stories: currentAdvocate.success_stories ?? undefined,
        max_calls_per_month: currentAdvocate.max_calls_per_month ?? undefined,
        preferred_call_times: currentAdvocate.preferred_call_times ?? undefined,
        timezone: currentAdvocate.timezone ?? undefined,
        languages: currentAdvocate.languages ?? undefined,
        call_duration_preference: currentAdvocate.call_duration_preference ?? undefined,
        preferred_reward_type: currentAdvocate.preferred_reward_type ?? undefined,
        internal_notes: currentAdvocate.internal_notes ?? undefined,
        tags: currentAdvocate.tags ?? undefined,
        status: currentAdvocate.status,
      });
      setHasChanges(false);
    }
  }, [currentAdvocate]);

  // Handle input changes
  const handleInputChange = (field: keyof UpdateAdvocateData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Handle array field changes
  const handleArrayFieldChange = (
    field: keyof UpdateAdvocateData,
    value: string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);

    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Handle checkbox changes for arrays
  const handleCheckboxChange = (
    field: keyof UpdateAdvocateData,
    value: string,
    checked: boolean
  ) => {
    const currentArray = (formData[field] as string[]) || [];
    const newArray = checked
      ? [...currentArray, value]
      : currentArray.filter((item) => item !== value);

    handleArrayFieldChange(field, newArray);
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.company_name?.trim()) {
      errors.company_name = 'Company name is required';
    }

    if (!formData.industry?.trim()) {
      errors.industry = 'Industry is required';
    }

    if (!formData.company_size) {
      errors.company_size = 'Company size is required';
    }

    if (!formData.geographic_region?.trim()) {
      errors.geographic_region = 'Geographic region is required';
    }

    if (!formData.use_cases || formData.use_cases.length === 0) {
      errors.use_cases = 'At least one use case is required';
    }

    if (!formData.expertise_areas || formData.expertise_areas.length === 0) {
      errors.expertise_areas = 'At least one expertise area is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await updateAdvocateData(advocateId, formData);
      setHasChanges(false);
      onSuccess?.();
    } catch (err) {
      // Error is handled by the hook
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading advocate profile...</p>
        </div>
      </div>
    );
  }

  if (!currentAdvocate) {
    return (
      <Alert variant="error">Advocate not found or failed to load.</Alert>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {currentAdvocate.name}
          </h2>
          <p className="text-gray-600">
            {currentAdvocate.title} at {currentAdvocate.company_name}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Badge
            variant={
              currentAdvocate.status === 'active' ? 'success' : 'secondary'
            }
          >
            {currentAdvocate.status}
          </Badge>
          <Badge
            variant={
              currentAdvocate.availability_score >= 80 ? 'success' : 'warning'
            }
          >
            {currentAdvocate.availability_score}% available
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {currentAdvocate.total_calls_completed}
            </div>
            <div className="text-sm text-gray-600">Calls Completed</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {currentAdvocate.max_calls_per_month}
            </div>
            <div className="text-sm text-gray-600">Max Calls/Month</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {currentAdvocate.average_rating
                ? currentAdvocate.average_rating.toFixed(1)
                : 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              ${currentAdvocate.total_rewards_earned.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Total Rewards</div>
          </CardBody>
        </Card>
      </div>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>
            Update advocate information and preferences.
          </CardDescription>
        </CardHeader>

        <CardBody>
          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    label="Full Name *"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    variant={validationErrors.name ? "error" : "default"}
                  />
                </div>

                <div>
                  <Input
                    label="Email Address *"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    variant={validationErrors.email ? "error" : "default"}
                  />
                </div>

                <div>
                  <Input
                    label="Job Title"
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>

                <div>
                  <Input
                    label="Phone Number"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Company Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    label="Company Name *"
                    value={formData.company_name || ''}
                    onChange={(e) =>
                      handleInputChange('company_name', e.target.value)
                    }
                    variant={validationErrors.company_name ? "error" : "default"}
                  />
                </div>

                <div>
                  <Input
                    label="Industry *"
                    value={formData.industry || ''}
                    onChange={(e) =>
                      handleInputChange('industry', e.target.value)
                    }
                    variant={validationErrors.industry ? "error" : "default"}
                  />
                </div>

                <div>
                  <Select
                    label="Company Size *"
                    value={formData.company_size || ''}
                    onChange={(value) =>
                      handleInputChange('company_size', value as CompanySize)
                    }
                    variant={validationErrors.company_size ? "error" : "default"}
                    options={COMPANY_SIZES}
                  />
                </div>

                <div>
                  <Input
                    label="Geographic Region *"
                    value={formData.geographic_region || ''}
                    onChange={(e) =>
                      handleInputChange('geographic_region', e.target.value)
                    }
                    variant={validationErrors.geographic_region ? "error" : "default"}
                  />
                </div>
              </div>
            </div>

            {/* Expertise and Use Cases */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Expertise & Use Cases</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Use Cases *{' '}
                  {validationErrors.use_cases && (
                    <span className="text-red-500">
                      ({validationErrors.use_cases})
                    </span>
                  )}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {COMMON_USE_CASES.map((useCase) => (
                    <Checkbox
                      key={useCase}
                      label={useCase}
                      checked={formData.use_cases?.includes(useCase) || false}
                      onChange={(e) =>
                        handleCheckboxChange('use_cases', useCase, e.target.checked)
                      }
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expertise Areas *{' '}
                  {validationErrors.expertise_areas && (
                    <span className="text-red-500">
                      ({validationErrors.expertise_areas})
                    </span>
                  )}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {COMMON_EXPERTISE_AREAS.map((area) => (
                    <Checkbox
                      key={area}
                      label={area}
                      checked={
                        formData.expertise_areas?.includes(area) || false
                      }
                      onChange={(e) =>
                        handleCheckboxChange('expertise_areas', area, e.target.checked)
                      }
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Preferences</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Select
                    label="Status"
                    value={formData.status || 'active'}
                    onChange={(value) =>
                      handleInputChange('status', value as AdvocateStatus)
                    }
                    options={STATUS_OPTIONS}
                  />
                </div>

                <div>
                  <Select
                    label="Max Calls Per Month"
                    value={formData.max_calls_per_month?.toString() || '4'}
                    onChange={(value) =>
                      handleInputChange('max_calls_per_month', parseInt(value))
                    }
                    options={[
                      { value: '1', label: '1 call' },
                      { value: '2', label: '2 calls' },
                      { value: '4', label: '4 calls' },
                      { value: '6', label: '6 calls' },
                      { value: '8', label: '8 calls' },
                      { value: '10', label: '10 calls' },
                    ]}
                  />
                </div>

                <div>
                  <Select
                    label="Call Duration Preference"
                    value={
                      formData.call_duration_preference?.toString() || '30'
                    }
                    onChange={(value) =>
                      handleInputChange(
                        'call_duration_preference',
                        parseInt(value)
                      )
                    }
                    options={[
                      { value: '15', label: '15 minutes' },
                      { value: '30', label: '30 minutes' },
                      { value: '45', label: '45 minutes' },
                      { value: '60', label: '60 minutes' },
                    ]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Select
                    label="Timezone"
                    value={formData.timezone || 'UTC'}
                    onChange={(value) => handleInputChange('timezone', value)}
                    options={TIMEZONES.map((tz) => ({ value: tz, label: tz }))}
                  />
                </div>

                <div>
                  <Select
                    label="Preferred Reward Type"
                    value={formData.preferred_reward_type || 'gift_card'}
                    onChange={(value) =>
                      handleInputChange(
                        'preferred_reward_type',
                        value as RewardType
                      )
                    }
                    options={REWARD_TYPES}
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Information</h3>

              <div>
                <Textarea
                  label="Internal Notes"
                  value={formData.internal_notes || ''}
                  onChange={(e) =>
                    handleInputChange('internal_notes', e.target.value)
                  }
                  placeholder="Any additional notes about this advocate..."
                  rows={3}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={updating}
                >
                  Cancel
                </Button>
              )}

              <LoadingButton
                type="submit"
                loading={updating}
                disabled={updating || !hasChanges}
              >
                {updating ? 'Saving...' : 'Save Changes'}
              </LoadingButton>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};
