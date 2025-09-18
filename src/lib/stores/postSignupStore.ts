/**
 * Post-Signup Configuration Store
 * 
 * Zustand store for managing the post-signup configuration flow state,
 * including progress tracking, tour completion, and configuration steps.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ConfigurationStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: string;
  optional?: boolean;
}

export interface TourStep {
  target: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  title?: string;
  disableBeacon?: boolean;
}

export interface PostSignupState {
  // Configuration progress
  configurationSteps: ConfigurationStep[];
  completedSteps: Set<string>;
  currentStep: string | null;
  
  // Tour state
  tourCompleted: boolean;
  tourDismissed: boolean;
  currentTourStep: number;
  
  // User preferences
  showWelcomeBanner: boolean;
  showProgressTracker: boolean;
  
  // Actions
  markStepCompleted: (stepId: string) => void;
  setCurrentStep: (stepId: string | null) => void;
  completeTour: () => void;
  dismissTour: () => void;
  setTourStep: (step: number) => void;
  toggleWelcomeBanner: () => void;
  toggleProgressTracker: () => void;
  resetConfiguration: () => void;
}

const defaultConfigurationSteps: ConfigurationStep[] = [
  {
    id: 'profile_completion',
    title: 'Complete Your Profile',
    description: 'Add your photo, bio, and contact information',
    completed: false,
    optional: false,
  },
  {
    id: 'team_setup',
    title: 'Invite Team Members',
    description: 'Add your sales team and set up roles',
    completed: false,
    optional: false,
  },
  {
    id: 'data_import',
    title: 'Import Your Data',
    description: 'Upload existing advocates and opportunities',
    completed: false,
    optional: true,
  },
  {
    id: 'crm_integration',
    title: 'Connect Your CRM',
    description: 'Link Salesforce or HubSpot for seamless workflow',
    completed: false,
    optional: true,
  },
  {
    id: 'calendar_integration',
    title: 'Connect Calendar',
    description: 'Link Google Calendar or Outlook for scheduling',
    completed: false,
    optional: true,
  },
  {
    id: 'notification_setup',
    title: 'Configure Notifications',
    description: 'Set up email and in-app notification preferences',
    completed: false,
    optional: false,
  },
  {
    id: 'success_metrics',
    title: 'Set Success Goals',
    description: 'Define your reference program success metrics',
    completed: false,
    optional: true,
  },
  {
    id: 'first_advocate',
    title: 'Add Your First Advocate',
    description: 'Onboard a customer advocate to start building your network',
    completed: false,
    optional: false,
  },
  {
    id: 'first_opportunity',
    title: 'Create Your First Opportunity',
    description: 'Set up your first sales opportunity to track',
    completed: false,
    optional: false,
  },
  {
    id: 'first_reference_call',
    title: 'Schedule Your First Reference Call',
    description: 'Connect a prospect with an advocate for a reference call',
    completed: false,
    optional: false,
  },
];

export const usePostSignupStore = create<PostSignupState>()(
  persist(
    (set, get) => ({
      // Initial state
      configurationSteps: defaultConfigurationSteps,
      completedSteps: new Set(),
      currentStep: null,
      tourCompleted: false,
      tourDismissed: false,
      currentTourStep: 0,
      showWelcomeBanner: true,
      showProgressTracker: true,

      // Actions
      markStepCompleted: (stepId: string) => {
        const { configurationSteps, completedSteps } = get();
        const newCompletedSteps = new Set(completedSteps);
        newCompletedSteps.add(stepId);
        
        const updatedSteps = configurationSteps.map(step =>
          step.id === stepId
            ? { ...step, completed: true, completedAt: new Date().toISOString() }
            : step
        );

        set({
          configurationSteps: updatedSteps,
          completedSteps: newCompletedSteps,
        });
      },

      setCurrentStep: (stepId: string | null) => {
        set({ currentStep: stepId });
      },

      completeTour: () => {
        set({ tourCompleted: true, currentTourStep: 0 });
      },

      dismissTour: () => {
        set({ tourDismissed: true, currentTourStep: 0 });
      },

      setTourStep: (step: number) => {
        set({ currentTourStep: step });
      },

      toggleWelcomeBanner: () => {
        set(state => ({ showWelcomeBanner: !state.showWelcomeBanner }));
      },

      toggleProgressTracker: () => {
        set(state => ({ showProgressTracker: !state.showProgressTracker }));
      },

      resetConfiguration: () => {
        set({
          configurationSteps: defaultConfigurationSteps,
          completedSteps: new Set(),
          currentStep: null,
          tourCompleted: false,
          tourDismissed: false,
          currentTourStep: 0,
          showWelcomeBanner: true,
          showProgressTracker: true,
        });
      },
    }),
    {
      name: 'post-signup-configuration',
      partialize: (state) => ({
        configurationSteps: state.configurationSteps,
        completedSteps: Array.from(state.completedSteps),
        tourCompleted: state.tourCompleted,
        tourDismissed: state.tourDismissed,
        showWelcomeBanner: state.showWelcomeBanner,
        showProgressTracker: state.showProgressTracker,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert array back to Set
          state.completedSteps = new Set(state.completedSteps as any);
        }
      },
    }
  )
);

// Tour steps configuration
export const dashboardTourSteps: TourStep[] = [
  {
    target: '.welcome-banner',
    content: 'Welcome to PeerChamps! This banner shows your setup progress and next steps.',
    placement: 'bottom',
    title: 'Welcome to Your Dashboard',
  },
  {
    target: '.progress-tracker',
    content: 'Track your configuration progress here. Complete these steps to get the most out of PeerChamps.',
    placement: 'bottom',
    title: 'Configuration Progress',
  },
  {
    target: '.quick-actions',
    content: 'Use these quick actions to jump into key features and complete setup tasks.',
    placement: 'top',
    title: 'Quick Actions',
  },
  {
    target: '.navigation-menu',
    content: 'Navigate between different sections of PeerChamps using this menu.',
    placement: 'right',
    title: 'Navigation',
  },
  {
    target: '.help-section',
    content: 'Need help? Access tutorials, documentation, and support from here.',
    placement: 'top',
    title: 'Help & Support',
  },
];

// Helper functions
export const getConfigurationProgress = (state: PostSignupState) => {
  const totalSteps = state.configurationSteps.length;
  const completedCount = state.completedSteps.size;
  return {
    completed: completedCount,
    total: totalSteps,
    percentage: Math.round((completedCount / totalSteps) * 100),
  };
};

export const getNextIncompleteStep = (state: PostSignupState) => {
  return state.configurationSteps.find(step => !step.completed);
};

export const getCompletedSteps = (state: PostSignupState) => {
  return state.configurationSteps.filter(step => step.completed);
};

export const getIncompleteSteps = (state: PostSignupState) => {
  return state.configurationSteps.filter(step => !step.completed);
};
