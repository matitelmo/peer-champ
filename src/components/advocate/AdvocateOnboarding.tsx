/**
 * Advocate Onboarding Component
 * 
 * Multi-step onboarding wizard for new advocates with verification,
 * training materials, and compliance checks.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button, Card, CardHeader, CardTitle, CardBody, Input, Select, Alert, Progress, Badge } from '@/components/ui';
import { 
  CheckIcon, 
  ArrowRightIcon, 
  ArrowLeftIcon, 
  DocumentIcon,
  UserIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  ClockIcon,
  UploadIcon
} from '@/components/ui/icons';
import { cn } from '@/lib/utils';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<OnboardingStepProps>;
  isCompleted: boolean;
  isRequired: boolean;
}

interface OnboardingStepProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
}

interface OnboardingData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  title: string;
  company: string;
  industry: string;
  companySize: string;
  location: string;
  
  // Professional Information
  experience: string;
  expertise: string[];
  useCases: string[];
  availability: string;
  timezone: string;
  
  // Verification
  linkedinProfile: string;
  companyEmail: string;
  verificationDocuments: File[];
  
  // Training
  trainingCompleted: boolean;
  knowledgeCheckPassed: boolean;
  complianceAgreed: boolean;
  
  // Preferences
  communicationPreferences: string[];
  rewardPreferences: string;
  maxCallsPerMonth: number;
}

interface AdvocateOnboardingProps {
  onComplete?: (data: OnboardingData) => void;
  onCancel?: () => void;
  className?: string;
}

const INDUSTRY_OPTIONS = [
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance' },
  { value: 'education', label: 'Education' },
  { value: 'retail', label: 'Retail' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'other', label: 'Other' },
];

const COMPANY_SIZE_OPTIONS = [
  { value: 'startup', label: 'Startup (1-10 employees)' },
  { value: 'small', label: 'Small (11-50 employees)' },
  { value: 'medium', label: 'Medium (51-200 employees)' },
  { value: 'large', label: 'Large (201-1000 employees)' },
  { value: 'enterprise', label: 'Enterprise (1000+ employees)' },
];

const EXPERTISE_OPTIONS = [
  'Sales & Marketing',
  'Product Management',
  'Engineering',
  'Customer Success',
  'Operations',
  'Finance',
  'HR',
  'Legal',
  'Security',
  'Data Analytics',
];

const USE_CASE_OPTIONS = [
  'Sales Automation',
  'Customer Relationship Management',
  'Marketing Automation',
  'Data Analytics',
  'Project Management',
  'Communication Tools',
  'Security Solutions',
  'Cloud Infrastructure',
  'Mobile Applications',
  'E-commerce',
];

// Step 1: Personal Information
const PersonalInformationStep: React.FC<OnboardingStepProps> = ({
  data,
  onUpdate,
  onNext,
  isFirst,
  isLast,
}) => {
  const [formData, setFormData] = useState({
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    email: data.email || '',
    phone: data.phone || '',
    title: data.title || '',
    company: data.company || '',
    industry: data.industry || '',
    companySize: data.companySize || '',
    location: data.location || '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    onUpdate(formData);
    onNext();
  };

  const isFormValid = formData.firstName && formData.lastName && formData.email && 
                     formData.title && formData.company && formData.industry;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <UserIcon size={48} className="mx-auto mb-4 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
        <p className="text-gray-600">Tell us about yourself and your company</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name *"
          value={formData.firstName}
          onChange={(e) => handleInputChange('firstName', e.target.value)}
          placeholder="Enter your first name"
        />
        <Input
          label="Last Name *"
          value={formData.lastName}
          onChange={(e) => handleInputChange('lastName', e.target.value)}
          placeholder="Enter your last name"
        />
        <Input
          label="Email Address *"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="Enter your email"
        />
        <Input
          label="Phone Number"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          placeholder="Enter your phone number"
        />
        <Input
          label="Job Title *"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Enter your job title"
        />
        <Input
          label="Company *"
          value={formData.company}
          onChange={(e) => handleInputChange('company', e.target.value)}
          placeholder="Enter your company name"
        />
        <Select
          label="Industry *"
          value={formData.industry}
          onChange={(value) => handleInputChange('industry', value)}
          options={INDUSTRY_OPTIONS}
          placeholder="Select your industry"
        />
        <Select
          label="Company Size"
          value={formData.companySize}
          onChange={(value) => handleInputChange('companySize', value)}
          options={COMPANY_SIZE_OPTIONS}
          placeholder="Select company size"
        />
        <Input
          label="Location"
          value={formData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          placeholder="Enter your location"
          className="md:col-span-2"
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={handleNext} disabled={!isFormValid}>
          Next Step
          <ArrowRightIcon size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

// Step 2: Professional Information
const ProfessionalInformationStep: React.FC<OnboardingStepProps> = ({
  data,
  onUpdate,
  onNext,
  onPrevious,
  isFirst,
  isLast,
}) => {
  const [formData, setFormData] = useState({
    experience: data.experience || '',
    expertise: data.expertise || [],
    useCases: data.useCases || [],
    availability: data.availability || '',
    timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    onUpdate(formData);
    onNext();
  };

  const handlePrevious = () => {
    onUpdate(formData);
    onPrevious();
  };

  const toggleArrayItem = (field: 'expertise' | 'useCases', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <AcademicCapIcon size={48} className="mx-auto mb-4 text-green-600" />
        <h3 className="text-xl font-semibold text-gray-900">Professional Information</h3>
        <p className="text-gray-600">Help us understand your expertise and availability</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Years of Experience
          </label>
          <Select
            value={formData.experience}
            onChange={(value) => handleInputChange('experience', value)}
            options={[
              { value: '0-2', label: '0-2 years' },
              { value: '3-5', label: '3-5 years' },
              { value: '6-10', label: '6-10 years' },
              { value: '11-15', label: '11-15 years' },
              { value: '15+', label: '15+ years' },
            ]}
            placeholder="Select experience level"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Areas of Expertise
          </label>
          <div className="grid grid-cols-2 gap-2">
            {EXPERTISE_OPTIONS.map((expertise) => (
              <label key={expertise} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.expertise.includes(expertise)}
                  onChange={() => toggleArrayItem('expertise', expertise)}
                  className="mr-2"
                />
                <span className="text-sm">{expertise}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Use Cases You Can Discuss
          </label>
          <div className="grid grid-cols-2 gap-2">
            {USE_CASE_OPTIONS.map((useCase) => (
              <label key={useCase} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.useCases.includes(useCase)}
                  onChange={() => toggleArrayItem('useCases', useCase)}
                  className="mr-2"
                />
                <span className="text-sm">{useCase}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Availability
            </label>
            <Select
              value={formData.availability}
              onChange={(value) => handleInputChange('availability', value)}
              options={[
                { value: 'flexible', label: 'Flexible' },
                { value: 'business-hours', label: 'Business Hours Only' },
                { value: 'evenings', label: 'Evenings Only' },
                { value: 'weekends', label: 'Weekends Only' },
              ]}
              placeholder="Select availability"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timezone
            </label>
            <Select
              value={formData.timezone}
              onChange={(value) => handleInputChange('timezone', value)}
              options={[
                { value: 'UTC', label: 'UTC' },
                { value: 'America/New_York', label: 'Eastern Time' },
                { value: 'America/Chicago', label: 'Central Time' },
                { value: 'America/Denver', label: 'Mountain Time' },
                { value: 'America/Los_Angeles', label: 'Pacific Time' },
                { value: 'Europe/London', label: 'London' },
                { value: 'Europe/Paris', label: 'Paris' },
                { value: 'Asia/Tokyo', label: 'Tokyo' },
              ]}
              placeholder="Select timezone"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious}>
          <ArrowLeftIcon size={16} className="mr-2" />
          Previous
        </Button>
        <Button onClick={handleNext}>
          Next Step
          <ArrowRightIcon size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

// Step 3: Verification
const VerificationStep: React.FC<OnboardingStepProps> = ({
  data,
  onUpdate,
  onNext,
  onPrevious,
  isFirst,
  isLast,
}) => {
  const [formData, setFormData] = useState({
    linkedinProfile: data.linkedinProfile || '',
    companyEmail: data.companyEmail || '',
    verificationDocuments: data.verificationDocuments || [],
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    onUpdate(formData);
    onNext();
  };

  const handlePrevious = () => {
    onUpdate(formData);
    onPrevious();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({
      ...prev,
      verificationDocuments: [...prev.verificationDocuments, ...files]
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      verificationDocuments: prev.verificationDocuments.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <ShieldCheckIcon size={48} className="mx-auto mb-4 text-purple-600" />
        <h3 className="text-xl font-semibold text-gray-900">Verification</h3>
        <p className="text-gray-600">Help us verify your identity and company affiliation</p>
      </div>

      <div className="space-y-6">
        <Input
          label="LinkedIn Profile URL"
          value={formData.linkedinProfile}
          onChange={(e) => handleInputChange('linkedinProfile', e.target.value)}
          placeholder="https://linkedin.com/in/yourprofile"
        />

        <Input
          label="Company Email Address"
          type="email"
          value={formData.companyEmail}
          onChange={(e) => handleInputChange('companyEmail', e.target.value)}
          placeholder="your.name@company.com"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Verification Documents (Optional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <UploadIcon size={24} className="mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600 mb-2">
              Upload business card, company ID, or other verification documents
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Choose Files
            </label>
          </div>
          
          {formData.verificationDocuments.length > 0 && (
            <div className="mt-4 space-y-2">
              {formData.verificationDocuments.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious}>
          <ArrowLeftIcon size={16} className="mr-2" />
          Previous
        </Button>
        <Button onClick={handleNext}>
          Next Step
          <ArrowRightIcon size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

// Step 4: Training & Compliance
const TrainingStep: React.FC<OnboardingStepProps> = ({
  data,
  onUpdate,
  onNext,
  onPrevious,
  isFirst,
  isLast,
}) => {
  const [formData, setFormData] = useState({
    trainingCompleted: data.trainingCompleted || false,
    knowledgeCheckPassed: data.knowledgeCheckPassed || false,
    complianceAgreed: data.complianceAgreed || false,
  });

  const handleInputChange = (field: string, value: boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    onUpdate(formData);
    onNext();
  };

  const handlePrevious = () => {
    onUpdate(formData);
    onPrevious();
  };

  const isFormValid = formData.trainingCompleted && formData.knowledgeCheckPassed && formData.complianceAgreed;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <AcademicCapIcon size={48} className="mx-auto mb-4 text-indigo-600" />
        <h3 className="text-xl font-semibold text-gray-900">Training & Compliance</h3>
        <p className="text-gray-600">Complete your training and agree to our terms</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardBody>
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={formData.trainingCompleted}
                onChange={(e) => handleInputChange('trainingCompleted', e.target.checked)}
                className="mt-1"
              />
              <div>
                <h4 className="font-medium text-gray-900">Advocate Training Module</h4>
                <p className="text-sm text-gray-600">
                  Complete our interactive training module to understand your role as an advocate
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Start Training
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={formData.knowledgeCheckPassed}
                onChange={(e) => handleInputChange('knowledgeCheckPassed', e.target.checked)}
                className="mt-1"
              />
              <div>
                <h4 className="font-medium text-gray-900">Knowledge Check</h4>
                <p className="text-sm text-gray-600">
                  Pass a short quiz to demonstrate your understanding of advocate responsibilities
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Take Quiz
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={formData.complianceAgreed}
                onChange={(e) => handleInputChange('complianceAgreed', e.target.checked)}
                className="mt-1"
              />
              <div>
                <h4 className="font-medium text-gray-900">Compliance Agreement</h4>
                <p className="text-sm text-gray-600">
                  I agree to the Advocate Terms of Service and Privacy Policy
                </p>
                <div className="mt-2 space-x-2">
                  <Button variant="outline" size="sm">
                    View Terms
                  </Button>
                  <Button variant="outline" size="sm">
                    View Privacy Policy
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious}>
          <ArrowLeftIcon size={16} className="mr-2" />
          Previous
        </Button>
        <Button onClick={handleNext} disabled={!isFormValid}>
          {isLast ? 'Complete Onboarding' : 'Next Step'}
          {isLast ? <CheckIcon size={16} className="ml-2" /> : <ArrowRightIcon size={16} className="ml-2" />}
        </Button>
      </div>
    </div>
  );
};

// Step 5: Preferences
const PreferencesStep: React.FC<OnboardingStepProps> = ({
  data,
  onUpdate,
  onNext,
  onPrevious,
  isFirst,
  isLast,
}) => {
  const [formData, setFormData] = useState({
    communicationPreferences: data.communicationPreferences || [],
    rewardPreferences: data.rewardPreferences || '',
    maxCallsPerMonth: data.maxCallsPerMonth || 4,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    onUpdate(formData);
    onNext();
  };

  const handlePrevious = () => {
    onUpdate(formData);
    onPrevious();
  };

  const toggleCommunicationPreference = (preference: string) => {
    setFormData(prev => ({
      ...prev,
      communicationPreferences: prev.communicationPreferences.includes(preference)
        ? prev.communicationPreferences.filter(p => p !== preference)
        : [...prev.communicationPreferences, preference]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <ClockIcon size={48} className="mx-auto mb-4 text-orange-600" />
        <h3 className="text-xl font-semibold text-gray-900">Preferences</h3>
        <p className="text-gray-600">Set your communication and participation preferences</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Communication Preferences
          </label>
          <div className="space-y-2">
            {['Email', 'SMS', 'Phone', 'In-app notifications'].map((preference) => (
              <label key={preference} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.communicationPreferences.includes(preference)}
                  onChange={() => toggleCommunicationPreference(preference)}
                  className="mr-2"
                />
                <span className="text-sm">{preference}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reward Preferences
          </label>
          <Select
            value={formData.rewardPreferences}
            onChange={(value) => handleInputChange('rewardPreferences', value)}
            options={[
              { value: 'charitable', label: 'Charitable Donation' },
              { value: 'professional', label: 'Professional Development Fund' },
              { value: 'direct', label: 'Direct Payment' },
              { value: 'company', label: 'Company Credits' },
            ]}
            placeholder="Select reward preference"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Calls Per Month
          </label>
          <Select
            value={formData.maxCallsPerMonth.toString()}
            onChange={(value) => handleInputChange('maxCallsPerMonth', parseInt(value))}
            options={[
              { value: '1', label: '1 call per month' },
              { value: '2', label: '2 calls per month' },
              { value: '4', label: '4 calls per month' },
              { value: '6', label: '6 calls per month' },
              { value: '8', label: '8 calls per month' },
            ]}
            placeholder="Select maximum calls"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious}>
          <ArrowLeftIcon size={16} className="mr-2" />
          Previous
        </Button>
        <Button onClick={handleNext}>
          Complete Onboarding
          <CheckIcon size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export const AdvocateOnboarding: React.FC<AdvocateOnboardingProps> = ({
  onComplete,
  onCancel,
  className = '',
}) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    title: '',
    company: '',
    industry: '',
    companySize: '',
    location: '',
    experience: '',
    expertise: [],
    useCases: [],
    availability: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    linkedinProfile: '',
    companyEmail: '',
    verificationDocuments: [],
    trainingCompleted: false,
    knowledgeCheckPassed: false,
    complianceAgreed: false,
    communicationPreferences: [],
    rewardPreferences: '',
    maxCallsPerMonth: 4,
  });

  const steps: OnboardingStep[] = [
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Basic information about you and your company',
      component: PersonalInformationStep,
      isCompleted: false,
      isRequired: true,
    },
    {
      id: 'professional',
      title: 'Professional Information',
      description: 'Your expertise and availability',
      component: ProfessionalInformationStep,
      isCompleted: false,
      isRequired: true,
    },
    {
      id: 'verification',
      title: 'Verification',
      description: 'Verify your identity and company',
      component: VerificationStep,
      isCompleted: false,
      isRequired: true,
    },
    {
      id: 'training',
      title: 'Training & Compliance',
      description: 'Complete training and agree to terms',
      component: TrainingStep,
      isCompleted: false,
      isRequired: true,
    },
    {
      id: 'preferences',
      title: 'Preferences',
      description: 'Set your communication and participation preferences',
      component: PreferencesStep,
      isCompleted: false,
      isRequired: true,
    },
  ];

  const currentStepData = steps[currentStep];
  const CurrentStepComponent = currentStepData.component;

  const handleUpdate = (data: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      onComplete?.(onboardingData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className={cn('max-w-4xl mx-auto', className)}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Advocate Onboarding</CardTitle>
              <p className="text-gray-600 mt-1">
                Step {currentStep + 1} of {steps.length}: {currentStepData.title}
              </p>
            </div>
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
          
          <Progress value={progress} className="mt-4" />
        </CardHeader>
        
        <CardBody>
          <CurrentStepComponent
            data={onboardingData}
            onUpdate={handleUpdate}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirst={currentStep === 0}
            isLast={currentStep === steps.length - 1}
          />
        </CardBody>
      </Card>

      {/* Step Navigation */}
      <div className="mt-6 flex justify-center">
        <div className="flex space-x-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                'w-3 h-3 rounded-full',
                index === currentStep
                  ? 'bg-blue-600'
                  : index < currentStep
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvocateOnboarding;
