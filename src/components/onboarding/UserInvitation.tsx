/**
 * User Invitation Component
 *
 * Component for inviting new users to join a company.
 * Handles sending invitations and managing pending invitations.
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { UserIcon, PlusIcon, CheckIcon, XIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

export interface UserInvitationProps {
  companyId: string;
  onSuccess?: (invitationId: string) => void;
  onCancel?: () => void;
  className?: string;
}

export interface PendingInvitation {
  id: string;
  email: string;
  role: string;
  status: 'pending' | 'sent' | 'accepted' | 'expired';
  invited_at: string;
  expires_at: string;
}

export const UserInvitation: React.FC<UserInvitationProps> = ({
  companyId,
  onSuccess,
  onCancel,
  className = '',
}) => {
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    role: 'sales_rep' as const,
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock pending invitations (in real app, this would come from API)
  const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([
    {
      id: '1',
      email: 'john.doe@example.com',
      role: 'sales_rep',
      status: 'pending',
      invited_at: '2024-01-15T10:00:00Z',
      expires_at: '2024-01-22T10:00:00Z',
    },
    {
      id: '2',
      email: 'jane.smith@example.com',
      role: 'advocate',
      status: 'sent',
      invited_at: '2024-01-14T14:30:00Z',
      expires_at: '2024-01-21T14:30:00Z',
    },
  ]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Email address is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
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

      // TODO: Implement actual user invitation
      // This would involve:
      // 1. Creating invitation record in database
      // 2. Sending invitation email
      // 3. Setting up invitation tracking

      // For now, simulate the process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newInvitation: PendingInvitation = {
        id: Date.now().toString(),
        email: formData.email,
        role: formData.role,
        status: 'sent',
        invited_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      };

      setPendingInvitations(prev => [newInvitation, ...prev]);
      setFormData({ email: '', role: 'sales_rep', message: '' });
      
      onSuccess?.(newInvitation.id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send invitation';
      setError(errorMessage);
      console.error('Error sending invitation:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendInvitation = async (invitationId: string) => {
    try {
      // TODO: Implement resend invitation
      console.log('Resending invitation:', invitationId);
    } catch (err) {
      console.error('Error resending invitation:', err);
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      // TODO: Implement cancel invitation
      setPendingInvitations(prev => prev.filter(inv => inv.id !== invitationId));
    } catch (err) {
      console.error('Error canceling invitation:', err);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'sent':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'expired':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Invite New User */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusIcon size={20} />
            Invite New User
          </CardTitle>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email Address *"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
                required
              />
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="sales_rep">Sales Representative</option>
                  <option value="advocate">Advocate</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Personal Message (Optional)
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Add a personal message to the invitation..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                rows={3}
              />
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Sending Invitation...
                  </>
                ) : (
                  <>
                    <CheckIcon size={16} className="mr-2" />
                    Send Invitation
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

      {/* Pending Invitations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon size={20} />
            Pending Invitations
          </CardTitle>
        </CardHeader>
        <CardBody>
          {pendingInvitations.length === 0 ? (
            <div className="text-center py-8">
              <UserIcon size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No pending invitations
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Invite users to join your company to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingInvitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {invitation.email}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {invitation.role.replace('_', ' ')} • Invited {formatDate(invitation.invited_at)}
                        </p>
                      </div>
                      <span className={cn(
                        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                        getStatusBadgeVariant(invitation.status)
                      )}>
                        {invitation.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {invitation.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResendInvitation(invitation.id)}
                      >
                        Resend
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCancelInvitation(invitation.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                    >
                      <XIcon size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
