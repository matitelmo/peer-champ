/**
 * API Route: Onboarding Progress
 * Handles onboarding progress tracking and step updates
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { z } from 'zod';

// Validation schema for progress updates
const ProgressUpdateSchema = z.object({
  company_id: z.string().uuid('Invalid company ID'),
  step_name: z.string().min(1, 'Step name is required'),
  completed: z.boolean().default(true),
  step_data: z.record(z.string(), z.any()).optional(),
});

const OnboardingSteps = [
  'welcome',
  'company_setup',
  'admin_account',
  'team_invitations',
  'initial_config',
  'advocate_setup',
  'crm_integration',
  'success_metrics',
  'welcome_tour',
  'completion',
] as const;

type OnboardingStep = typeof OnboardingSteps[number];

export async function POST(request: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    const body = await request.json();
    const validatedData = ProgressUpdateSchema.parse(body);
    
    // Get current onboarding record
    const { data: currentOnboarding, error: fetchError } = await supabase
      .from('onboarding_progress')
      .select('*')
      .eq('company_id', validatedData.company_id)
      .single();
    
    if (fetchError) {
      console.error('Error fetching onboarding record:', fetchError);
      return NextResponse.json(
        { error: 'Onboarding record not found' },
        { status: 404 }
      );
    }
    
    // Update steps completed
    const updatedStepsCompleted = {
      ...currentOnboarding.steps_completed,
      [validatedData.step_name]: validatedData.completed,
    };
    
    // Calculate progress percentage
    const completedSteps = Object.values(updatedStepsCompleted).filter(Boolean).length;
    const progressPercentage = Math.round((completedSteps / OnboardingSteps.length) * 100);
    
    // Determine next step
    let nextStep = currentOnboarding.current_step;
    if (validatedData.completed) {
      const currentStepIndex = OnboardingSteps.indexOf(validatedData.step_name as OnboardingStep);
      if (currentStepIndex < OnboardingSteps.length - 1) {
        nextStep = OnboardingSteps[currentStepIndex + 1];
      } else {
        nextStep = 'completion';
      }
    }
    
    // Update onboarding data
    const updatedOnboardingData = {
      ...currentOnboarding.onboarding_data,
      [validatedData.step_name]: validatedData.step_data || {},
    };
    
    // Update the onboarding record
    const { data: updatedOnboarding, error: updateError } = await supabase
      .from('onboarding_progress')
      .update({
        steps_completed: updatedStepsCompleted,
        current_step: nextStep,
        progress_percentage: progressPercentage,
        onboarding_data: updatedOnboardingData,
        last_activity_at: new Date().toISOString(),
        completed_at: progressPercentage === 100 ? new Date().toISOString() : null,
      })
      .eq('company_id', validatedData.company_id)
      .select()
      .single();
    
    if (updateError) {
      console.error('Error updating onboarding progress:', updateError);
      return NextResponse.json(
        { error: 'Failed to update progress' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: updatedOnboarding,
    });
    
  } catch (error) {
    console.error('Progress update error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('company_id');
    
    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }
    
    // Get onboarding progress
    const { data: onboarding, error: onboardingError } = await supabase
      .from('onboarding_progress')
      .select('*')
      .eq('company_id', companyId)
      .single();
    
    if (onboardingError) {
      console.error('Error fetching onboarding progress:', onboardingError);
      return NextResponse.json(
        { error: 'Onboarding record not found' },
        { status: 404 }
      );
    }
    
    // Get team invitations count
    const { data: invitations, error: invitationsError } = await supabase
      .from('team_invitations')
      .select('id, status')
      .eq('company_id', companyId);
    
    if (invitationsError) {
      console.error('Error fetching invitations:', invitationsError);
    }
    
    // Get company configuration status
    const { data: config, error: configError } = await supabase
      .from('companies')
      .select('*')
      .eq('company_id', companyId)
      .single();
    
    if (configError) {
      console.error('Error fetching configuration:', configError);
    }
    
    return NextResponse.json({
      success: true,
      data: {
        onboarding,
        invitations: {
          total: invitations?.length || 0,
          sent: invitations?.filter(inv => inv.status === 'sent').length || 0,
          accepted: invitations?.filter(inv => inv.status === 'accepted').length || 0,
        },
        configuration: config,
      },
    });
    
  } catch (error) {
    console.error('Error fetching onboarding progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    const body = await request.json();
    const { company_id, current_step } = body;
    
    if (!company_id || !current_step) {
      return NextResponse.json(
        { error: 'Company ID and current step are required' },
        { status: 400 }
      );
    }
    
    // Update current step
    const { data: updatedOnboarding, error: updateError } = await supabase
      .from('onboarding_progress')
      .update({
        current_step,
        last_activity_at: new Date().toISOString(),
      })
      .eq('company_id', company_id)
      .select()
      .single();
    
    if (updateError) {
      console.error('Error updating current step:', updateError);
      return NextResponse.json(
        { error: 'Failed to update current step' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: updatedOnboarding,
    });
    
  } catch (error) {
    console.error('Error updating current step:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
