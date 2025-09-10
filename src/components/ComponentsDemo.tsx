/**
 * Components Demo Component
 *
 * A showcase of all the UI components we've built.
 * This component serves as both documentation and visual testing.
 */

import React from 'react';
import { Button } from '@/components/ui';
import {
  PlusIcon,
  SaveIcon,
  TrashIcon,
  EditIcon,
  DownloadIcon,
  RefreshIcon,
  CheckIcon,
  AlertTriangleIcon,
} from '@/components/ui/icons';
import FormComponentsDemo from './FormComponentsDemo';
import CardComponentsDemo from './CardComponentsDemo';
import AlertNotificationDemo from './AlertNotificationDemo';
import LoadingErrorDemo from './LoadingErrorDemo';
import AuthLayoutDemo from './AuthLayoutDemo';

export function ComponentsDemo() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            PeerChamps UI Components
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            A showcase of our beautiful and accessible component library
          </p>
        </div>

        {/* Button Variants Section */}
        <section className="mb-16">
          <h2 className="mb-8 text-2xl font-semibold text-gray-900 dark:text-white">
            Button Variants
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                Primary Buttons
              </h3>
              <div className="space-y-3">
                <Button variant="primary">Primary Button</Button>
                <Button variant="primary" leftIcon={<PlusIcon size={16} />}>
                  Add Item
                </Button>
                <Button variant="primary" rightIcon={<SaveIcon size={16} />}>
                  Save Changes
                </Button>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                Secondary Buttons
              </h3>
              <div className="space-y-3">
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="secondary" leftIcon={<EditIcon size={16} />}>
                  Edit Item
                </Button>
                <Button
                  variant="secondary"
                  rightIcon={<DownloadIcon size={16} />}
                >
                  Download
                </Button>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                Outline Buttons
              </h3>
              <div className="space-y-3">
                <Button variant="outline">Outline Button</Button>
                <Button variant="outline" leftIcon={<RefreshIcon size={16} />}>
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  rightIcon={<AlertTriangleIcon size={16} />}
                >
                  Warning
                </Button>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                Ghost Buttons
              </h3>
              <div className="space-y-3">
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="ghost" leftIcon={<EditIcon size={16} />}>
                  Edit
                </Button>
                <Button variant="ghost" rightIcon={<DownloadIcon size={16} />}>
                  Download
                </Button>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                Success Buttons
              </h3>
              <div className="space-y-3">
                <Button variant="success">Success Button</Button>
                <Button variant="success" leftIcon={<CheckIcon size={16} />}>
                  Approve
                </Button>
                <Button variant="success" rightIcon={<SaveIcon size={16} />}>
                  Complete
                </Button>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                Destructive Buttons
              </h3>
              <div className="space-y-3">
                <Button variant="destructive">Delete Button</Button>
                <Button
                  variant="destructive"
                  leftIcon={<TrashIcon size={16} />}
                >
                  Delete Item
                </Button>
                <Button
                  variant="destructive"
                  rightIcon={<AlertTriangleIcon size={16} />}
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Button Sizes Section */}
        <section className="mb-16">
          <h2 className="mb-8 text-2xl font-semibold text-gray-900 dark:text-white">
            Button Sizes
          </h2>
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="md">Medium (Default)</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">Extra Large</Button>
              <Button size="icon" aria-label="Icon button">
                <PlusIcon size={16} />
              </Button>
            </div>
          </div>
        </section>

        {/* Button States Section */}
        <section className="mb-16">
          <h2 className="mb-8 text-2xl font-semibold text-gray-900 dark:text-white">
            Button States
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                Normal & Disabled
              </h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Button>Normal Button</Button>
                  <Button disabled>Disabled Button</Button>
                </div>
                <div className="flex gap-3">
                  <Button variant="secondary">Normal Secondary</Button>
                  <Button variant="secondary" disabled>
                    Disabled Secondary
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                Loading States
              </h3>
              <div className="space-y-3">
                <Button loading>Loading...</Button>
                <Button loading loadingText="Saving...">
                  Save Document
                </Button>
                <Button
                  variant="secondary"
                  loading
                  leftIcon={<SaveIcon size={16} />}
                >
                  Processing
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Full Width Section */}
        <section className="mb-16">
          <h2 className="mb-8 text-2xl font-semibold text-gray-900 dark:text-white">
            Full Width Buttons
          </h2>
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="space-y-3">
              <Button fullWidth>Full Width Primary</Button>
              <Button
                variant="secondary"
                fullWidth
                leftIcon={<SaveIcon size={16} />}
              >
                Full Width with Icon
              </Button>
              <Button
                variant="outline"
                fullWidth
                rightIcon={<DownloadIcon size={16} />}
              >
                Full Width Outline
              </Button>
            </div>
          </div>
        </section>

        {/* Interactive Examples Section */}
        <section className="mb-16">
          <h2 className="mb-8 text-2xl font-semibold text-gray-900 dark:text-white">
            Interactive Examples
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                Form Actions
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Button type="submit" leftIcon={<SaveIcon size={16} />}>
                    Save
                  </Button>
                  <Button variant="secondary" type="reset">
                    Reset
                  </Button>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                Action Groups
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Button leftIcon={<PlusIcon size={16} />}>Add</Button>
                  <Button variant="secondary" leftIcon={<EditIcon size={16} />}>
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    leftIcon={<TrashIcon size={16} />}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Examples Section */}
        <section className="mb-16">
          <h2 className="mb-8 text-2xl font-semibold text-gray-900 dark:text-white">
            Usage Examples
          </h2>
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                  Call-to-Action Section
                </h3>
                <div className="rounded-lg bg-gray-50 p-6 text-center dark:bg-gray-700">
                  <h4 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                    Ready to get started?
                  </h4>
                  <p className="mb-4 text-gray-600 dark:text-gray-300">
                    Join thousands of companies using PeerChamps.
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button size="lg">Get Started</Button>
                    <Button variant="outline" size="lg">
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                  Card Actions
                </h3>
                <div className="rounded-lg border bg-gray-50 p-6 dark:border-gray-600 dark:bg-gray-700">
                  <h4 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                    Project Settings
                  </h4>
                  <p className="mb-4 text-gray-600 dark:text-gray-300">
                    Configure your project preferences and team access.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" leftIcon={<EditIcon size={14} />}>
                      Edit
                    </Button>
                    <Button variant="secondary" size="sm">
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<TrashIcon size={14} />}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Form Components Section */}
        <section className="mb-16">
          <h2 className="mb-8 text-2xl font-semibold text-gray-900 dark:text-white">
            Form Components
          </h2>
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="text-center">
              <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                Complete Form Input System
              </h3>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Our comprehensive form input components include Input, Textarea,
                Select, Checkbox, Radio, and Toggle components with validation
                states, accessibility features, and consistent styling.
              </p>
              <div className="space-y-4">
                <FormComponentsDemo />
              </div>
            </div>
          </div>
        </section>

        {/* Card Components Section */}
        <section className="mb-16">
          <h2 className="mb-8 text-2xl font-semibold text-gray-900 dark:text-white">
            Card & Container Components
          </h2>
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="text-center">
              <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                Flexible Layout System
              </h3>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Comprehensive card and container components including basic
                cards, stat cards, profile cards, feature cards, alert cards,
                and responsive containers with various styling options and
                interactive states.
              </p>
              <div className="space-y-4">
                <CardComponentsDemo />
              </div>
            </div>
          </div>
        </section>

        {/* Alert and Notification Components Section */}
        <section className="mb-16">
          <div className="rounded-lg bg-white p-8 shadow-sm dark:bg-gray-800">
            <div className="text-center">
              <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                Alert & Notification System
              </h3>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Comprehensive alert and notification components including
                dismissible alerts, toast notifications with auto-dismiss
                functionality, inline notifications, and a complete toast
                management system with positioning and stacking.
              </p>
              <div className="space-y-4">
                <AlertNotificationDemo />
              </div>
            </div>
          </div>
        </section>

        {/* Loading and Error State Components Section */}
        <section className="mb-16">
          <div className="rounded-lg bg-white p-8 shadow-sm dark:bg-gray-800">
            <div className="text-center">
              <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                Loading & Error State Components
              </h3>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Comprehensive loading and error state components including
                spinners, skeleton loaders, loading overlays, empty states,
                error states with retry functionality, and interactive
                components with built-in loading states.
              </p>
              <div className="space-y-4">
                <LoadingErrorDemo />
              </div>
            </div>
          </div>
        </section>

        {/* AuthLayout Component Section */}
        <section className="mb-16">
          <div className="rounded-lg bg-white p-8 shadow-sm dark:bg-gray-800">
            <div className="text-center">
              <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                AuthLayout Component
              </h3>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                A comprehensive layout component for authentication pages with
                centered content, branding, responsive behavior, and support for
                various auth flows including login, registration, password
                reset, and navigation between auth states.
              </p>
              <div className="space-y-4">
                <AuthLayoutDemo />
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            This is our comprehensive UI component showcase. Each component is
            fully accessible, responsive, and follows our design system
            guidelines.
          </p>
        </footer>
      </div>
    </div>
  );
}
