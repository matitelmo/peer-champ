/**
 * Advocate Setup Step Component
 * 
 * Sixth step of the onboarding flow - adds initial customer advocates
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { UserIcon, PlusIcon, CheckIcon, XIcon } from '@/components/ui/icons';
import { useOnboarding } from '../OnboardingFlow';

interface AdvocateSetupStepProps {
  onNext: () => void;
  onPrevious: () => void;
  onComplete: (data: any) => void;
  onSkip: () => void;
  data?: any;
  isOptional?: boolean;
}

interface Advocate {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  industry: string;
  use_cases: string[];
}

const INDUSTRIES = [
  'Technology', 'Healthcare', 'Financial Services', 'Manufacturing', 
  'Retail', 'Education', 'Real Estate', 'Consulting', 'Other'
];

const USE_CASES = [
  'Sales Automation', 'Customer Support', 'Marketing', 'Analytics',
  'Integration', 'Security', 'Compliance', 'Scalability', 'Other'
];

export const AdvocateSetupStep: React.FC<AdvocateSetupStepProps> = ({
  onNext,
  onPrevious,
  onComplete,
  onSkip,
  isOptional = true,
}) => {
  const { companyId, updateData, setIsLoading, setError } = useOnboarding();
  
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [currentAdvocate, setCurrentAdvocate] = useState({
    name: '',
    title: '',
    company: '',
    email: '',
    industry: '',
    use_cases: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setCurrentAdvocate(prev => ({ ...prev, [field]: value }));
  };

  const handleUseCaseToggle = (useCase: string) => {
    setCurrentAdvocate(prev => ({
      ...prev,
      use_cases: prev.use_cases.includes(useCase)
        ? prev.use_cases.filter(uc => uc !== useCase)
        : [...prev.use_cases, useCase]
    }));
  };

  const validateAdvocate = () => {
    if (!currentAdvocate.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!currentAdvocate.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!currentAdvocate.company.trim()) {
      setError('Company is required');
      return false;
    }
    return true;
  };

  const addAdvocate = () => {
    if (!validateAdvocate()) return;

    const newAdvocate: Advocate = {
      id: Date.now().toString(),
      ...currentAdvocate,
    };

    setAdvocates(prev => [...prev, newAdvocate]);
    setCurrentAdvocate({
      name: '',
      title: '',
      company: '',
      email: '',
      industry: '',
      use_cases: [],
    });
    setError(null);
  };

  const removeAdvocate = (id: string) => {
    setAdvocates(prev => prev.filter(adv => adv.id !== id));
  };

  const handleSubmit = async () => {
    if (advocates.length === 0) {
      onComplete({ advocates: [] });
      onNext();
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setIsLoading(true);

      const response = await fetch('/api/onboarding/advocates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: companyId,
          advocates: advocates.map(adv => ({
            name: adv.name,
            title: adv.title,
            company: adv.company,
            email: adv.email,
            industry: adv.industry,
            use_cases: adv.use_cases,
          })),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save advocates');
      }

      updateData({ advocates });
      onComplete({ advocates });
      onNext();
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save advocates';
      setError(errorMessage);
      console.error('Error saving advocates:', err);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    onComplete({ advocates: [] });
    onSkip();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
          <UserIcon size={32} className="text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Add your customer advocates
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Add your satisfied customers who can serve as references
        </p>
      </div>

      {/* Add Advocate Form */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Add Customer Advocate
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Name *"
              value={currentAdvocate.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="John Doe"
            />
            <Input
              label="Title"
              value={currentAdvocate.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="VP of Sales"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Company *"
              value={currentAdvocate.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              placeholder="Acme Corp"
            />
            <Input
              label="Email *"
              type="email"
              value={currentAdvocate.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="john@acme.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Industry
            </label>
            <select
              value={currentAdvocate.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select industry</option>
              {INDUSTRIES.map((industry) => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Use Cases
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {USE_CASES.map((useCase) => (
                <button
                  key={useCase}
                  type="button"
                  onClick={() => handleUseCaseToggle(useCase)}
                  className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                    currentAdvocate.use_cases.includes(useCase)
                      ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  {useCase}
                </button>
              ))}
            </div>
          </div>

          <Button
            type="button"
            onClick={addAdvocate}
            variant="outline"
            className="w-full"
          >
            <PlusIcon size={16} className="mr-2" />
            Add Advocate
          </Button>
        </div>
      </div>

      {/* Advocates List */}
      {advocates.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Added Advocates ({advocates.length})
          </h3>
          
          <div className="space-y-3">
            {advocates.map((advocate) => (
              <div
                key={advocate.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <UserIcon size={20} className="text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {advocate.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {advocate.title} at {advocate.company}
                    </p>
                  </div>
                </div>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeAdvocate(advocate.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                >
                  <XIcon size={16} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
        <p className="text-blue-800 dark:text-blue-200 text-sm">
          <strong>Tip:</strong> You can add more advocates later from your dashboard. 
          These initial advocates will help you get started with your first reference calls.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          className="flex-1"
        >
          Previous
        </Button>
        
        {isOptional && (
          <Button
            type="button"
            variant="outline"
            onClick={handleSkip}
            className="flex-1"
          >
            Skip for Now
          </Button>
        )}
        
        <Button
          type="button"
          onClick={handleSubmit}
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
    </div>
  );
};
