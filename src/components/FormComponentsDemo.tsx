/**
 * Form Components Demo
 *
 * A comprehensive demo showcasing all form input components with various states and configurations.
 * This component demonstrates the usage and capabilities of the form input system.
 */

'use client';

import React, { useState } from 'react';
import {
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
  Toggle,
  Button,
  SearchIcon,
  UserIcon,
  MailIcon,
  LockIcon,
} from './ui';

const FormComponentsDemo: React.FC = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    message: '',
    country: '',
    newsletter: false,
    notifications: false,
    theme: 'light',
    terms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle input changes
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Simple validation
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.terms) newErrors.terms = 'You must accept the terms';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert('Form submitted successfully!');
    }
  };

  // Select options
  const countryOptions = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'jp', label: 'Japan' },
    { value: 'au', label: 'Australia' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
          Form Components Demo
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400">
          Comprehensive showcase of all form input components with various
          states and configurations.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Input Components Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 border-b border-secondary-200 dark:border-secondary-700 pb-2">
            Input Components
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Input */}
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              leftIcon={<UserIcon className="h-4 w-4" />}
              required
              errorMessage={errors.name}
            />

            {/* Email Input */}
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              leftIcon={<MailIcon className="h-4 w-4" />}
              required
              errorMessage={errors.email}
            />

            {/* Password Input */}
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              leftIcon={<LockIcon className="h-4 w-4" />}
              required
              errorMessage={errors.password}
            />

            {/* Search Input */}
            <Input
              label="Search"
              placeholder="Search for something..."
              leftIcon={<SearchIcon className="h-4 w-4" />}
              helpText="Enter keywords to search"
            />

            {/* Input with Success State */}
            <Input
              label="Username"
              placeholder="Enter username"
              value="john_doe"
              successMessage="Username is available"
              showValidationIcon
            />

            {/* Input with Warning State */}
            <Input
              label="Phone Number"
              placeholder="Enter phone number"
              value="123-456-7890"
              warningMessage="Please verify your phone number"
              showValidationIcon
            />
          </div>
        </section>

        {/* Textarea Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 border-b border-secondary-200 dark:border-secondary-700 pb-2">
            Textarea Component
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Textarea
              label="Message"
              placeholder="Enter your message here..."
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              helpText="Please provide detailed information"
              rows={4}
            />

            <Textarea
              label="Comments"
              placeholder="Add your comments..."
              maxLength={200}
              showCharCount
              helpText="Maximum 200 characters"
            />
          </div>
        </section>

        {/* Select Component Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 border-b border-secondary-200 dark:border-secondary-700 pb-2">
            Select Component
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Country"
              placeholder="Select your country"
              options={countryOptions}
              value={formData.country}
              onChange={(value) => handleInputChange('country', value)}
              helpText="Choose your country of residence"
            />

            <Select
              label="Searchable Select"
              placeholder="Search and select..."
              options={countryOptions}
              searchable
              helpText="Type to search options"
            />
          </div>
        </section>

        {/* Checkbox and Radio Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 border-b border-secondary-200 dark:border-secondary-700 pb-2">
            Checkbox and Radio Components
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Checkboxes */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100">
                Checkboxes
              </h3>

              <Checkbox
                label="Subscribe to newsletter"
                checked={formData.newsletter}
                onChange={(e) =>
                  handleInputChange('newsletter', e.target.checked)
                }
                helpText="Receive updates about new features"
              />

              <Checkbox
                label="Accept terms and conditions"
                checked={formData.terms}
                onChange={(e) => handleInputChange('terms', e.target.checked)}
                required
                errorMessage={errors.terms}
              />

              <Checkbox
                label="Disabled checkbox"
                disabled
                helpText="This checkbox is disabled"
              />
            </div>

            {/* Radio Buttons */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100">
                Radio Buttons
              </h3>

              <Radio
                name="theme"
                label="Light theme"
                value="light"
                checked={formData.theme === 'light'}
                onChange={(e) => handleInputChange('theme', e.target.value)}
              />

              <Radio
                name="theme"
                label="Dark theme"
                value="dark"
                checked={formData.theme === 'dark'}
                onChange={(e) => handleInputChange('theme', e.target.value)}
              />

              <Radio
                name="theme"
                label="System theme"
                value="system"
                checked={formData.theme === 'system'}
                onChange={(e) => handleInputChange('theme', e.target.value)}
                helpText="Follow system preference"
              />
            </div>
          </div>
        </section>

        {/* Toggle Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 border-b border-secondary-200 dark:border-secondary-700 pb-2">
            Toggle Components
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Toggle
              label="Push notifications"
              checked={formData.notifications}
              onChange={(checked) =>
                handleInputChange('notifications', checked)
              }
              helpText="Receive push notifications on your device"
            />

            <Toggle
              label="Email notifications"
              checked={true}
              helpText="Receive notifications via email"
            />

            <Toggle
              label="Disabled toggle"
              disabled
              helpText="This toggle is disabled"
            />

            <Toggle
              label="Small toggle"
              size="sm"
              checked={false}
              helpText="Small size variant"
            />
          </div>
        </section>

        {/* Form Actions */}
        <section className="flex justify-end space-x-4 pt-6 border-t border-secondary-200 dark:border-secondary-700">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFormData({
                name: '',
                email: '',
                password: '',
                message: '',
                country: '',
                newsletter: false,
                notifications: false,
                theme: 'light',
                terms: false,
              });
              setErrors({});
            }}
          >
            Reset Form
          </Button>

          <Button type="submit">Submit Form</Button>
        </section>
      </form>
    </div>
  );
};

export default FormComponentsDemo;
