/**
 * Notification Setup Step Component
 * 
 * Step for configuring email and in-app notification preferences.
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Switch';
import { 
  BellIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  UsersIcon,
  ChartBarIcon,
  ShieldCheckIcon,
} from '@/components/ui/icons';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface NotificationSetupStepProps {
  onNext: (data?: any) => void;
  onPrevious: () => void;
  onSkip: () => void;
  onComplete: () => void;
  isLoading: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
}

interface NotificationSettings {
  email: {
    referenceCallBooked: boolean;
    referenceCallReminder: boolean;
    referenceCallCompleted: boolean;
    advocateInvited: boolean;
    teamMemberJoined: boolean;
    weeklyReport: boolean;
    monthlyReport: boolean;
    systemUpdates: boolean;
  };
  inApp: {
    referenceCallBooked: boolean;
    referenceCallReminder: boolean;
    referenceCallCompleted: boolean;
    advocateInvited: boolean;
    teamMemberJoined: boolean;
    newOpportunity: boolean;
    opportunityUpdated: boolean;
    systemUpdates: boolean;
  };
  sms: {
    referenceCallReminder: boolean;
    urgentNotifications: boolean;
  };
}

export const NotificationSetupStep: React.FC<NotificationSetupStepProps> = ({
  onNext,
  onSkip,
  isLoading,
}) => {
  const { user } = useAuth();
  
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      referenceCallBooked: true,
      referenceCallReminder: true,
      referenceCallCompleted: true,
      advocateInvited: true,
      teamMemberJoined: true,
      weeklyReport: true,
      monthlyReport: false,
      systemUpdates: true,
    },
    inApp: {
      referenceCallBooked: true,
      referenceCallReminder: true,
      referenceCallCompleted: true,
      advocateInvited: true,
      teamMemberJoined: true,
      newOpportunity: true,
      opportunityUpdated: false,
      systemUpdates: true,
    },
    sms: {
      referenceCallReminder: false,
      urgentNotifications: true,
    },
  });

  const handleEmailToggle = (key: keyof NotificationSettings['email']) => {
    setSettings(prev => ({
      ...prev,
      email: {
        ...prev.email,
        [key]: !prev.email[key],
      },
    }));
  };

  const handleInAppToggle = (key: keyof NotificationSettings['inApp']) => {
    setSettings(prev => ({
      ...prev,
      inApp: {
        ...prev.inApp,
        [key]: !prev.inApp[key],
      },
    }));
  };

  const handleSmsToggle = (key: keyof NotificationSettings['sms']) => {
    setSettings(prev => ({
      ...prev,
      sms: {
        ...prev.sms,
        [key]: !prev.sms[key],
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      // TODO: Save notification settings to database
      console.log('Saving notification settings:', settings);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onNext(settings);
    } catch (error) {
      console.error('Failed to save notification settings:', error);
    }
  };

  const notificationCategories = [
    {
      id: 'email',
      title: 'Email Notifications',
      description: 'Receive important updates via email',
      icon: <EnvelopeIcon size={20} />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      settings: [
        { key: 'referenceCallBooked', label: 'Reference call booked', description: 'When a prospect books a call with an advocate' },
        { key: 'referenceCallReminder', label: 'Reference call reminders', description: '24h and 1h before scheduled calls' },
        { key: 'referenceCallCompleted', label: 'Reference call completed', description: 'When a reference call is finished' },
        { key: 'advocateInvited', label: 'Advocate invitations', description: 'When you invite new advocates' },
        { key: 'teamMemberJoined', label: 'Team member joined', description: 'When someone accepts your team invitation' },
        { key: 'weeklyReport', label: 'Weekly reports', description: 'Summary of your reference program activity' },
        { key: 'monthlyReport', label: 'Monthly reports', description: 'Detailed monthly performance summary' },
        { key: 'systemUpdates', label: 'System updates', description: 'Important product updates and announcements' },
      ],
    },
    {
      id: 'inApp',
      title: 'In-App Notifications',
      description: 'Get notified while using PeerChamps',
      icon: <BellIcon size={20} />,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      settings: [
        { key: 'referenceCallBooked', label: 'Reference call booked', description: 'When a prospect books a call with an advocate' },
        { key: 'referenceCallReminder', label: 'Reference call reminders', description: '24h and 1h before scheduled calls' },
        { key: 'referenceCallCompleted', label: 'Reference call completed', description: 'When a reference call is finished' },
        { key: 'advocateInvited', label: 'Advocate invitations', description: 'When you invite new advocates' },
        { key: 'teamMemberJoined', label: 'Team member joined', description: 'When someone accepts your team invitation' },
        { key: 'newOpportunity', label: 'New opportunities', description: 'When new opportunities are created' },
        { key: 'opportunityUpdated', label: 'Opportunity updates', description: 'When opportunities are updated' },
        { key: 'systemUpdates', label: 'System updates', description: 'Important product updates and announcements' },
      ],
    },
    {
      id: 'sms',
      title: 'SMS Notifications',
      description: 'Critical updates via text message',
      icon: <PhoneIcon size={20} />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      settings: [
        { key: 'referenceCallReminder', label: 'Reference call reminders', description: '1h before scheduled calls' },
        { key: 'urgentNotifications', label: 'Urgent notifications', description: 'Critical system alerts and security updates' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-amaranth-500 to-sundown-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <BellIcon size={24} className="text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Configure Your Notifications
        </h3>
        <p className="text-gray-600">
          Choose how you'd like to be notified about important events and updates.
        </p>
      </div>

      {/* Notification Categories */}
      <div className="space-y-6">
        {notificationCategories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', category.bgColor)}>
                  <div className={category.color}>
                    {category.icon}
                  </div>
                </div>
                <div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              </div>
            </CardHeader>
            
            <CardBody>
              <div className="space-y-4">
                {category.settings.map((setting) => (
                  <div key={setting.key} className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {setting.label}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {setting.description}
                      </p>
                    </div>
                    <div className="ml-4">
                      <Switch
                        checked={
                          category.id === 'email' 
                            ? settings.email[setting.key as keyof NotificationSettings['email']]
                            : category.id === 'inApp'
                            ? settings.inApp[setting.key as keyof NotificationSettings['inApp']]
                            : settings.sms[setting.key as keyof NotificationSettings['sms']]
                        }
                        onChange={() => {
                          if (category.id === 'email') {
                            handleEmailToggle(setting.key as keyof NotificationSettings['email']);
                          } else if (category.id === 'inApp') {
                            handleInAppToggle(setting.key as keyof NotificationSettings['inApp']);
                          } else {
                            handleSmsToggle(setting.key as keyof NotificationSettings['sms']);
                          }
                        }}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Privacy Notice */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <ShieldCheckIcon size={20} className="text-gray-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-gray-900 mb-1">
              Privacy & Security
            </h4>
            <p className="text-sm text-gray-600">
              We respect your privacy. You can change these settings anytime in your account preferences. 
              We never share your contact information with third parties.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <Button
          variant="ghost"
          onClick={onSkip}
          disabled={isLoading}
        >
          Skip for now
        </Button>
        
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save & Continue'}
        </Button>
      </div>
    </div>
  );
};
