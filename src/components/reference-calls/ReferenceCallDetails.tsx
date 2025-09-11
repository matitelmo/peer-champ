/**
 * Reference Call Details Component
 *
 * Displays detailed information about a reference call including
 * scheduling, participants, preparation materials, and feedback.
 */

'use client';

import React, { useState } from 'react';
import { useReferenceCalls } from '@/hooks/useReferenceCalls';
import { ReferenceCall } from '@/types/database';
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardDescription,
  Button,
  Badge,
  Alert,
  LoadingOverlay,
  Tabs,



} from '@/components/ui';
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  BuildingOfficeIcon,
  VideoCameraIcon,
  PhoneIcon,
  MapPinIcon,
  StarIcon,
  MessageSquareIcon,
  FileTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
} from '@/components/ui/icons';

interface ReferenceCallDetailsProps {
  callId: string;
  onEdit?: (call: ReferenceCall) => void;
  onClose?: () => void;
  className?: string;
}

export const ReferenceCallDetails: React.FC<ReferenceCallDetailsProps> = ({
  callId,
  onEdit,
  onClose,
  className = '',
}) => {
  const { calls, loading, error } = useReferenceCalls();
  const [activeTab, setActiveTab] = useState('overview');

  // Find the specific call
  const call = calls.find((c) => c.id === callId);

  if (loading) {
    return (
      <div className="relative min-h-96">
        <LoadingOverlay visible={true} />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error">
        <AlertCircleIcon size={20} />
        <div>
          <h4 className="font-semibold">Error loading call details</h4>
          <p>{error}</p>
        </div>
      </Alert>
    );
  }

  if (!call) {
    return (
      <Alert variant="error">
        <AlertCircleIcon size={20} />
        <div>
          <h4 className="font-semibold">Call not found</h4>
          <p>The reference call you're looking for could not be found.</p>
        </div>
      </Alert>
    );
  }

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'default';
      case 'in_progress':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'destructive';
      case 'no_show':
        return 'secondary';
      default:
        return 'default';
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format duration
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  };

  // Get meeting platform icon
  const getMeetingPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'zoom':
      case 'teams':
      case 'google_meet':
      case 'webex':
        return <VideoCameraIcon size={20} />;
      case 'phone':
        return <PhoneIcon size={20} />;
      default:
        return <VideoCameraIcon size={20} />;
    }
  };

  // Render star rating
  const renderStarRating = (rating: number, maxRating: number = 5) => {
    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: maxRating }, (_, i) => (
          <StarIcon
            key={i}
            size={16}
            className={
              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }
          />
        ))}
        <span className="text-sm text-gray-600 ml-2">
          ({rating}/{maxRating})
        </span>
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center space-x-3">
                <span>Reference Call Details</span>
                <Badge variant={getStatusBadgeVariant(call.status)}>
                  {call.status.replace('_', ' ')}
                </Badge>
              </CardTitle>
              <CardDescription>
                Call with {call.prospect_name || "Unknown Prospect"}
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              {onEdit && (
                <Button variant="outline" onClick={() => onEdit(call)}>
                  Edit Call
                </Button>
              )}
              {onClose && (
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <Tabs 
        value={activeTab} 
        onChange={setActiveTab} 
        items={[
          { label: "Overview", value: "overview" },
          { label: "Preparation", value: "preparation" },
          { label: "Feedback", value: "feedback" },
          { label: "Intelligence", value: "intelligence" }
        ]}
      />

        {/* Overview Tab */}
        {activeTab === "overview" && (<div className="space-y-6">
          {/* Scheduling Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon size={20} className="mr-2" />
                Scheduling Information
              </CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Scheduled Date & Time
                  </label>
                  <p className="text-sm text-gray-900">
                    {call.scheduled_at ? formatDate(call.scheduled_at) : "Not scheduled"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Duration
                  </label>
                  <p className="text-sm text-gray-900">
                    {call.duration_minutes
                      ? formatDuration(call.duration_minutes)
                      : 'Not specified'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Timezone
                  </label>
                  <p className="text-sm text-gray-900">
                    {call.timezone || 'UTC'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <Badge variant={getStatusBadgeVariant(call.status)}>
                    {call.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Meeting Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {getMeetingPlatformIcon(call.meeting_platform || 'zoom')}
                <span className="ml-2">Meeting Information</span>
              </CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Platform
                  </label>
                  <p className="text-sm text-gray-900 capitalize">
                    {call.meeting_platform || 'Not specified'}
                  </p>
                </div>
                {call.meeting_link && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Meeting Link
                    </label>
                    <p className="text-sm">
                      <a
                        href={call.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        Join Meeting
                      </a>
                    </p>
                  </div>
                )}
                {call.meeting_id && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Meeting ID
                    </label>
                    <p className="text-sm text-gray-900">{call.meeting_id}</p>
                  </div>
                )}
                {call.meeting_password && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <p className="text-sm text-gray-900">
                      {call.meeting_password}
                    </p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Participants */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Advocate Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserIcon size={20} className="mr-2" />
                  Advocate
                </CardTitle>
              </CardHeader>
              <CardBody className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <p className="text-sm text-gray-900">{call.advocate_id || "Unknown Advocate"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Company
                  </label>
                  <p className="text-sm text-gray-900">
                    {"Company not available"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Briefed
                  </label>
                  <div className="flex items-center">
                    {call.advocate_briefed ? (
                      <CheckCircleIcon
                        size={16}
                        className="text-green-500 mr-1"
                      />
                    ) : (
                      <XCircleIcon size={16} className="text-red-500 mr-1" />
                    )}
                    <span className="text-sm">
                      {call.advocate_briefed ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Prospect Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BuildingOfficeIcon size={20} className="mr-2" />
                  Prospect
                </CardTitle>
              </CardHeader>
              <CardBody className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <p className="text-sm text-gray-900">{call.prospect_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <p className="text-sm text-gray-900">
                    {call.prospect_title || 'Not specified'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Company
                  </label>
                  <p className="text-sm text-gray-900">
                    {call.prospect_company}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <p className="text-sm text-gray-900">{call.prospect_email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Briefed
                  </label>
                  <div className="flex items-center">
                    {call.prospect_briefed ? (
                      <CheckCircleIcon
                        size={16}
                        className="text-green-500 mr-1"
                      />
                    ) : (
                      <XCircleIcon size={16} className="text-red-500 mr-1" />
                    )}
                    <span className="text-sm">
                      {call.prospect_briefed ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>)}

        {/* Preparation Tab */}
        {activeTab === "preparation" && (<div className="space-y-6">
          {/* Talking Points */}
          {call.talking_points && call.talking_points.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquareIcon size={20} className="mr-2" />
                  Talking Points
                </CardTitle>
              </CardHeader>
              <CardBody>
                <ul className="space-y-2">
                  {call.talking_points.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span className="text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          )}

          {/* Questions to Cover */}
          {call.questions_to_cover && call.questions_to_cover.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileTextIcon size={20} className="mr-2" />
                  Questions to Cover
                </CardTitle>
              </CardHeader>
              <CardBody>
                <ul className="space-y-2">
                  {call.questions_to_cover.map((question, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">?</span>
                      <span className="text-sm">{question}</span>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          )}

          {/* Internal Notes */}
          {call.internal_notes && (
            <Card>
              <CardHeader>
                <CardTitle>Internal Notes</CardTitle>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {call.internal_notes}
                </p>
              </CardBody>
            </Card>
          )}
        </div>)}

        {/* Feedback Tab */}
        {activeTab === "feedback" && (<div className="space-y-6">
          {/* Call Ratings */}
          <Card>
            <CardHeader>
              <CardTitle>Call Ratings</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {call.advocate_rating && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Advocate Rating
                    </label>
                    <div className="mt-1">
                      {renderStarRating(call.advocate_rating)}
                    </div>
                  </div>
                )}
                {call.call_quality_rating && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Call Quality
                    </label>
                    <div className="mt-1">
                      {renderStarRating(call.call_quality_rating)}
                    </div>
                  </div>
                )}
                {call.technical_quality_score && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Technical Quality
                    </label>
                    <div className="mt-1">
                      {renderStarRating(call.technical_quality_score)}
                    </div>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* AI Summary */}
          {call.ai_summary && (
            <Card>
              <CardHeader>
                <CardTitle>AI Summary</CardTitle>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {call.ai_summary}
                </p>
              </CardBody>
            </Card>
          )}

          {/* Key Topics */}
          {call.key_topics_discussed &&
            call.key_topics_discussed.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Key Topics Discussed</CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="flex flex-wrap gap-2">
                    {call.key_topics_discussed.map((topic, index) => (
                      <Badge key={index} variant="secondary">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}
        </div>)}

        {/* Intelligence Tab */}
        {activeTab === "intelligence" && (<div className="space-y-6">
          {/* Call Intelligence */}
          {call.call_intelligence && (
            <Card>
              <CardHeader>
                <CardTitle>Call Intelligence</CardTitle>
              </CardHeader>
              <CardBody>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded">
                  {JSON.stringify(call.call_intelligence, null, 2)}
                </pre>
              </CardBody>
            </Card>
          )}

          {/* Sentiment Score */}
          {call.sentiment_score && (
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Analysis</CardTitle>
              </CardHeader>
              <CardBody>
                <div className="flex items-center space-x-4">
                  <div className="text-2xl font-bold">
                    {call.sentiment_score > 0 ? '+' : ''}
                    {call.sentiment_score}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      {call.sentiment_score > 0.5
                        ? 'Very Positive'
                        : call.sentiment_score > 0
                          ? 'Positive'
                          : call.sentiment_score > -0.5
                            ? 'Neutral'
                            : call.sentiment_score > -1
                              ? 'Negative'
                              : 'Very Negative'}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Follow-up Actions */}
          {call.follow_up_actions && call.follow_up_actions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Follow-up Actions</CardTitle>
              </CardHeader>
              <CardBody>
                <ul className="space-y-2">
                  {call.follow_up_actions.map((action, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-orange-500 mr-2">→</span>
                      <span className="text-sm">{action}</span>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          )}
        </div>)}
    </div>
  );
};
