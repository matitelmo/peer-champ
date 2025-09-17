/**
 * Company Setup Step Component
 * 
 * Second step of the onboarding flow - collects company information
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { BuildingOfficeIcon, CheckIcon } from '@/components/ui/icons';
import { useOnboarding } from '../OnboardingFlow';

interface CompanySetupStepProps {
  onNext: () => void;
  onPrevious: () => void;
  onComplete: (data: any) => void;
  onSkip: () => void;
  data?: any;
  isOptional?: boolean;
}

const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Financial Services',
  'Manufacturing',
  'Retail',
  'Education',
  'Real Estate',
  'Consulting',
  'Marketing & Advertising',
  'Other',
];

const COMPANY_SIZES = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '501-1000 employees',
  '1000+ employees',
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

const CURRENCIES = [
  'USD',
  'EUR',
  'GBP',
  'CAD',
  'AUD',
  'JPY',
  'CHF',
  'SEK',
  'NOK',
  'DKK',
];

export const CompanySetupStep: React.FC<CompanySetupStepProps> = ({
  onNext,
  onPrevious,
  onComplete,
}) => {
  const { updateData, setIsLoading, setError } = useOnboarding();
  
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    industry: '',
    company_size: '',
    timezone: 'UTC',
    currency: 'USD',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Company name is required');
      return false;
    }

    if (!formData.domain.trim()) {
      setError('Company domain is required');
      return false;
    }

    // Basic domain validation
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(formData.domain)) {
      setError('Please enter a valid domain (e.g., example.com)');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Update onboarding data
      updateData({ company: formData });
      onComplete(formData);
      onNext();
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save company information';
      setError(errorMessage);
      console.error('Error saving company info:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
          <BuildingOfficeIcon size={32} className="text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Tell us about your company
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          This information helps us customize your PeerChamps experience
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Name */}
        <Input
          label="Company Name *"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter your company name"
          required
        />

        {/* Company Domain */}
        <Input
          label="Company Domain *"
          value={formData.domain}
          onChange={(e) => handleInputChange('domain', e.target.value)}
          placeholder="example.com"
          required
        />

        {/* Industry and Company Size */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Industry
            </label>
            <select
              value={formData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select your industry</option>
              {INDUSTRIES.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Company Size
            </label>
            <select
              value={formData.company_size}
              onChange={(e) => handleInputChange('company_size', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select company size</option>
              {COMPANY_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Timezone and Currency */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Timezone
            </label>
            <select
              value={formData.timezone}
              onChange={(e) => handleInputChange('timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Currency
            </label>
            <select
              value={formData.currency}
              onChange={(e) => handleInputChange('currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {CURRENCIES.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Help Text */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            <strong>Why we need this:</strong> This information helps us customize your experience, 
            suggest relevant features, and ensure proper timezone handling for your reference calls.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
            className="flex-1"
          >
            Previous
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Saving...
              </>
            ) : (
              <>
                <CheckIcon size={16} className="mr-2" />
                Continue
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
