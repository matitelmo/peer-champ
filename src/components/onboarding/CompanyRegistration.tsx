/**
 * Company Registration Component
 *
 * Component for new companies to register and set up their account.
 * Handles company creation and initial admin user setup.
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { BuildingOfficeIcon, UserIcon, CheckIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

export interface CompanyRegistrationProps {
  onSuccess?: (companyId: string) => void;
  onCancel?: () => void;
  className?: string;
}

export const CompanyRegistration: React.FC<CompanyRegistrationProps> = ({
  onSuccess,
  onCancel,
  className = '',
}) => {
  // Form state
  const [formData, setFormData] = useState({
    company_name: '',
    company_domain: '',
    subscription_tier: 'professional' as const,
    
    // Admin user info
    admin_first_name: '',
    admin_last_name: '',
    admin_email: '',
    admin_password: '',
    admin_confirm_password: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.company_name.trim()) {
      setError('Company name is required');
      return false;
    }

    if (!formData.company_domain.trim()) {
      setError('Company domain is required');
      return false;
    }

    if (!formData.admin_first_name.trim()) {
      setError('Admin first name is required');
      return false;
    }

    if (!formData.admin_last_name.trim()) {
      setError('Admin last name is required');
      return false;
    }

    if (!formData.admin_email.trim()) {
      setError('Admin email is required');
      return false;
    }

    if (!formData.admin_password.trim()) {
      setError('Admin password is required');
      return false;
    }

    if (formData.admin_password !== formData.admin_confirm_password) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.admin_password.length < 8) {
      setError('Password must be at least 8 characters long');
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

      // TODO: Implement actual company registration
      // This would involve:
      // 1. Creating the company in the database
      // 2. Creating the admin user
      // 3. Setting up initial company settings
      // 4. Sending welcome email

      // For now, simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockCompanyId = 'mock-company-id';
      onSuccess?.(mockCompanyId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to register company';
      setError(errorMessage);
      console.error('Error registering company:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={cn('w-full max-w-2xl mx-auto', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BuildingOfficeIcon size={20} />
          Company Registration
        </CardTitle>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company Information</h3>
            
            <Input
              label="Company Name *"
              value={formData.company_name}
              onChange={(e) => handleInputChange('company_name', e.target.value)}
              placeholder="Enter your company name"
              required
            />

            <Input
              label="Company Domain *"
              value={formData.company_domain}
              onChange={(e) => handleInputChange('company_domain', e.target.value)}
              placeholder="example.com"
              required
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Subscription Tier
              </label>
              <select
                value={formData.subscription_tier}
                onChange={(e) => handleInputChange('subscription_tier', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="starter">Starter - $29/month</option>
                <option value="professional">Professional - $99/month</option>
                <option value="enterprise">Enterprise - Custom pricing</option>
              </select>
            </div>
          </div>

          {/* Admin User Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Admin Account</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create the initial admin account for your company.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name *"
                value={formData.admin_first_name}
                onChange={(e) => handleInputChange('admin_first_name', e.target.value)}
                placeholder="Enter first name"
                required
              />
              
              <Input
                label="Last Name *"
                value={formData.admin_last_name}
                onChange={(e) => handleInputChange('admin_last_name', e.target.value)}
                placeholder="Enter last name"
                required
              />
            </div>

            <Input
              label="Email Address *"
              type="email"
              value={formData.admin_email}
              onChange={(e) => handleInputChange('admin_email', e.target.value)}
              placeholder="Enter email address"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Password *"
                type="password"
                value={formData.admin_password}
                onChange={(e) => handleInputChange('admin_password', e.target.value)}
                placeholder="Enter password"
                required
              />
              
              <Input
                label="Confirm Password *"
                type="password"
                value={formData.admin_confirm_password}
                onChange={(e) => handleInputChange('admin_confirm_password', e.target.value)}
                placeholder="Confirm password"
                required
              />
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300">
                I agree to the{' '}
                <a href="/terms" className="text-blue-600 hover:text-blue-500 underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-blue-600 hover:text-blue-500 underline">
                  Privacy Policy
                </a>
              </label>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
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
                  Create Company Account
                </>
              )}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardBody>
    </Card>
  );
};
