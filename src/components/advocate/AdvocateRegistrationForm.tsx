/**
 * Advocate Registration Form
 *
 * Form component for registering new customer advocates.
 * Handles form validation, submission, and error states.
 */

'use client';

import React, { useState } from 'react';
import { useAdvocates } from '@/hooks/useAdvocates';
import { CreateAdvocateData } from '@/lib/services/advocateService';
import { CompanySize, RewardType } from '@/types/database';
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
  Spinner,
  LoadingButton,
} from '@/components/ui';

interface AdvocateRegistrationFormProps {
  onSuccess?: (advocateId: string) => void;
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

export const AdvocateRegistrationForm: React.FC<
  AdvocateRegistrationFormProps
> = ({ onSuccess, onCancel, className = '' }) => {
  const { createNewAdvocate, creating, error } = useAdvocates();

  // Form state
  const [formData, setFormData] = useState<CreateAdvocateData>({
    name: '',
    email: '',
    title: '',
    company_name: '',
    phone: '',
    industry: '',
    company_size: undefined,
    geographic_region: '',
    use_cases: [],
    expertise_areas: [],
    success_stories: [],
    max_calls_per_month: 4,
    preferred_call_times: [],
    timezone: 'UTC',
    languages: ['English'],
    call_duration_preference: 30,
    preferred_reward_type: 'gift_card',
    internal_notes: '',
    tags: [],
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Handle input changes
  const handleInputChange = (field: keyof CreateAdvocateData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Handle array field changes (use cases, expertise areas, etc.)
  const handleArrayFieldChange = (
    field: keyof CreateAdvocateData,
    value: string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Handle checkbox changes for arrays
  const handleCheckboxChange = (
    field: keyof CreateAdvocateData,
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

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
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
      const newAdvocate = await createNewAdvocate(formData);
      onSuccess?.(newAdvocate.id);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  return (
    <Card className={`w-full max-w-4xl mx-auto ${className}`}>
      <CardHeader>
        <CardTitle>Register New Advocate</CardTitle>
        <CardDescription>
          Add a new customer advocate to your reference program. All fields
          marked with * are required.
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
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  variant={validationErrors.name ? "error" : "default"}
                  placeholder="John Smith"
                />
              </div>

              <div>
                <Input
                  label="Email Address *"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  variant={validationErrors.email ? "error" : "default"}
                  placeholder="john.smith@company.com"
                />
              </div>

              <div>
                <Input
                  label="Job Title"
                  value={formData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Chief Technology Officer"
                />
              </div>

              <div>
                <Input
                  label="Phone Number"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
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
                  placeholder="Acme Corporation"
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
                  placeholder="Software, Manufacturing, Healthcare, etc."
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
                  placeholder="Select company size"
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
                  placeholder="North America, Europe, Asia-Pacific, etc."
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
                    checked={formData.expertise_areas?.includes(area) || false}
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
                  value={formData.call_duration_preference?.toString() || '30'}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Languages
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map((language) => (
                    <Checkbox
                      key={language}
                      label={language}
                      checked={formData.languages?.includes(language) || false}
                      onChange={(e) =>
                        handleCheckboxChange('languages', language, e.target.checked)
                      }
                    />
                  ))}
                </div>
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
                disabled={creating}
              >
                Cancel
              </Button>
            )}

            <LoadingButton type="submit" loading={creating} disabled={creating}>
              {creating ? 'Creating Advocate...' : 'Create Advocate'}
            </LoadingButton>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};
