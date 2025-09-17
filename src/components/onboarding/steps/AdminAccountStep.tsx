/**
 * Admin Account Step Component
 * 
 * Third step of the onboarding flow - creates the admin user account
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { UserIcon, CheckIcon, EyeIcon, EyeSlashIcon } from '@/components/ui/icons';
import { useOnboarding } from '../OnboardingFlow';

interface AdminAccountStepProps {
  onNext: () => void;
  onPrevious: () => void;
  onComplete: (data: any) => void;
  onSkip: () => void;
  data?: any;
  isOptional?: boolean;
}

export const AdminAccountStep: React.FC<AdminAccountStepProps> = ({
  onNext,
  onPrevious,
  onComplete,
}) => {
  const { data, updateData, setIsLoading, setError, setCompanyId } = useOnboarding();
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.first_name.trim()) {
      setError('First name is required');
      return false;
    }

    if (!formData.last_name.trim()) {
      setError('Last name is required');
      return false;
    }

    if (!formData.email.trim()) {
      setError('Email address is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!formData.password.trim()) {
      setError('Password is required');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return false;
    }

    // Check password strength
    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasLowerCase = /[a-z]/.test(formData.password);
    const hasNumbers = /\d/.test(formData.password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
      return false;
    }

    return true;
  };

  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    
    if (score <= 2) return { strength: 'Weak', color: 'text-red-600' };
    if (score <= 3) return { strength: 'Fair', color: 'text-yellow-600' };
    if (score <= 4) return { strength: 'Good', color: 'text-blue-600' };
    return { strength: 'Strong', color: 'text-green-600' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setIsLoading(true);

      // Create company and admin user
      const response = await fetch('/api/onboarding/company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data.company,
          admin_user: {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            password: formData.password,
          },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create company and admin account');
      }

      // Update onboarding data with created company info
      updateData({ 
        admin_user: formData,
        company_id: result.data.company.id,
      });
      
      setCompanyId(result.data.company.id);
      onComplete(formData);
      onNext();
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create admin account';
      setError(errorMessage);
      console.error('Error creating admin account:', err);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
          <UserIcon size={32} className="text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Create your admin account
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          This will be your main account for managing your PeerChamps workspace
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name *"
            value={formData.first_name}
            onChange={(e) => handleInputChange('first_name', e.target.value)}
            placeholder="Enter your first name"
            required
          />
          
          <Input
            label="Last Name *"
            value={formData.last_name}
            onChange={(e) => handleInputChange('last_name', e.target.value)}
            placeholder="Enter your last name"
            required
          />
        </div>

        {/* Email */}
        <Input
          label="Email Address *"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="Enter your email address"
          required
        />

        {/* Password */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Password *
          </label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Create a strong password"
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeSlashIcon size={20} /> : <EyeIcon size={20} />}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600 dark:text-gray-400">Password strength:</span>
              <span className={`font-medium ${passwordStrength.color}`}>
                {passwordStrength.strength}
              </span>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Confirm Password *
          </label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirm_password}
              onChange={(e) => handleInputChange('confirm_password', e.target.value)}
              placeholder="Confirm your password"
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeSlashIcon size={20} /> : <EyeIcon size={20} />}
            </button>
          </div>
        </div>

        {/* Password Requirements */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Password Requirements:
          </h4>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${formData.password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`} />
              At least 8 characters long
            </li>
            <li className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${/[A-Z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`} />
              One uppercase letter
            </li>
            <li className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${/[a-z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`} />
              One lowercase letter
            </li>
            <li className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${/\d/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`} />
              One number
            </li>
            <li className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`} />
              One special character
            </li>
          </ul>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            <strong>Security:</strong> Your account will be created with admin privileges. 
            You'll be able to invite team members and manage your company settings after setup.
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
                Creating Account...
              </>
            ) : (
              <>
                <CheckIcon size={16} className="mr-2" />
                Create Account
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
