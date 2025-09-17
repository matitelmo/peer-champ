/**
 * Completion Step Component
 * 
 * Final step of the onboarding flow - setup completion and next steps
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { CheckIcon, ArrowRightIcon, StarIcon, UsersIcon, CalendarIcon, ChartBarIcon } from '@/components/ui/icons';
import { useOnboarding } from '../OnboardingFlow';
import { useRouter } from 'next/navigation';

interface CompletionStepProps {
  onNext: () => void;
  onPrevious: () => void;
  onComplete: (data: any) => void;
  onSkip: () => void;
  data?: any;
  isOptional?: boolean;
}

export const CompletionStep: React.FC<CompletionStepProps> = ({
  onComplete,
}) => {
  const router = useRouter();
  const { data, companyId, setIsLoading, setError } = useOnboarding();
  
  const [isCompleting, setIsCompleting] = useState(false);
  const [feedback, setFeedback] = useState({
    rating: 0,
    comments: '',
  });

  const handleRatingChange = (rating: number) => {
    setFeedback(prev => ({ ...prev, rating }));
  };

  const handleCommentsChange = (comments: string) => {
    setFeedback(prev => ({ ...prev, comments }));
  };

  const completeOnboarding = async () => {
    try {
      setIsCompleting(true);
      setError(null);
      setIsLoading(true);

      // Update final onboarding progress
      if (companyId) {
        const response = await fetch('/api/onboarding/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            company_id: companyId,
            step_name: 'completion',
            completed: true,
            step_data: {
              feedback,
              completed_at: new Date().toISOString(),
            },
          }),
        });

        if (!response.ok) {
          console.error('Failed to update final progress');
        }
      }

      // Mark onboarding as complete
      onComplete({ 
        completion: {
          completed_at: new Date().toISOString(),
          feedback,
        }
      });

      // Redirect to dashboard
      router.push('/dashboard');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete onboarding';
      setError(errorMessage);
      console.error('Error completing onboarding:', err);
    } finally {
      setIsCompleting(false);
      setIsLoading(false);
    }
  };

  const getSetupSummary = () => {
    const summary = {
      company: data.company ? '✅' : '❌',
      admin: data.admin_user ? '✅' : '❌',
      invitations: data.invitations?.length > 0 ? `✅ (${data.invitations.length})` : '⏭️',
      configuration: data.configuration ? '✅' : '❌',
      advocates: data.advocates?.length > 0 ? `✅ (${data.advocates.length})` : '⏭️',
      crm: data.crm_integration?.connected ? '✅' : '⏭️',
      metrics: data.success_metrics ? '✅' : '❌',
      tour: data.welcome_tour ? '✅' : '⏭️',
    };
    return summary;
  };

  const summary = getSetupSummary();

  return (
    <div className="max-w-3xl mx-auto text-center">
      {/* Success Header */}
      <div className="mb-8">
        <div className="mx-auto w-24 h-24 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
          <CheckIcon size={48} className="text-green-600 dark:text-green-400" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          🎉 Welcome to PeerChamps!
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
          Your customer reference platform is ready to go
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          You've successfully completed the setup process
        </p>
      </div>

      {/* Setup Summary */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Setup Summary
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div className="flex items-center gap-3">
            <span className="text-lg">{summary.company}</span>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Company Profile</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Basic company information</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-lg">{summary.admin}</span>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Admin Account</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Your admin user account</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-lg">{summary.invitations}</span>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Team Invitations</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Team member invitations</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-lg">{summary.configuration}</span>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Configuration</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Preferences and settings</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-lg">{summary.advocates}</span>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Customer Advocates</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Reference call participants</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-lg">{summary.crm}</span>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">CRM Integration</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Salesforce or HubSpot</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-lg">{summary.metrics}</span>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Success Metrics</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Goals and tracking</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-lg">{summary.tour}</span>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Product Tour</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Feature walkthrough</p>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-4">
          What's Next?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-3">
              <UsersIcon size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
              Add More Advocates
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Build your network of customer advocates
            </p>
          </div>
          
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-3">
              <CalendarIcon size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
              Schedule Your First Call
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Create your first reference call opportunity
            </p>
          </div>
          
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-3">
              <ChartBarIcon size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
              Track Your Progress
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Monitor your reference program success
            </p>
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          How was your setup experience?
        </h2>
        
        <div className="space-y-4">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRatingChange(rating)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  feedback.rating >= rating
                    ? 'bg-yellow-400 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <StarIcon size={20} />
              </button>
            ))}
          </div>
          
          <div className="max-w-md mx-auto">
            <textarea
              value={feedback.comments}
              onChange={(e) => handleCommentsChange(e.target.value)}
              placeholder="Any feedback or suggestions? (optional)"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-6">
        <Button
          onClick={completeOnboarding}
          disabled={isCompleting}
          size="lg"
          className="px-8 py-3"
        >
          {isCompleting ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Completing Setup...
            </>
          ) : (
            <>
              <ArrowRightIcon size={20} className="mr-2" />
              Go to Dashboard
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
