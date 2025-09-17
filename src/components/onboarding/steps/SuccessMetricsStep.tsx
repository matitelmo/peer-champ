/**
 * Success Metrics Step Component
 * 
 * Eighth step of the onboarding flow - sets up success tracking
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { ChartBarIcon, CheckIcon, PlusIcon, XIcon } from '@/components/ui/icons';
import { useOnboarding } from '../OnboardingFlow';

interface SuccessMetricsStepProps {
  onNext: () => void;
  onPrevious: () => void;
  onComplete: (data: any) => void;
  onSkip: () => void;
  data?: any;
  isOptional?: boolean;
}

interface Goal {
  id: string;
  name: string;
  target: number;
  metric: string;
  timeframe: string;
}

const METRICS = [
  { value: 'reference_calls', label: 'Reference Calls', description: 'Number of reference calls completed' },
  { value: 'conversion_rate', label: 'Conversion Rate', description: 'Percentage of prospects that convert after reference calls' },
  { value: 'advocate_satisfaction', label: 'Advocate Satisfaction', description: 'Average satisfaction score from advocates' },
  { value: 'sales_velocity', label: 'Sales Velocity', description: 'Time from opportunity to close' },
  { value: 'pipeline_influence', label: 'Pipeline Influence', description: 'Deal value influenced by reference calls' },
];

const TIMEFRAMES = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annually', label: 'Annually' },
];

export const SuccessMetricsStep: React.FC<SuccessMetricsStepProps> = ({
  onNext,
  onPrevious,
  onComplete,
}) => {
  const { updateData, setIsLoading, setError } = useOnboarding();
  
  const [goals, setGoals] = useState<Goal[]>([]);
  const [currentGoal, setCurrentGoal] = useState({
    name: '',
    target: 0,
    metric: '',
    timeframe: 'monthly',
  });
  const [reportingPreferences, setReportingPreferences] = useState({
    frequency: 'monthly',
    email_reports: true,
    dashboard_alerts: true,
    slack_notifications: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoalInputChange = (field: string, value: string | number) => {
    setCurrentGoal(prev => ({ ...prev, [field]: value }));
  };

  const handleReportingChange = (field: string, value: any) => {
    setReportingPreferences(prev => ({ ...prev, [field]: value }));
  };

  const validateGoal = () => {
    if (!currentGoal.name.trim()) {
      setError('Goal name is required');
      return false;
    }
    if (!currentGoal.metric) {
      setError('Please select a metric');
      return false;
    }
    if (currentGoal.target <= 0) {
      setError('Target must be greater than 0');
      return false;
    }
    return true;
  };

  const addGoal = () => {
    if (!validateGoal()) return;

    const newGoal: Goal = {
      id: Date.now().toString(),
      ...currentGoal,
    };

    setGoals(prev => [...prev, newGoal]);
    setCurrentGoal({
      name: '',
      target: 0,
      metric: '',
      timeframe: 'monthly',
    });
    setError(null);
  };

  const removeGoal = (id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError(null);
      setIsLoading(true);

      const successMetricsData = {
        goals,
        reporting_preferences: reportingPreferences,
      };

      updateData({ success_metrics: successMetricsData });
      onComplete(successMetricsData);
      onNext();
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save success metrics';
      setError(errorMessage);
      console.error('Error saving success metrics:', err);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
          <ChartBarIcon size={32} className="text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Set up success tracking
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Define your goals and how you want to track your reference program's success
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Goals Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Success Goals
          </h3>
          
          {/* Add Goal Form */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
              Add a Goal
            </h4>
            
            <div className="space-y-4">
              <Input
                label="Goal Name *"
                value={currentGoal.name}
                onChange={(e) => handleGoalInputChange('name', e.target.value)}
                placeholder="e.g., Complete 20 reference calls this quarter"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Metric *
                  </label>
                  <select
                    value={currentGoal.metric}
                    onChange={(e) => handleGoalInputChange('metric', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select a metric</option>
                    {METRICS.map((metric) => (
                      <option key={metric.value} value={metric.value}>
                        {metric.label}
                      </option>
                    ))}
                  </select>
                  {currentGoal.metric && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {METRICS.find(m => m.value === currentGoal.metric)?.description}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Timeframe
                  </label>
                  <select
                    value={currentGoal.timeframe}
                    onChange={(e) => handleGoalInputChange('timeframe', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    {TIMEFRAMES.map((timeframe) => (
                      <option key={timeframe.value} value={timeframe.value}>
                        {timeframe.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Input
                label="Target Value *"
                type="number"
                value={currentGoal.target}
                onChange={(e) => handleGoalInputChange('target', parseInt(e.target.value) || 0)}
                placeholder="Enter target number"
                min="1"
              />

              <Button
                type="button"
                onClick={addGoal}
                variant="outline"
                className="w-full"
              >
                <PlusIcon size={16} className="mr-2" />
                Add Goal
              </Button>
            </div>
          </div>

          {/* Goals List */}
          {goals.length > 0 && (
            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                Your Goals ({goals.length})
              </h4>
              
              <div className="space-y-3">
                {goals.map((goal) => (
                  <div
                    key={goal.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {goal.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Target: {goal.target} {METRICS.find(m => m.value === goal.metric)?.label} per {goal.timeframe}
                      </p>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeGoal(goal.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                    >
                      <XIcon size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reporting Preferences */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Reporting Preferences
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Report Frequency
              </label>
              <select
                value={reportingPreferences.frequency}
                onChange={(e) => handleReportingChange('frequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="email_reports"
                  checked={reportingPreferences.email_reports}
                  onChange={(e) => handleReportingChange('email_reports', e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <label htmlFor="email_reports" className="text-sm font-medium text-gray-900 dark:text-white">
                    Email Reports
                  </label>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Receive automated reports via email
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="dashboard_alerts"
                  checked={reportingPreferences.dashboard_alerts}
                  onChange={(e) => handleReportingChange('dashboard_alerts', e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <label htmlFor="dashboard_alerts" className="text-sm font-medium text-gray-900 dark:text-white">
                    Dashboard Alerts
                  </label>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Show alerts and notifications in the dashboard
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="slack_notifications"
                  checked={reportingPreferences.slack_notifications}
                  onChange={(e) => handleReportingChange('slack_notifications', e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <label htmlFor="slack_notifications" className="text-sm font-medium text-gray-900 dark:text-white">
                    Slack Notifications
                  </label>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Send updates to your Slack workspace
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            <strong>Tip:</strong> You can always modify your goals and reporting preferences later. 
            These settings help us provide you with relevant insights and track your progress.
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
