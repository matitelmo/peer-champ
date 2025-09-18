/**
 * Profile Completion Step Component
 * 
 * Step for completing user profile with photo, bio, and contact information.
 */

'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Avatar } from '@/components/ui/Avatar';
import { Alert } from '@/components/ui/Alert';
import { 
  CameraIcon, 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingOfficeIcon,
} from '@/components/ui/icons';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface ProfileCompletionStepProps {
  onNext: (data?: any) => void;
  onPrevious: () => void;
  onSkip: () => void;
  onComplete: () => void;
  isLoading: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  title: string;
  company: string;
  location: string;
  bio: string;
  avatar: File | null;
  avatarUrl: string;
}

export const ProfileCompletionStep: React.FC<ProfileCompletionStepProps> = ({
  onNext,
  onSkip,
  isLoading,
}) => {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: user?.user_metadata?.first_name || '',
    lastName: user?.user_metadata?.last_name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
    title: user?.user_metadata?.title || '',
    company: user?.user_metadata?.company || '',
    location: user?.user_metadata?.location || '',
    bio: user?.user_metadata?.bio || '',
    avatar: null,
    avatarUrl: user?.user_metadata?.avatar_url || '',
  });

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isUploading, setIsUploading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string | undefined> = {};

    if (!profileData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!profileData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!profileData.title.trim()) {
      newErrors.title = 'Job title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ProfileData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setProfileData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, avatar: 'Please select an image file' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setErrors(prev => ({ ...prev, avatar: 'File size must be less than 5MB' }));
      return;
    }

    setIsUploading(true);
    setErrors(prev => ({ ...prev, avatar: undefined }));

    try {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setProfileData(prev => ({ 
        ...prev, 
        avatar: file, 
        avatarUrl: previewUrl 
      }));
    } catch (error) {
      setErrors(prev => ({ 
        ...prev, 
        avatar: 'Failed to process image' 
      }));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      // Update user profile with basic info
      const { error } = await updateProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
      });

      if (error) {
        setErrors({ avatar: error.message });
        return;
      }

      // TODO: Store additional profile data in our database
      // This would include phone, title, company, location, bio, avatar
      console.log('Additional profile data to store:', {
        phone: profileData.phone,
        title: profileData.title,
        company: profileData.company,
        location: profileData.location,
        bio: profileData.bio,
        avatar: profileData.avatar,
      });

      onNext(profileData);
    } catch (error) {
      setErrors({ avatar: 'Failed to update profile' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="text-center">
        <div className="relative inline-block">
          <Avatar
            src={profileData.avatarUrl}
            alt={`${profileData.firstName} ${profileData.lastName}`}
            size="xl"
            className="w-24 h-24"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="absolute -bottom-2 -right-2 w-8 h-8 bg-amaranth-500 text-white rounded-full flex items-center justify-center hover:bg-amaranth-600 transition-colors disabled:opacity-50"
          >
            <CameraIcon size={16} />
          </button>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="hidden"
        />
        
        <p className="text-sm text-gray-600 mt-2">
          Click the camera icon to upload a profile photo
        </p>
        
        {errors.avatar && (
          <p className="text-sm text-red-600 mt-1">{errors.avatar}</p>
        )}
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <UserIcon size={16} className="inline mr-2" />
            First Name *
          </label>
          <Input
            value={profileData.firstName}
            onChange={handleInputChange('firstName')}
            placeholder="Enter your first name"
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
            value={profileData.lastName}
            onChange={handleInputChange('lastName')}
            placeholder="Enter your last name"
            variant={errors.lastName ? 'error' : 'default'}
            disabled={isLoading}
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <EnvelopeIcon size={16} className="inline mr-2" />
            Email Address *
          </label>
          <Input
            type="email"
            value={profileData.email}
            onChange={handleInputChange('email')}
            placeholder="Enter your email"
            variant={errors.email ? 'error' : 'default'}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <PhoneIcon size={16} className="inline mr-2" />
            Phone Number
          </label>
          <Input
            type="tel"
            value={profileData.phone}
            onChange={handleInputChange('phone')}
            placeholder="Enter your phone number"
            disabled={isLoading}
          />
        </div>

        {/* Job Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <BuildingOfficeIcon size={16} className="inline mr-2" />
            Job Title *
          </label>
          <Input
            value={profileData.title}
            onChange={handleInputChange('title')}
            placeholder="e.g., Sales Manager, Account Executive"
            variant={errors.title ? 'error' : 'default'}
            disabled={isLoading}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Company */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <BuildingOfficeIcon size={16} className="inline mr-2" />
            Company
          </label>
          <Input
            value={profileData.company}
            onChange={handleInputChange('company')}
            placeholder="Enter your company name"
            disabled={isLoading}
          />
        </div>

        {/* Location */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPinIcon size={16} className="inline mr-2" />
            Location
          </label>
          <Input
            value={profileData.location}
            onChange={handleInputChange('location')}
            placeholder="e.g., San Francisco, CA"
            disabled={isLoading}
          />
        </div>

        {/* Bio */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <Textarea
            value={profileData.bio}
            onChange={handleInputChange('bio')}
            placeholder="Tell us a bit about yourself and your role..."
            rows={4}
            disabled={isLoading}
          />
          <p className="mt-1 text-sm text-gray-500">
            Optional: A brief description of yourself and your role
          </p>
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
          disabled={isLoading || isUploading}
        >
          {isLoading ? 'Saving...' : 'Save & Continue'}
        </Button>
      </div>
    </div>
  );
};
