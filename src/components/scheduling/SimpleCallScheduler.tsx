/**
 * Simple Call Scheduler Component
 *
 * Basic call scheduling component without calendar integration.
 * Allows users to schedule calls with advocates and prospects.
 */

import React, { useState } from 'react';
import { useReferenceCalls } from '@/hooks/useReferenceCalls';
import { useAuth } from '@/hooks/useAuth';
import { useAdvocates } from '@/hooks/useAdvocates';
import { useOpportunities } from '@/hooks/useOpportunities';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { CalendarIcon, ClockIcon, UserIcon, BuildingOfficeIcon, CheckIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

export interface SimpleCallSchedulerProps {
  opportunityId?: string;
  advocateId?: string;
  onSuccess?: (callId: string) => void;
  onCancel?: () => void;
  className?: string;
}

export const SimpleCallScheduler: React.FC<SimpleCallSchedulerProps> = ({
  opportunityId,
  advocateId,
  onSuccess,
  onCancel,
  className = '',
}) => {
  const { createNewCall, loading, error } = useReferenceCalls();
  const { user } = useAuth();
  const { advocates } = useAdvocates();
  const { opportunities } = useOpportunities();

  // Form state
  const [formData, setFormData] = useState({
    opportunity_id: opportunityId || '',
    advocate_id: advocateId || '',
    prospect_name: '',
    prospect_email: '',
    prospect_title: '',
    prospect_phone: '',
    scheduled_at: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    meeting_platform: 'zoom' as const,
    duration_minutes: 30,
    talking_points: [] as string[],
    questions_to_cover: [] as string[],
  });

  const [talkingPointInput, setTalkingPointInput] = useState('');
  const [questionInput, setQuestionInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
  };

  const addTalkingPoint = () => {
    if (talkingPointInput.trim() && !formData.talking_points.includes(talkingPointInput.trim())) {
      setFormData(prev => ({
        ...prev,
        talking_points: [...prev.talking_points, talkingPointInput.trim()],
      }));
      setTalkingPointInput('');
    }
  };

  const removeTalkingPoint = (pointToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      talking_points: prev.talking_points.filter(point => point !== pointToRemove),
    }));
  };

  const addQuestion = () => {
    if (questionInput.trim() && !formData.questions_to_cover.includes(questionInput.trim())) {
      setFormData(prev => ({
        ...prev,
        questions_to_cover: [...prev.questions_to_cover, questionInput.trim()],
      }));
      setQuestionInput('');
    }
  };

  const removeQuestion = (questionToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      questions_to_cover: prev.questions_to_cover.filter(question => question !== questionToRemove),
    }));
  };

  const generateMeetingLink = (platform: string): string => {
    // Generate placeholder meeting links
    const baseUrls: Record<string, string> = {
      zoom: 'https://zoom.us/j/',
      teams: 'https://teams.microsoft.com/l/meetup-join/',
      meet: 'https://meet.google.com/',
      webex: 'https://webex.com/meet/',
      phone: 'tel:+1-555-123-4567',
      other: 'https://meet.example.com/',
    };

    const randomId = Math.random().toString(36).substring(2, 15);
    return `${baseUrls[platform]}${randomId}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.opportunity_id || !formData.advocate_id || !formData.scheduled_at) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      

      const callData = {
        sales_rep_id: user?.id || "",
        prospect_company: selectedOpportunity?.prospect_company || "",
        opportunity_id: formData.opportunity_id,
        advocate_id: formData.advocate_id,
        prospect_name: formData.prospect_name.trim(),
        prospect_email: formData.prospect_email.trim(),
        prospect_title: formData.prospect_title.trim() || undefined,
        prospect_phone: formData.prospect_phone.trim() || undefined,
        scheduled_at: formData.scheduled_at,
        timezone: formData.timezone,
        meeting_platform: formData.meeting_platform,
        meeting_link: generateMeetingLink(formData.meeting_platform),
        duration_minutes: formData.duration_minutes,
        talking_points: formData.talking_points.length > 0 ? formData.talking_points : undefined,
        questions_to_cover: formData.questions_to_cover.length > 0 ? formData.questions_to_cover : undefined,
      };

      const newCall = await createNewCall(callData);
      onSuccess?.(newCall.id);
    } catch (err) {
      console.error('Error creating reference call:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedOpportunity = opportunities.find(opp => opp.id === formData.opportunity_id);
  const selectedAdvocate = advocates.find(adv => adv.id === formData.advocate_id);

  return (
    <Card className={cn('w-full max-w-2xl mx-auto', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon size={20} />
          Schedule Reference Call
        </CardTitle>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Opportunity Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Opportunity *
            </label>
            <select
              value={formData.opportunity_id}
              onChange={(e) => handleInputChange('opportunity_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Select an opportunity</option>
              {opportunities.map((opportunity) => (
                <option key={opportunity.id} value={opportunity.id}>
                  {opportunity.prospect_company} - {opportunity.opportunity_name}
                </option>
              ))}
            </select>
            {selectedOpportunity && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedOpportunity.prospect_company} • {selectedOpportunity.deal_stage} • ${selectedOpportunity.deal_value?.toLocaleString()}
              </p>
            )}
          </div>

          {/* Advocate Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Advocate *
            </label>
            <select
              value={formData.advocate_id}
              onChange={(e) => handleInputChange('advocate_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Select an advocate</option>
              {advocates.map((advocate) => (
                <option key={advocate.id} value={advocate.id}>
                  {advocate.name} - {advocate.company_name}
                </option>
              ))}
            </select>
            {selectedAdvocate && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedAdvocate.title} at {selectedAdvocate.company_name} • {selectedAdvocate.industry}
              </p>
            )}
          </div>

          {/* Prospect Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Prospect Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Prospect Name"
                value={formData.prospect_name}
                onChange={(e) => handleInputChange('prospect_name', e.target.value)}
                placeholder="Enter prospect name"
              />
              
              <Input
                label="Prospect Email"
                type="email"
                value={formData.prospect_email}
                onChange={(e) => handleInputChange('prospect_email', e.target.value)}
                placeholder="Enter prospect email"
              />
              
              <Input
                label="Prospect Title"
                value={formData.prospect_title}
                onChange={(e) => handleInputChange('prospect_title', e.target.value)}
                placeholder="Enter prospect title"
              />
              
              <Input
                label="Prospect Phone"
                type="tel"
                value={formData.prospect_phone}
                onChange={(e) => handleInputChange('prospect_phone', e.target.value)}
                placeholder="Enter prospect phone"
              />
            </div>
          </div>

          {/* Scheduling Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Scheduling</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.scheduled_at}
                  onChange={(e) => handleInputChange('scheduled_at', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Timezone
                </label>
                <select
                  value={formData.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Meeting Platform
                </label>
                <select
                  value={formData.meeting_platform}
                  onChange={(e) => handleInputChange('meeting_platform', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="zoom">Zoom</option>
                  <option value="teams">Microsoft Teams</option>
                  <option value="meet">Google Meet</option>
                  <option value="webex">Webex</option>
                  <option value="phone">Phone Call</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Duration (minutes)
                </label>
                <select
                  value={formData.duration_minutes}
                  onChange={(e) => handleInputChange('duration_minutes', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Talking Points */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Talking Points</h3>
            <div className="flex gap-2">
              <Input
                value={talkingPointInput}
                onChange={(e) => setTalkingPointInput(e.target.value)}
                placeholder="Add a talking point"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTalkingPoint();
                  }
                }}
              />
              <Button type="button" onClick={addTalkingPoint} size="sm">
                Add
              </Button>
            </div>
            {formData.talking_points.length > 0 && (
              <div className="space-y-2">
                {formData.talking_points.map((point: string) => (
                  <div key={point} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <span className="text-sm">{point}</span>
                    <button
                      type="button"
                      onClick={() => removeTalkingPoint(point)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Questions to Cover */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Questions to Cover</h3>
            <div className="flex gap-2">
              <Input
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                placeholder="Add a question"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addQuestion();
                  }
                }}
              />
              <Button type="button" onClick={addQuestion} size="sm">
                Add
              </Button>
            </div>
            {formData.questions_to_cover.length > 0 && (
              <div className="space-y-2">
                {formData.questions_to_cover.map((question: string) => (
                  <div key={question} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <span className="text-sm">{question}</span>
                    <button
                      type="button"
                      onClick={() => removeQuestion(question)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              disabled={isSubmitting || loading}
              className="flex-1"
            >
              {isSubmitting || loading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Scheduling...
                </>
              ) : (
                <>
                  <CheckIcon size={16} className="mr-2" />
                  Schedule Call
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
