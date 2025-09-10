/**
 * Reference Call Form Component
 *
 * Form for scheduling and managing reference calls.
 * Handles call creation, updates, and scheduling.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useReferenceCalls } from '@/hooks/useReferenceCalls';
import { useAdvocates } from '@/hooks/useAdvocates';
import { useOpportunities } from '@/hooks/useOpportunities';
import {
  ReferenceCall,
  CreateReferenceCallData,
  UpdateReferenceCallData,
} from '@/lib/services/referenceCallService';
import {
  Button,
  Input,
  Textarea,
  Select,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardDescription,
  Alert,
  LoadingButton,
} from '@/components/ui';
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  BuildingOfficeIcon,
  VideoCameraIcon,
  PhoneIcon,
} from '@/components/ui/icons';

interface ReferenceCallFormProps {
  call?: ReferenceCall;
  onSuccess?: (callId: string) => void;
  onCancel?: () => void;
  className?: string;
}

const MEETING_PLATFORMS = [
  { value: 'zoom', label: 'Zoom' },
  { value: 'teams', label: 'Microsoft Teams' },
  { value: 'google_meet', label: 'Google Meet' },
  { value: 'webex', label: 'Cisco Webex' },
  { value: 'phone', label: 'Phone Call' },
  { value: 'other', label: 'Other' },
];

const TIMEZONES = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST)' },
];

const DURATION_OPTIONS = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
];

export const ReferenceCallForm: React.FC<ReferenceCallFormProps> = ({
  call,
  onSuccess,
  onCancel,
  className = '',
}) => {
  const { advocates } = useAdvocates();
  const { opportunities } = useOpportunities();
  const { createNewCall, updateCall, loading, error } = useReferenceCalls();

  const isEditing = !!call;

  // Form state
  const [formData, setFormData] = useState<CreateReferenceCallData>({
    opportunity_id: '',
    advocate_id: '',
    sales_rep_id: '', // TODO: Get from user context
    prospect_name: '',
    prospect_email: '',
    prospect_title: '',
    prospect_company: '',
    scheduled_at: '',
    duration_minutes: 30,
    timezone: 'UTC',
    meeting_platform: 'zoom',
    meeting_link: '',
    meeting_id: '',
    meeting_password: '',
    briefing_materials: [],
    talking_points: [],
    questions_to_cover: [],
    advocate_briefed: false,
    prospect_briefed: false,
    internal_notes: '',
    tags: [],
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Initialize form data when call is provided (edit mode)
  useEffect(() => {
    if (call) {
      setFormData({
        opportunity_id: call.opportunity_id,
        advocate_id: call.advocate_id,
        sales_rep_id: call.sales_rep_id,
        prospect_name: call.prospect_name,
        prospect_email: call.prospect_email,
        prospect_title: call.prospect_title || '',
        prospect_company: call.prospect_company,
        scheduled_at: call.scheduled_at,
        duration_minutes: call.duration_minutes || 30,
        timezone: call.timezone || 'UTC',
        meeting_platform: call.meeting_platform || 'zoom',
        meeting_link: call.meeting_link || '',
        meeting_id: call.meeting_id || '',
        meeting_password: call.meeting_password || '',
        briefing_materials: call.briefing_materials || [],
        talking_points: call.talking_points || [],
        questions_to_cover: call.questions_to_cover || [],
        advocate_briefed: call.advocate_briefed || false,
        prospect_briefed: call.prospect_briefed || false,
        internal_notes: call.internal_notes || '',
        tags: call.tags || [],
      });
    }
  }, [call]);

  // Handle input changes
  const handleInputChange = (
    field: keyof CreateReferenceCallData,
    value: any
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Handle opportunity selection - auto-fill prospect info
  const handleOpportunityChange = (opportunityId: string) => {
    const opportunity = opportunities.find((opp) => opp.id === opportunityId);
    if (opportunity) {
      setFormData((prev) => ({
        ...prev,
        opportunity_id: opportunityId,
        prospect_company: opportunity.prospect_company,
        prospect_name: opportunity.prospect_contact_name || '',
        prospect_email: opportunity.prospect_contact_email || '',
        prospect_title: opportunity.prospect_contact_title || '',
      }));
    } else {
      setFormData((prev) => ({ ...prev, opportunity_id: opportunityId }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.opportunity_id) {
      errors.opportunity_id = 'Opportunity is required';
    }

    if (!formData.advocate_id) {
      errors.advocate_id = 'Advocate is required';
    }

    if (!formData.prospect_name.trim()) {
      errors.prospect_name = 'Prospect name is required';
    }

    if (!formData.prospect_email.trim()) {
      errors.prospect_email = 'Prospect email is required';
    }

    if (!formData.prospect_company.trim()) {
      errors.prospect_company = 'Prospect company is required';
    }

    if (!formData.scheduled_at) {
      errors.scheduled_at = 'Scheduled time is required';
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.prospect_email && !emailRegex.test(formData.prospect_email)) {
      errors.prospect_email = 'Invalid email format';
    }

    // Validate scheduled time is in the future
    if (
      formData.scheduled_at &&
      new Date(formData.scheduled_at) <= new Date()
    ) {
      errors.scheduled_at = 'Scheduled time must be in the future';
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
      if (isEditing && call) {
        await updateCall(call.id, formData as UpdateReferenceCallData);
        onSuccess?.(call.id);
      } else {
        const newCall = await createNewCall(formData);
        onSuccess?.(newCall.id);
      }
    } catch (err) {
      // Error is handled by the hook
    }
  };

  // Get available advocates for selected opportunity
  const getAvailableAdvocates = () => {
    if (!formData.opportunity_id) return advocates;

    const opportunity = opportunities.find(
      (opp) => opp.id === formData.opportunity_id
    );
    if (!opportunity) return advocates;

    // Filter advocates based on opportunity requirements
    return advocates.filter((advocate) => {
      // Basic filtering - can be enhanced with matching algorithm
      if (opportunity.desired_advocate_industry && advocate.industry) {
        return advocate.industry
          .toLowerCase()
          .includes(opportunity.desired_advocate_industry.toLowerCase());
      }
      return true;
    });
  };

  return (
    <Card className={`w-full max-w-4xl mx-auto ${className}`}>
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Edit Reference Call' : 'Schedule Reference Call'}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? 'Update the reference call details and scheduling information.'
            : 'Schedule a new reference call between an advocate and prospect.'}
        </CardDescription>
      </CardHeader>

      <CardBody>
        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Opportunity and Advocate Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Select
                label="Opportunity *"
                value={formData.opportunity_id}
                onChange={handleOpportunityChange}
                options={[
                  { value: '', label: 'Select an opportunity...' },
                  ...opportunities.map((opp) => ({
                    value: opp.id,
                    label: `${opp.opportunity_name} (${opp.prospect_company})`,
                  })),
                ]}
                error={validationErrors.opportunity_id}
                placeholder="Choose opportunity"
              />
            </div>

            <div>
              <Select
                label="Advocate *"
                value={formData.advocate_id}
                onChange={(value) => handleInputChange('advocate_id', value)}
                options={[
                  { value: '', label: 'Select an advocate...' },
                  ...getAvailableAdvocates().map((advocate) => ({
                    value: advocate.id,
                    label: `${advocate.name} (${advocate.company_name})`,
                  })),
                ]}
                error={validationErrors.advocate_id}
                placeholder="Choose advocate"
              />
            </div>
          </div>

          {/* Prospect Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <UserIcon size={20} className="mr-2" />
              Prospect Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Prospect Name *"
                  value={formData.prospect_name}
                  onChange={(e) =>
                    handleInputChange('prospect_name', e.target.value)
                  }
                  error={validationErrors.prospect_name}
                  placeholder="John Smith"
                />
              </div>

              <div>
                <Input
                  label="Prospect Email *"
                  type="email"
                  value={formData.prospect_email}
                  onChange={(e) =>
                    handleInputChange('prospect_email', e.target.value)
                  }
                  error={validationErrors.prospect_email}
                  placeholder="john.smith@company.com"
                />
              </div>

              <div>
                <Input
                  label="Prospect Title"
                  value={formData.prospect_title}
                  onChange={(e) =>
                    handleInputChange('prospect_title', e.target.value)
                  }
                  placeholder="CTO, VP Engineering, etc."
                />
              </div>

              <div>
                <Input
                  label="Prospect Company *"
                  value={formData.prospect_company}
                  onChange={(e) =>
                    handleInputChange('prospect_company', e.target.value)
                  }
                  error={validationErrors.prospect_company}
                  placeholder="Acme Corporation"
                />
              </div>
            </div>
          </div>

          {/* Scheduling Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <CalendarIcon size={20} className="mr-2" />
              Scheduling Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Input
                  label="Scheduled Date & Time *"
                  type="datetime-local"
                  value={formData.scheduled_at}
                  onChange={(e) =>
                    handleInputChange('scheduled_at', e.target.value)
                  }
                  error={validationErrors.scheduled_at}
                />
              </div>

              <div>
                <Select
                  label="Duration"
                  value={formData.duration_minutes}
                  onChange={(value) =>
                    handleInputChange('duration_minutes', parseInt(value))
                  }
                  options={DURATION_OPTIONS}
                />
              </div>

              <div>
                <Select
                  label="Timezone"
                  value={formData.timezone}
                  onChange={(value) => handleInputChange('timezone', value)}
                  options={TIMEZONES}
                />
              </div>
            </div>
          </div>

          {/* Meeting Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <VideoCameraIcon size={20} className="mr-2" />
              Meeting Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Select
                  label="Meeting Platform"
                  value={formData.meeting_platform}
                  onChange={(value) =>
                    handleInputChange('meeting_platform', value)
                  }
                  options={MEETING_PLATFORMS}
                />
              </div>

              <div>
                <Input
                  label="Meeting Link"
                  value={formData.meeting_link}
                  onChange={(e) =>
                    handleInputChange('meeting_link', e.target.value)
                  }
                  placeholder="https://zoom.us/j/123456789"
                />
              </div>

              <div>
                <Input
                  label="Meeting ID"
                  value={formData.meeting_id}
                  onChange={(e) =>
                    handleInputChange('meeting_id', e.target.value)
                  }
                  placeholder="123 456 7890"
                />
              </div>

              <div>
                <Input
                  label="Meeting Password"
                  value={formData.meeting_password}
                  onChange={(e) =>
                    handleInputChange('meeting_password', e.target.value)
                  }
                  placeholder="Optional password"
                />
              </div>
            </div>
          </div>

          {/* Preparation Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preparation Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Textarea
                  label="Talking Points"
                  value={formData.talking_points?.join('\n') || ''}
                  onChange={(e) =>
                    handleInputChange(
                      'talking_points',
                      e.target.value.split('\n').filter((point) => point.trim())
                    )
                  }
                  placeholder="Key points to discuss during the call..."
                  rows={4}
                />
              </div>

              <div>
                <Textarea
                  label="Questions to Cover"
                  value={formData.questions_to_cover?.join('\n') || ''}
                  onChange={(e) =>
                    handleInputChange(
                      'questions_to_cover',
                      e.target.value
                        .split('\n')
                        .filter((question) => question.trim())
                    )
                  }
                  placeholder="Questions to ask the prospect..."
                  rows={4}
                />
              </div>
            </div>

            <div>
              <Textarea
                label="Internal Notes"
                value={formData.internal_notes}
                onChange={(e) =>
                  handleInputChange('internal_notes', e.target.value)
                }
                placeholder="Internal notes about this call..."
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
                disabled={loading}
              >
                Cancel
              </Button>
            )}

            <LoadingButton type="submit" loading={loading} disabled={loading}>
              {loading
                ? 'Saving...'
                : isEditing
                  ? 'Update Call'
                  : 'Schedule Call'}
            </LoadingButton>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};
