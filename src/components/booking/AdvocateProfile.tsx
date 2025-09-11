/**
 * Advocate Profile Component
 *
 * Enhanced advocate profile display for the booking experience.
 * Shows professional information, testimonials, and success stories.
 */

'use client';

import React from 'react';
import { Advocate } from '@/types/database';
import { Card, CardBody, Badge, Avatar } from '@/components/ui';
import {
  StarIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  UserIcon,
  CheckCircleIcon,
  AwardIcon,
} from '@/components/ui/icons';

interface AdvocateProfileProps {
  advocate: Advocate;
  className?: string;
}

export const AdvocateProfile: React.FC<AdvocateProfileProps> = ({
  advocate,
  className = '',
}) => {
  // Format expertise areas for display
  const formatExpertiseAreas = (areas: string[] | null) => {
    if (!areas || areas.length === 0) return [];
    return areas.slice(0, 5); // Show max 5 areas
  };

  // Format use cases for display
  const formatUseCases = (useCases: string[] | null) => {
    if (!useCases || useCases.length === 0) return [];
    return useCases.slice(0, 3); // Show max 3 use cases
  };

  // Generate star rating display
  const renderStarRating = (rating: number | null) => {
    if (!rating) return null;
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarIcon
          key={i}
          size={16}
          className="text-yellow-400 fill-current"
        />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <StarIcon
          key="half"
          size={16}
          className="text-yellow-400 fill-current opacity-50"
        />
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <StarIcon
          key={`empty-${i}`}
          size={16}
          className="text-gray-300"
        />
      );
    }
    
    return (
      <div className="flex items-center space-x-1">
        {stars}
        <span className="text-sm text-gray-600 ml-1">
          {rating.toFixed(1)} ({advocate.total_ratings || 0} reviews)
        </span>
      </div>
    );
  };

  const expertiseAreas = formatExpertiseAreas(advocate.expertise_areas);
  const useCases = formatUseCases(advocate.use_cases);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Profile Card */}
      <Card>
        <CardBody className="p-6">
          <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
            {/* Profile Photo and Basic Info */}
            <div className="flex flex-col items-center md:items-start space-y-4">
              <Avatar
                size="xl"
                src={advocate.profile_photo_url || undefined}
                alt={advocate.name}
                fallback={
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                    {advocate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                }
              />
              
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {advocate.name}
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  {advocate.title}
                </p>
                {advocate.company_name && (
                  <div className="flex items-center justify-center md:justify-start space-x-1 mt-1">
                    <BuildingOfficeIcon size={16} className="text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {advocate.company_name}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Details */}
            <div className="flex-1 space-y-4">
              {/* Rating and Stats */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div>
                  {renderStarRating(advocate.average_rating)}
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <CheckCircleIcon size={16} className="text-green-500" />
                    <span>{advocate.total_calls_completed || 0} calls completed</span>
                  </div>
                  {advocate.availability_score && (
                    <div className="flex items-center space-x-1">
                      <AwardIcon size={16} className="text-blue-500" />
                      <span>{advocate.availability_score}% availability</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Industry and Location */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                {advocate.industry && (
                  <div className="flex items-center space-x-1">
                    <BuildingOfficeIcon size={16} className="text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {advocate.industry}
                    </span>
                  </div>
                )}
                {advocate.geographic_region && (
                  <div className="flex items-center space-x-1">
                    <MapPinIcon size={16} className="text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {advocate.geographic_region}
                    </span>
                  </div>
                )}
                {advocate.company_size && (
                  <div className="flex items-center space-x-1">
                    <UserIcon size={16} className="text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {advocate.company_size} employees
                    </span>
                  </div>
                )}
              </div>

              {/* Bio */}
              {advocate.bio && (
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {advocate.bio}
                  </p>
                </div>
              )}

              {/* Expertise Areas */}
              {expertiseAreas.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Areas of Expertise
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {expertiseAreas.map((area, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                    {advocate.expertise_areas && advocate.expertise_areas.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{advocate.expertise_areas.length - 5} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Use Cases */}
              {useCases.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Relevant Use Cases
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {useCases.map((useCase, index) => (
                      <Badge key={index} variant="default" className="text-xs">
                        {useCase}
                      </Badge>
                    ))}
                    {advocate.use_cases && advocate.use_cases.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{advocate.use_cases.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Testimonials and Success Stories */}
      {(advocate.testimonials || advocate.success_stories) && (
        <Card>
          <CardBody className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              What Others Say
            </h3>
            
            {advocate.testimonials && (
              <div className="space-y-4">
                {advocate.testimonials.slice(0, 2).map((testimonial, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <blockquote className="text-gray-700 dark:text-gray-300 italic">
                      "{testimonial.quote}"
                    </blockquote>
                    <cite className="text-sm text-gray-600 dark:text-gray-400 mt-2 block">
                      — {testimonial.author}, {testimonial.title}
                    </cite>
                  </div>
                ))}
              </div>
            )}

            {advocate.success_stories && (
              <div className="mt-6">
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                  Success Stories
                </h4>
                <div className="space-y-3">
                  {advocate.success_stories.slice(0, 2).map((story, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                        {story.title}
                      </h5>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {story.description}
                      </p>
                      {story.metrics && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {story.metrics.map((metric, metricIndex) => (
                            <Badge key={metricIndex} variant="success" className="text-xs">
                              {metric}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {/* Availability Status */}
      <Card>
        <CardBody className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                advocate.availability_score && advocate.availability_score > 80
                  ? 'bg-green-500'
                  : advocate.availability_score && advocate.availability_score > 50
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`} />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {advocate.availability_score && advocate.availability_score > 80
                  ? 'Highly Available'
                  : advocate.availability_score && advocate.availability_score > 50
                  ? 'Moderately Available'
                  : 'Limited Availability'}
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {advocate.max_calls_per_month || 4} calls per month max
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
