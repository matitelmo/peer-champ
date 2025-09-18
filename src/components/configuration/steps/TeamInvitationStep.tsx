/**
 * Team Invitation Step Component
 * 
 * Step for inviting team members and setting up roles.
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { 
  UsersIcon,
  PlusIcon,
  XMarkIcon,
  EnvelopeIcon,
  UserIcon,
  ShieldCheckIcon,
} from '@/components/ui/icons';

interface TeamInvitationStepProps {
  onNext: (data?: any) => void;
  onPrevious: () => void;
  onSkip: () => void;
  onComplete: () => void;
  isLoading: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
}

interface TeamMember {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'member';
  message: string;
}

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Admin - Full access to all features' },
  { value: 'manager', label: 'Manager - Manage team and view reports' },
  { value: 'member', label: 'Member - Basic access to core features' },
];

export const TeamInvitationStep: React.FC<TeamInvitationStepProps> = ({
  onNext,
  onPrevious,
  onSkip,
  onComplete,
  isLoading,
  isFirstStep,
  isLastStep,
}) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [currentMember, setCurrentMember] = useState<Partial<TeamMember>>({
    email: '',
    firstName: '',
    lastName: '',
    role: 'member',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isInviting, setIsInviting] = useState(false);

  const validateMember = (member: Partial<TeamMember>): boolean => {
    const newErrors: Record<string, string | undefined> = {};

    if (!member.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(member.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!member.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!member.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof TeamMember) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setCurrentMember(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const addTeamMember = () => {
    if (!validateMember(currentMember)) return;

    const newMember: TeamMember = {
      id: Date.now().toString(),
      email: currentMember.email!,
      firstName: currentMember.firstName!,
      lastName: currentMember.lastName!,
      role: currentMember.role!,
      message: currentMember.message || '',
    };

    setTeamMembers(prev => [...prev, newMember]);
    setCurrentMember({
      email: '',
      firstName: '',
      lastName: '',
      role: 'member',
      message: '',
    });
    setErrors({});
  };

  const removeTeamMember = (id: string) => {
    setTeamMembers(prev => prev.filter(member => member.id !== id));
  };

  const handleSubmit = async () => {
    if (teamMembers.length === 0) {
      setErrors({ general: 'Please add at least one team member or skip this step' });
      return;
    }

    setIsInviting(true);
    try {
      // TODO: Implement team invitation API calls
      console.log('Inviting team members:', teamMembers);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onNext({ teamMembers });
    } catch (error) {
      setErrors({ general: 'Failed to send invitations. Please try again.' });
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-amaranth-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <UsersIcon size={32} className="text-amaranth-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Invite Your Team
        </h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Add team members to collaborate on your advocate network. You can always invite more people later.
        </p>
      </div>

      {/* Add Team Member Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PlusIcon size={20} className="mr-2" />
            Add Team Member
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <EnvelopeIcon size={16} className="inline mr-2" />
                Email Address *
              </label>
              <Input
                type="email"
                value={currentMember.email || ''}
                onChange={handleInputChange('email')}
                placeholder="colleague@company.com"
                variant={errors.email ? 'error' : 'default'}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <UserIcon size={16} className="inline mr-2" />
                First Name *
              </label>
              <Input
                value={currentMember.firstName || ''}
                onChange={handleInputChange('firstName')}
                placeholder="John"
                variant={errors.firstName ? 'error' : 'default'}
                disabled={isLoading}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <UserIcon size={16} className="inline mr-2" />
                Last Name *
              </label>
              <Input
                value={currentMember.lastName || ''}
                onChange={handleInputChange('lastName')}
                placeholder="Doe"
                variant={errors.lastName ? 'error' : 'default'}
                disabled={isLoading}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ShieldCheckIcon size={16} className="inline mr-2" />
                Role
              </label>
              <Select
                value={currentMember.role || 'member'}
                onChange={(value) => setCurrentMember(prev => ({ ...prev, role: value as any }))}
                disabled={isLoading}
                options={ROLE_OPTIONS}
              />
            </div>

            {/* Personal Message */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Personal Message (Optional)
              </label>
              <Textarea
                value={currentMember.message || ''}
                onChange={handleInputChange('message')}
                placeholder="Add a personal note to the invitation..."
                rows={3}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="mt-4">
            <Button
              variant="secondary"
              onClick={addTeamMember}
              disabled={isLoading}
              className="w-full"
            >
              <PlusIcon size={16} className="mr-2" />
              Add Team Member
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Team Members List */}
      {teamMembers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Team Members ({teamMembers.length})
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {teamMembers.map(member => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-amaranth-100 rounded-full flex items-center justify-center mr-3">
                        <UserIcon size={16} className="text-amaranth-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{member.email}</p>
                        <p className="text-xs text-gray-500 capitalize">
                          {member.role}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTeamMember(member.id)}
                    disabled={isLoading}
                  >
                    <XMarkIcon size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* General Error */}
      {errors.general && (
        <Alert variant="error">
          {errors.general}
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <div className="flex space-x-3">
          {!isFirstStep && (
            <Button
              variant="ghost"
              onClick={onPrevious}
              disabled={isLoading}
            >
              Previous
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={onSkip}
            disabled={isLoading}
          >
            Skip for now
          </Button>
        </div>
        
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isLoading || isInviting}
        >
          {isInviting ? 'Sending Invitations...' : isLastStep ? 'Complete Setup' : 'Continue'}
        </Button>
      </div>
    </div>
  );
};
