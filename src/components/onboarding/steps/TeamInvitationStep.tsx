/**
 * Team Invitation Step Component
 * 
 * Fourth step of the onboarding flow - invites team members
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { UserIcon, PlusIcon, CheckIcon, XIcon, MailIcon } from '@/components/ui/icons';
import { useOnboarding } from '../OnboardingFlow';

interface TeamInvitationStepProps {
  onNext: () => void;
  onPrevious: () => void;
  onComplete: (data: any) => void;
  onSkip: () => void;
  data?: any;
  isOptional?: boolean;
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  personal_message?: string;
}

const ROLES = [
  { value: 'sales_rep', label: 'Sales Representative', description: 'Can create opportunities and request references' },
  { value: 'advocate', label: 'Customer Advocate', description: 'Can participate in reference calls' },
  { value: 'admin', label: 'Admin', description: 'Full access to company settings and management' },
];

export const TeamInvitationStep: React.FC<TeamInvitationStepProps> = ({
  onNext,
  onPrevious,
  onComplete,
  onSkip,
  isOptional = true,
}) => {
  const { companyId, setIsLoading, setError } = useOnboarding();
  
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [currentInvitation, setCurrentInvitation] = useState({
    email: '',
    role: 'sales_rep',
    personal_message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setCurrentInvitation(prev => ({ ...prev, [field]: value }));
  };

  const validateInvitation = () => {
    if (!currentInvitation.email.trim()) {
      setError('Email address is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(currentInvitation.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Check if email already exists in invitations
    if (invitations.some(inv => inv.email.toLowerCase() === currentInvitation.email.toLowerCase())) {
      setError('This email has already been added to the invitation list');
      return false;
    }

    return true;
  };

  const addInvitation = () => {
    if (!validateInvitation()) {
      return;
    }

    const newInvitation: Invitation = {
      id: Date.now().toString(),
      email: currentInvitation.email,
      role: currentInvitation.role,
      personal_message: currentInvitation.personal_message,
    };

    setInvitations(prev => [...prev, newInvitation]);
    setCurrentInvitation({
      email: '',
      role: 'sales_rep',
      personal_message: '',
    });
    setError(null);
  };

  const removeInvitation = (id: string) => {
    setInvitations(prev => prev.filter(inv => inv.id !== id));
  };

  const sendInvitations = async () => {
    if (invitations.length === 0) {
      onComplete({ invitations: [] });
      onNext();
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setIsLoading(true);

      const response = await fetch('/api/onboarding/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: companyId,
          invitations: invitations.map(inv => ({
            email: inv.email,
            role: inv.role,
            personal_message: inv.personal_message,
          })),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send invitations');
      }

      onComplete({ invitations });
      onNext();
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send invitations';
      setError(errorMessage);
      console.error('Error sending invitations:', err);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    onComplete({ invitations: [] });
    onSkip();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
          <UserIcon size={32} className="text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Invite your team
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Add your sales team and customer advocates to get started
        </p>
      </div>

      {/* Add Invitation Form */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Add Team Member
        </h3>
        
        <div className="space-y-4">
          <Input
            label="Email Address *"
            type="email"
            value={currentInvitation.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="colleague@company.com"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Role *
            </label>
            <select
              value={currentInvitation.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {ROLES.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {ROLES.find(r => r.value === currentInvitation.role)?.description}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Personal Message (Optional)
            </label>
            <textarea
              value={currentInvitation.personal_message}
              onChange={(e) => handleInputChange('personal_message', e.target.value)}
              placeholder="Add a personal message to the invitation..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              rows={3}
            />
          </div>

          <Button
            type="button"
            onClick={addInvitation}
            variant="outline"
            className="w-full"
          >
            <PlusIcon size={16} className="mr-2" />
            Add to Invitation List
          </Button>
        </div>
      </div>

      {/* Invitation List */}
      {invitations.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Invitations to Send ({invitations.length})
          </h3>
          
          <div className="space-y-3">
            {invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <MailIcon size={20} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {invitation.email}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {ROLES.find(r => r.value === invitation.role)?.label}
                    </p>
                  </div>
                </div>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeInvitation(invitation.id)}
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
          <strong>Tip:</strong> You can always invite more team members later from your dashboard. 
          Invited users will receive an email with instructions to join your workspace.
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
          onClick={sendInvitations}
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Sending...
            </>
          ) : (
            <>
              <CheckIcon size={16} className="mr-2" />
              {invitations.length > 0 ? `Send ${invitations.length} Invitation${invitations.length > 1 ? 's' : ''}` : 'Continue'}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
