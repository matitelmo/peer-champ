/**
 * Initial Configuration Step Component
 * 
 * Fifth step of the onboarding flow - configures initial settings
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { CheckIcon, UploadIcon } from '@/components/ui/icons';
import { CogIcon } from '@/components/ui/CogIcon';
import { useOnboarding } from '../OnboardingFlow';

interface InitialConfigStepProps {
  onNext: () => void;
  onPrevious: () => void;
  onComplete: (data: any) => void;
  onSkip: () => void;
  data?: any;
  isOptional?: boolean;
}

const THEMES = [
  { value: 'light', label: 'Light', description: 'Clean and bright interface' },
  { value: 'dark', label: 'Dark', description: 'Easy on the eyes' },
  { value: 'auto', label: 'Auto', description: 'Follows system preference' },
];

const NOTIFICATION_PREFERENCES = [
  { key: 'email_notifications', label: 'Email Notifications', description: 'Receive updates via email' },
  { key: 'slack_notifications', label: 'Slack Notifications', description: 'Get updates in Slack' },
  { key: 'webhook_notifications', label: 'Webhook Notifications', description: 'Send data to external systems' },
];

export const InitialConfigStep: React.FC<InitialConfigStepProps> = ({
  onNext,
  onPrevious,
  onComplete,
}) => {
  const { updateData, setIsLoading, setError } = useOnboarding();
  
  const [config, setConfig] = useState({
    theme: 'auto',
    notifications: {
      email_notifications: true,
      slack_notifications: false,
      webhook_notifications: false,
    },
    company_logo: null as File | null,
    default_meeting_duration: 30,
    timezone: 'UTC',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfigChange = (key: string, value: any) => {
    if (key.startsWith('notifications.')) {
      const notificationKey = key.split('.')[1];
      setConfig(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [notificationKey]: value,
        },
      }));
    } else {
      setConfig(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      setConfig(prev => ({ ...prev, company_logo: file }));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError(null);
      setIsLoading(true);

      // Update onboarding data
      updateData({ configuration: config });
      onComplete(config);
      onNext();
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save configuration';
      setError(errorMessage);
      console.error('Error saving configuration:', err);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
          <CogIcon size={32} className="text-orange-600 dark:text-orange-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Configure your preferences
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Set up your workspace to match your team's needs
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Theme Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Appearance
          </h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Theme
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {THEMES.map((theme) => (
                <button
                  key={theme.value}
                  type="button"
                  onClick={() => handleConfigChange('theme', theme.value)}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    config.theme === theme.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-white">
                    {theme.label}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {theme.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Company Logo */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Company Branding
          </h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Company Logo
            </label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center">
                {config.company_logo ? (
                  <img
                    src={URL.createObjectURL(config.company_logo)}
                    alt="Company logo preview"
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <UploadIcon size={24} className="text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <UploadIcon size={16} className="mr-2" />
                  Upload Logo
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  PNG, JPG up to 5MB. Recommended: 200x200px
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notifications
          </h3>
          
          <div className="space-y-3">
            {NOTIFICATION_PREFERENCES.map((pref) => (
              <div key={pref.key} className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id={pref.key}
                  checked={config.notifications[pref.key as keyof typeof config.notifications]}
                  onChange={(e) => handleConfigChange(`notifications.${pref.key}`, e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <label htmlFor={pref.key} className="text-sm font-medium text-gray-900 dark:text-white">
                    {pref.label}
                  </label>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {pref.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Default Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Default Settings
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Default Meeting Duration (minutes)
              </label>
              <select
                value={config.default_meeting_duration}
                onChange={(e) => handleConfigChange('default_meeting_duration', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Timezone
              </label>
              <select
                value={config.timezone}
                onChange={(e) => handleConfigChange('timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Paris">Paris</option>
                <option value="Asia/Tokyo">Tokyo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            <strong>Note:</strong> You can change these settings anytime from your company settings page. 
            These preferences will be applied to all new team members by default.
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
