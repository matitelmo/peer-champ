/**
 * Opportunity Form Component
 *
 * Form component for creating and editing opportunities.
 * Handles form validation, submission, and error states.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useOpportunities } from '@/hooks/useOpportunities';
import {
  CreateOpportunityData,
  UpdateOpportunityData,
} from '@/lib/services/opportunityService';
import { Opportunity, CompanySize } from '@/types/database';
import {
  Button,
  Input,
  Textarea,
  Select,
  Checkbox,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardDescription,
  Alert,
  LoadingButton,
} from '@/components/ui';
import {
  BuildingOfficeIcon,
  UserIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  TagIcon,
} from '@/components/ui/icons';

interface OpportunityFormProps {
  opportunity?: Opportunity;
  onSuccess?: (opportunityId: string) => void;
  onCancel?: () => void;
  className?: string;
}

const COMPANY_SIZES: { value: CompanySize; label: string }[] = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '501-1000', label: '501-1000 employees' },
  { value: '1000+', label: '1000+ employees' },
];

const DEAL_STAGES = [
  { value: 'discovery', label: 'Discovery' },
  { value: 'qualification', label: 'Qualification' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'closed_won', label: 'Closed Won' },
  { value: 'closed_lost', label: 'Closed Lost' },
];

const REFERENCE_REQUEST_STATUSES = [
  { value: 'not_requested', label: 'Not Requested' },
  { value: 'requested', label: 'Requested' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'declined', label: 'Declined' },
];

const REFERENCE_URGENCIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const REFERENCE_TYPES = [
  { value: 'general', label: 'General' },
  { value: 'technical', label: 'Technical' },
  { value: 'executive', label: 'Executive' },
  { value: 'peer_to_peer', label: 'Peer to Peer' },
  { value: 'roi_focused', label: 'ROI Focused' },
];

const CURRENCIES = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'CAD', label: 'CAD (C$)' },
  { value: 'AUD', label: 'AUD (A$)' },
];

const CRM_TYPES = [
  { value: 'salesforce', label: 'Salesforce' },
  { value: 'hubspot', label: 'HubSpot' },
  { value: 'pipedrive', label: 'Pipedrive' },
  { value: 'other', label: 'Other' },
];

const COMMON_PRODUCT_INTERESTS = [
  'API Platform',
  'Data Analytics',
  'Cloud Migration',
  'Process Automation',
  'Quality Control',
  'Supply Chain',
  'Customer Experience',
  'Digital Transformation',
  'Security Implementation',
  'Performance Optimization',
];

const COMMON_TECHNICAL_REQUIREMENTS = [
  'REST API Integration',
  'Real-time Analytics',
  'Scalable Architecture',
  'OAuth Implementation',
  'Rate Limiting',
  'API Monitoring',
  'Data Security',
  'Cloud Infrastructure',
  'Microservices',
  'DevOps Integration',
];

const COMMON_BUSINESS_CHALLENGES = [
  'Legacy System Integration',
  'Data Silos',
  'Manual Processes',
  'API Security',
  'Developer Experience',
  'Performance Issues',
  'Scalability Concerns',
  'Cost Optimization',
  'Compliance Requirements',
  'Time to Market',
];

const COMMON_DECISION_CRITERIA = [
  'Ease of Integration',
  'Total Cost of Ownership',
  'Security Features',
  'Performance',
  'Support Quality',
  'Scalability',
  'Compliance',
  'Time to Value',
  'Vendor Reputation',
  'Customization Options',
];

export const OpportunityForm: React.FC<OpportunityFormProps> = ({
  opportunity,
  onSuccess,
  onCancel,
  className = '',
}) => {
  const {
    createNewOpportunity,
    updateOpportunityData,
    creating,
    updating,
    error,
  } = useOpportunities();

  const isEditing = !!opportunity;

  // Form state
  const [formData, setFormData] = useState<CreateOpportunityData>({
    prospect_company: '',
    prospect_contact_name: '',
    prospect_contact_email: '',
    prospect_contact_title: '',
    prospect_phone: '',
    prospect_website: '',
    prospect_industry: '',
    prospect_size: undefined,
    geographic_region: '',
    opportunity_name: '',
    use_case: '',
    product_interest: [],
    technical_requirements: [],
    business_challenges: [],
    deal_value: undefined,
    currency: 'USD',
    deal_stage: 'discovery',
    probability: undefined,
    expected_close_date: '',
    reference_request_status: 'not_requested',
    reference_urgency: 'medium',
    reference_type_needed: 'general',
    desired_advocate_industry: '',
    desired_advocate_size: undefined,
    desired_advocate_region: '',
    desired_use_cases: [],
    desired_expertise_areas: [],
    external_crm_id: '',
    external_crm_type: undefined,
    external_crm_url: '',
    reference_needed_by: '',
    follow_up_date: '',
    internal_notes: '',
    sales_notes: '',
    competitive_situation: '',
    decision_criteria: [],
    key_stakeholders: [],
    tags: [],
    priority_score: 50,
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Initialize form data when opportunity is provided (edit mode)
  useEffect(() => {
    if (opportunity) {
      setFormData({
        prospect_company: opportunity.prospect_company,
        prospect_contact_name: opportunity.prospect_contact_name || '',
        prospect_contact_email: opportunity.prospect_contact_email || '',
        prospect_contact_title: opportunity.prospect_contact_title || '',
        prospect_phone: opportunity.prospect_phone || '',
        prospect_website: opportunity.prospect_website || '',
        prospect_industry: opportunity.prospect_industry || '',
        prospect_size: opportunity.prospect_size || undefined,
        geographic_region: opportunity.geographic_region || '',
        opportunity_name: opportunity.opportunity_name,
        use_case: opportunity.use_case || '',
        product_interest: opportunity.product_interest || [],
        technical_requirements: opportunity.technical_requirements || [],
        business_challenges: opportunity.business_challenges || [],
        deal_value: opportunity.deal_value || undefined,
        currency: opportunity.currency || 'USD',
        deal_stage: opportunity.deal_stage,
        probability: opportunity.probability || undefined,
        expected_close_date: opportunity.expected_close_date || '',
        reference_request_status: opportunity.reference_request_status,
        reference_urgency: opportunity.reference_urgency,
        reference_type_needed: opportunity.reference_type_needed,
        desired_advocate_industry: opportunity.desired_advocate_industry || '',
        desired_advocate_size: opportunity.desired_advocate_size || undefined,
        desired_advocate_region: opportunity.desired_advocate_region || '',
        desired_use_cases: opportunity.desired_use_cases || [],
        desired_expertise_areas: opportunity.desired_expertise_areas || [],
        external_crm_id: opportunity.external_crm_id || '',
        external_crm_type: opportunity.external_crm_type || undefined,
        external_crm_url: opportunity.external_crm_url || '',
        reference_needed_by: opportunity.reference_needed_by || '',
        follow_up_date: opportunity.follow_up_date || '',
        internal_notes: opportunity.internal_notes || '',
        sales_notes: opportunity.sales_notes || '',
        competitive_situation: opportunity.competitive_situation || '',
        decision_criteria: opportunity.decision_criteria || [],
        key_stakeholders: opportunity.key_stakeholders || [],
        tags: opportunity.tags || [],
        priority_score: opportunity.priority_score,
      });
    }
  }, [opportunity]);

  // Handle input changes
  const handleInputChange = (
    field: keyof CreateOpportunityData,
    value: any
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Handle array field changes
  const handleArrayFieldChange = (
    field: keyof CreateOpportunityData,
    value: string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Handle checkbox changes for arrays
  const handleCheckboxChange = (
    field: keyof CreateOpportunityData,
    value: string,
    checked: boolean
  ) => {
    const currentArray = (formData[field] as string[]) || [];
    const newArray = checked
      ? [...currentArray, value]
      : currentArray.filter((item) => item !== value);

    handleArrayFieldChange(field, newArray);
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.prospect_company.trim()) {
      errors.prospect_company = 'Prospect company is required';
    }

    if (!formData.opportunity_name.trim()) {
      errors.opportunity_name = 'Opportunity name is required';
    }

    if (formData.deal_value !== undefined && formData.deal_value < 0) {
      errors.deal_value = 'Deal value must be positive';
    }

    if (
      formData.probability !== undefined &&
      (formData.probability < 0 || formData.probability > 100)
    ) {
      errors.probability = 'Probability must be between 0 and 100';
    }

    if (
      formData.priority_score !== undefined &&
      (formData.priority_score < 0 || formData.priority_score > 100)
    ) {
      errors.priority_score = 'Priority score must be between 0 and 100';
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
      if (isEditing && opportunity) {
        await updateOpportunityData(opportunity.id, formData);
        onSuccess?.(opportunity.id);
      } else {
        const newOpportunity = await createNewOpportunity(formData);
        onSuccess?.(newOpportunity.id);
      }
    } catch (err) {
      // Error is handled by the hook
    }
  };

  return (
    <Card className={`w-full max-w-6xl mx-auto ${className}`}>
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Edit Opportunity' : 'Create New Opportunity'}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? 'Update the opportunity details and reference requirements.'
            : 'Add a new sales opportunity and specify reference requirements.'}
        </CardDescription>
      </CardHeader>

      <CardBody>
        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Prospect Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <BuildingOfficeIcon size={20} className="mr-2" />
              Prospect Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Company Name *"
                  value={formData.prospect_company}
                  onChange={(e) =>
                    handleInputChange('prospect_company', e.target.value)
                  }
                  variant={validationErrors.prospect_company ? "error" : "default"}
                  placeholder="Acme Corporation"
                />
              </div>

              <div>
                <Input
                  label="Industry"
                  value={formData.prospect_industry || ''}
                  onChange={(e) =>
                    handleInputChange('prospect_industry', e.target.value)
                  }
                  placeholder="Software, Manufacturing, Healthcare, etc."
                />
              </div>

              <div>
                <Select
                  label="Company Size"
                  value={formData.prospect_size || ''}
                  onChange={(value) =>
                    handleInputChange('prospect_size', value as CompanySize)
                  }
                  options={COMPANY_SIZES}
                  placeholder="Select company size"
                />
              </div>

              <div>
                <Input
                  label="Geographic Region"
                  value={formData.geographic_region || ''}
                  onChange={(e) =>
                    handleInputChange('geographic_region', e.target.value)
                  }
                  placeholder="North America, Europe, Asia-Pacific, etc."
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <UserIcon size={20} className="mr-2" />
              Contact Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Contact Name"
                  value={formData.prospect_contact_name || ''}
                  onChange={(e) =>
                    handleInputChange('prospect_contact_name', e.target.value)
                  }
                  placeholder="John Smith"
                />
              </div>

              <div>
                <Input
                  label="Contact Email"
                  type="email"
                  value={formData.prospect_contact_email || ''}
                  onChange={(e) =>
                    handleInputChange('prospect_contact_email', e.target.value)
                  }
                  placeholder="john.smith@company.com"
                />
              </div>

              <div>
                <Input
                  label="Contact Title"
                  value={formData.prospect_contact_title || ''}
                  onChange={(e) =>
                    handleInputChange('prospect_contact_title', e.target.value)
                  }
                  placeholder="CTO, VP Engineering, etc."
                />
              </div>

              <div>
                <Input
                  label="Phone Number"
                  value={formData.prospect_phone || ''}
                  onChange={(e) =>
                    handleInputChange('prospect_phone', e.target.value)
                  }
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Opportunity Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <TagIcon size={20} className="mr-2" />
              Opportunity Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Opportunity Name *"
                  value={formData.opportunity_name}
                  onChange={(e) =>
                    handleInputChange('opportunity_name', e.target.value)
                  }
                  variant={validationErrors.opportunity_name ? "error" : "default"}
                  placeholder="Acme Corp - Digital Transformation"
                />
              </div>

              <div>
                <Input
                  label="Use Case"
                  value={formData.use_case || ''}
                  onChange={(e) =>
                    handleInputChange('use_case', e.target.value)
                  }
                  placeholder="Process Automation, API Integration, etc."
                />
              </div>
            </div>
          </div>

          {/* Deal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <CurrencyDollarIcon size={20} className="mr-2" />
              Deal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Input
                  label="Deal Value"
                  type="number"
                  value={formData.deal_value || ''}
                  onChange={(e) =>
                    handleInputChange(
                      'deal_value',
                      e.target.value ? parseFloat(e.target.value) : undefined
                    )
                  }
                  variant={validationErrors.deal_value ? "error" : "default"}
                  placeholder="250000"
                />
              </div>

              <div>
                <Select
                  label="Currency"
                  value={formData.currency || 'USD'}
                  onChange={(value) => handleInputChange('currency', value)}
                  options={CURRENCIES}
                />
              </div>

              <div>
                <Select
                  label="Deal Stage"
                  value={formData.deal_stage || 'discovery'}
                  onChange={(value) => handleInputChange('deal_stage', value)}
                  options={DEAL_STAGES}
                />
              </div>

              <div>
                <Input
                  label="Probability (%)"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.probability || ''}
                  onChange={(e) =>
                    handleInputChange(
                      'probability',
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  variant={validationErrors.probability ? "error" : "default"}
                  placeholder="75"
                />
              </div>

              <div>
                <Input
                  label="Expected Close Date"
                  type="date"
                  value={formData.expected_close_date || ''}
                  onChange={(e) =>
                    handleInputChange('expected_close_date', e.target.value)
                  }
                />
              </div>

              <div>
                <Input
                  label="Priority Score"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.priority_score || 50}
                  onChange={(e) =>
                    handleInputChange(
                      'priority_score',
                      e.target.value ? parseInt(e.target.value) : 50
                    )
                  }
                  variant={validationErrors.priority_score ? "error" : "default"}
                />
              </div>
            </div>
          </div>

          {/* Reference Requirements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Reference Requirements</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Select
                  label="Reference Request Status"
                  value={formData.reference_request_status || 'not_requested'}
                  onChange={(value) =>
                    handleInputChange('reference_request_status', value)
                  }
                  options={REFERENCE_REQUEST_STATUSES}
                />
              </div>

              <div>
                <Select
                  label="Reference Urgency"
                  value={formData.reference_urgency || 'medium'}
                  onChange={(value) =>
                    handleInputChange('reference_urgency', value)
                  }
                  options={REFERENCE_URGENCIES}
                />
              </div>

              <div>
                <Select
                  label="Reference Type Needed"
                  value={formData.reference_type_needed || 'general'}
                  onChange={(value) =>
                    handleInputChange('reference_type_needed', value)
                  }
                  options={REFERENCE_TYPES}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Reference Needed By"
                  type="date"
                  value={formData.reference_needed_by || ''}
                  onChange={(e) =>
                    handleInputChange('reference_needed_by', e.target.value)
                  }
                />
              </div>

              <div>
                <Input
                  label="Follow-up Date"
                  type="date"
                  value={formData.follow_up_date || ''}
                  onChange={(e) =>
                    handleInputChange('follow_up_date', e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Desired Advocate Profile */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Desired Advocate Profile</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Input
                  label="Desired Industry"
                  value={formData.desired_advocate_industry || ''}
                  onChange={(e) =>
                    handleInputChange(
                      'desired_advocate_industry',
                      e.target.value
                    )
                  }
                  placeholder="Manufacturing, Software, etc."
                />
              </div>

              <div>
                <Select
                  label="Desired Company Size"
                  value={formData.desired_advocate_size || ''}
                  onChange={(value) =>
                    handleInputChange(
                      'desired_advocate_size',
                      value as CompanySize
                    )
                  }
                  options={COMPANY_SIZES}
                  placeholder="Select company size"
                />
              </div>

              <div>
                <Input
                  label="Desired Region"
                  value={formData.desired_advocate_region || ''}
                  onChange={(e) =>
                    handleInputChange('desired_advocate_region', e.target.value)
                  }
                  placeholder="North America, Europe, etc."
                />
              </div>
            </div>
          </div>

          {/* Product Interest */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product Interest</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Interest Areas
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {COMMON_PRODUCT_INTERESTS.map((interest) => (
                  <Checkbox
                    key={interest}
                    label={interest}
                    checked={
                      formData.product_interest?.includes(interest) || false
                    }
                    onChange={(e) =>
                      handleCheckboxChange(
                        'product_interest',
                        interest,
                        checked
                      )
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Technical Requirements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Technical Requirements</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technical Requirements
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {COMMON_TECHNICAL_REQUIREMENTS.map((requirement) => (
                  <Checkbox
                    key={requirement}
                    label={requirement}
                    checked={
                      formData.technical_requirements?.includes(requirement) ||
                      false
                    }
                    onChange={(e) =>
                      handleCheckboxChange(
                        'technical_requirements',
                        requirement,
                        checked
                      )
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Business Challenges */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Business Challenges</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Challenges
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {COMMON_BUSINESS_CHALLENGES.map((challenge) => (
                  <Checkbox
                    key={challenge}
                    label={challenge}
                    checked={
                      formData.business_challenges?.includes(challenge) || false
                    }
                    onChange={(e) =>
                      handleCheckboxChange(
                        'business_challenges',
                        challenge,
                        checked
                      )
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          {/* CRM Integration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">CRM Integration</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Select
                  label="CRM Type"
                  value={formData.external_crm_type || ''}
                  onChange={(value) =>
                    handleInputChange('external_crm_type', value)
                  }
                  options={CRM_TYPES}
                  placeholder="Select CRM type"
                />
              </div>

              <div>
                <Input
                  label="CRM ID"
                  value={formData.external_crm_id || ''}
                  onChange={(e) =>
                    handleInputChange('external_crm_id', e.target.value)
                  }
                  placeholder="SF-12345"
                />
              </div>

              <div>
                <Input
                  label="CRM URL"
                  value={formData.external_crm_url || ''}
                  onChange={(e) =>
                    handleInputChange('external_crm_url', e.target.value)
                  }
                  placeholder="https://company.salesforce.com/..."
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Textarea
                  label="Internal Notes"
                  value={formData.internal_notes || ''}
                  onChange={(e) =>
                    handleInputChange('internal_notes', e.target.value)
                  }
                  placeholder="Internal notes about this opportunity..."
                  rows={3}
                />
              </div>

              <div>
                <Textarea
                  label="Sales Notes"
                  value={formData.sales_notes || ''}
                  onChange={(e) =>
                    handleInputChange('sales_notes', e.target.value)
                  }
                  placeholder="Sales notes and observations..."
                  rows={3}
                />
              </div>
            </div>

            <div>
              <Textarea
                label="Competitive Situation"
                value={formData.competitive_situation || ''}
                onChange={(e) =>
                  handleInputChange('competitive_situation', e.target.value)
                }
                placeholder="Information about competitors and competitive landscape..."
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
                disabled={creating || updating}
              >
                Cancel
              </Button>
            )}

            <LoadingButton
              type="submit"
              loading={creating || updating}
              disabled={creating || updating}
            >
              {creating
                ? 'Creating Opportunity...'
                : updating
                  ? 'Saving Changes...'
                  : isEditing
                    ? 'Save Changes'
                    : 'Create Opportunity'}
            </LoadingButton>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};
