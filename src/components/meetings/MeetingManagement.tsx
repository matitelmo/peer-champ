/**
 * Meeting Management Component
 *
 * Provides UI for updating and cancelling meetings with participant notifications.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useMeetingUpdates } from '@/hooks/useMeetingUpdates';
import { Button, Card, CardHeader, CardTitle, CardBody, Input, Textarea, Select, Alert, Badge } from '@/components/ui';
import { 
  CalendarIcon, 
  ClockIcon, 
  UserIcon,
  TrashIcon,
  EditIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InfoIcon,
  HistoryIcon
} from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { ReferenceCall } from '@/types/database';

interface MeetingManagementProps {
  referenceCall: ReferenceCall;
  onUpdate?: (updatedCall: ReferenceCall) => void;
  onCancel?: (cancelledCall: ReferenceCall) => void;
  className?: string;
}

export const MeetingManagement: React.FC<MeetingManagementProps> = ({
  referenceCall,
  onUpdate,
  onCancel,
  className = '',
}) => {
  const {
    updateMeeting,
    cancelMeeting,
    getMeetingHistory,
    isUpdating,
    isCancelling,
    isLoadingHistory,
    updateError,
    cancellationError,
    clearUpdateError,
    clearCancellationError,
  } = useMeetingUpdates();

  // Update form state
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    title: `Reference Call: ${referenceCall.prospect_company}`,
    description: `Reference call between ${referenceCall.prospect_name} and advocate`,
    scheduled_at: referenceCall.scheduled_at,
    duration_minutes: referenceCall.duration_minutes || 30,
    notifyParticipants: true,
  });

  // Cancellation form state
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [notifyOnCancel, setNotifyOnCancel] = useState(true);

  // History state
  const [showHistory, setShowHistory] = useState(false);
  const [meetingHistory, setMeetingHistory] = useState<any[]>([]);

  // Load meeting history when component mounts or history is requested
  useEffect(() => {
    if (showHistory && meetingHistory.length === 0) {
      loadMeetingHistory();
    }
  }, [showHistory]);

  const loadMeetingHistory = async () => {
    const history = await getMeetingHistory(referenceCall.id);
    setMeetingHistory(history);
  };

  const handleUpdateMeeting = async () => {
    if (!referenceCall.meeting_id || !referenceCall.meeting_platform) {
      console.error('Missing meeting ID or platform');
      return;
    }

    const updateData = {
      referenceCallId: referenceCall.id,
      meetingId: referenceCall.meeting_id,
      platform: referenceCall.meeting_platform,
      updates: {
        title: updateForm.title,
        description: updateForm.description,
        scheduled_at: updateForm.scheduled_at || undefined,
        duration_minutes: updateForm.duration_minutes,
      },
      notifyParticipants: updateForm.notifyParticipants,
    };

    const result = await updateMeeting(updateData);
    
    if (result.success) {
      setShowUpdateForm(false);
      // Call the onUpdate callback if provided
      if (onUpdate) {
        onUpdate({
          ...referenceCall,
          scheduled_at: updateForm.scheduled_at,
          duration_minutes: updateForm.duration_minutes,
        });
      }
    }
  };

  const handleCancelMeeting = async () => {
    if (!referenceCall.meeting_id || !referenceCall.meeting_platform) {
      console.error('Missing meeting ID or platform');
      return;
    }

    const cancelData = {
      referenceCallId: referenceCall.id,
      meetingId: referenceCall.meeting_id,
      platform: referenceCall.meeting_platform,
      reason: cancelReason,
      notifyParticipants: notifyOnCancel,
    };

    const result = await cancelMeeting(cancelData);
    
    if (result.success) {
      setShowCancelForm(false);
      setCancelReason('');
      // Call the onCancel callback if provided
      if (onCancel) {
        onCancel({
          ...referenceCall,
          status: 'cancelled',
        });
      }
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'success'> = {
      scheduled: 'default',
      confirmed: 'success',
      cancelled: 'destructive',
      completed: 'secondary',
    };
    
    return (
      <Badge variant={variants[status] || 'default'}>
        {status}
      </Badge>
    );
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Meeting Management</h3>
          <p className="text-sm text-gray-600">Update or cancel your scheduled meeting</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
          >
            <HistoryIcon size={16} className="mr-2" />
            History
          </Button>
        </div>
      </div>

      {/* Current Meeting Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Current Meeting Details</span>
            {getStatusBadge(referenceCall.status)}
          </CardTitle>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <CalendarIcon size={16} className="text-gray-500 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-700">Scheduled Time</p>
                <p className="text-sm text-gray-600">{referenceCall.scheduled_at ? formatDateTime(referenceCall.scheduled_at) : 'Not scheduled'}</p>
              </div>
            </div>
            <div className="flex items-center">
              <ClockIcon size={16} className="text-gray-500 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-700">Duration</p>
                <p className="text-sm text-gray-600">{referenceCall.duration_minutes || 30} minutes</p>
              </div>
            </div>
          </div>

          {referenceCall.meeting_link && (
            <div className="flex items-center">
              <InfoIcon size={16} className="text-gray-500 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-700">Meeting Link</p>
                <a 
                  href={referenceCall.meeting_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {referenceCall.meeting_link}
                </a>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button
          onClick={() => setShowUpdateForm(true)}
          disabled={referenceCall.status === 'cancelled' || isUpdating}
        >
          <EditIcon size={16} className="mr-2" />
          Update Meeting
        </Button>
        <Button
          variant="destructive"
          onClick={() => setShowCancelForm(true)}
          disabled={referenceCall.status === 'cancelled' || isCancelling}
        >
          <TrashIcon size={16} className="mr-2" />
          Cancel Meeting
        </Button>
      </div>

      {/* Update Form */}
      {showUpdateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Update Meeting</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            {updateError && (
              <Alert variant="error">
                <ExclamationTriangleIcon size={16} className="mr-2" />
                {updateError}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearUpdateError}
                  className="ml-2"
                >
                  Dismiss
                </Button>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Title
                </label>
                <Input
                  value={updateForm.title}
                  onChange={(e) => setUpdateForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <Input
                  type="number"
                  value={updateForm.duration_minutes}
                  onChange={(e) => setUpdateForm(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) || 30 }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scheduled Time
              </label>
              <Input
                type="datetime-local"
                value={updateForm.scheduled_at ? new Date(updateForm.scheduled_at).toISOString().slice(0, 16) : ''}
                onChange={(e) => setUpdateForm(prev => ({ ...prev, scheduled_at: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Textarea
                value={updateForm.description}
                onChange={(e) => setUpdateForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="notify-participants"
                checked={updateForm.notifyParticipants}
                onChange={(e) => setUpdateForm(prev => ({ ...prev, notifyParticipants: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <label htmlFor="notify-participants" className="text-sm text-gray-700">
                Notify all participants about the update
              </label>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={handleUpdateMeeting}
                disabled={isUpdating}
                className="flex-1"
              >
                <CheckIcon size={16} className="mr-2" />
                {isUpdating ? 'Updating...' : 'Update Meeting'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowUpdateForm(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Cancel Form */}
      {showCancelForm && (
        <Card>
          <CardHeader>
            <CardTitle>Cancel Meeting</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            {cancellationError && (
              <Alert variant="error">
                <ExclamationTriangleIcon size={16} className="mr-2" />
                {cancellationError}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCancellationError}
                  className="ml-2"
                >
                  Dismiss
                </Button>
              </Alert>
            )}

            <Alert variant="warning">
              <ExclamationTriangleIcon size={16} className="mr-2" />
              This action cannot be undone. The meeting will be cancelled and all participants will be notified.
            </Alert>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Cancellation (Optional)
              </label>
              <Textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Enter the reason for cancelling this meeting..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="notify-on-cancel"
                checked={notifyOnCancel}
                onChange={(e) => setNotifyOnCancel(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="notify-on-cancel" className="text-sm text-gray-700">
                Notify all participants about the cancellation
              </label>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="destructive"
                onClick={handleCancelMeeting}
                disabled={isCancelling}
                className="flex-1"
              >
                <TrashIcon size={16} className="mr-2" />
                {isCancelling ? 'Cancelling...' : 'Cancel Meeting'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCancelForm(false)}
                disabled={isCancelling}
              >
                Keep Meeting
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Meeting History */}
      {showHistory && (
        <Card>
          <CardHeader>
            <CardTitle>Meeting History</CardTitle>
          </CardHeader>
          <CardBody>
            {isLoadingHistory ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">Loading history...</p>
              </div>
            ) : meetingHistory.length === 0 ? (
              <p className="text-sm text-gray-600 text-center py-4">No meeting history available.</p>
            ) : (
              <div className="space-y-3">
                {meetingHistory.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Meeting {entry.action}
                      </p>
                      <p className="text-xs text-gray-600">
                        {new Date(entry.timestamp).toLocaleString()}
                      </p>
                      {entry.details?.reason && (
                        <p className="text-xs text-gray-500 mt-1">
                          Reason: {entry.details.reason}
                        </p>
                      )}
                    </div>
                    <Badge variant="outline">
                      {entry.action}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
};
