/**
 * API Route: Team Invitations
 * Handles team member invitations during onboarding
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { z } from 'zod';

// Validation schema for team invitations
const InvitationSchema = z.object({
  company_id: z.string().uuid('Invalid company ID'),
  email: z.string().email('Invalid email format'),
  role: z.enum(['sales_rep', 'advocate', 'admin']),
  personal_message: z.string().optional(),
});

const BulkInvitationSchema = z.object({
  company_id: z.string().uuid('Invalid company ID'),
  invitations: z.array(z.object({
    email: z.string().email('Invalid email format'),
    role: z.enum(['sales_rep', 'advocate', 'admin']),
    personal_message: z.string().optional(),
  })).min(1, 'At least one invitation is required'),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    const body = await request.json();
    
    // Check if it's a bulk invitation
    if (body.invitations && Array.isArray(body.invitations)) {
      return handleBulkInvitations(supabase, body);
    } else {
      return handleSingleInvitation(supabase, body);
    }
    
  } catch (error) {
    console.error('Invitation error:', error);
    
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

async function handleSingleInvitation(supabase: any, body: any) {
  const validatedData = InvitationSchema.parse(body);
  
  // Check if user already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', validatedData.email)
    .single();
  
  if (existingUser) {
    return NextResponse.json(
      { error: 'User with this email already exists' },
      { status: 409 }
    );
  }
  
  // Check if invitation already exists
  const { data: existingInvitation } = await supabase
    .from('team_invitations')
    .select('id, status')
    .eq('company_id', validatedData.company_id)
    .eq('email', validatedData.email)
    .single();
  
  if (existingInvitation && existingInvitation.status !== 'cancelled') {
    return NextResponse.json(
      { error: 'Invitation already exists for this email' },
      { status: 409 }
    );
  }
  
  // Create invitation
  const { data: invitation, error: invitationError } = await supabase
    .from('team_invitations')
    .insert({
      company_id: validatedData.company_id,
      email: validatedData.email,
      role: validatedData.role,
      personal_message: validatedData.personal_message,
      status: 'pending',
    })
    .select()
    .single();
  
  if (invitationError) {
    console.error('Error creating invitation:', invitationError);
    return NextResponse.json(
      { error: 'Failed to create invitation' },
      { status: 500 }
    );
  }
  
  // TODO: Send invitation email
  // This would integrate with SendGrid or similar service
  console.log('Would send invitation email to:', validatedData.email);
  
  // Update invitation status to 'sent'
  const { data: updatedInvitation, error: updateError } = await supabase
    .from('team_invitations')
    .update({ status: 'sent' })
    .eq('id', invitation.id)
    .select()
    .single();
  
  if (updateError) {
    console.error('Error updating invitation status:', updateError);
  }
  
  return NextResponse.json({
    success: true,
    data: updatedInvitation || invitation,
  });
}

async function handleBulkInvitations(supabase: any, body: any) {
  const validatedData = BulkInvitationSchema.parse(body);
  
  const results = [];
  const errors = [];
  
  for (const invitationData of validatedData.invitations) {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', invitationData.email)
        .single();
      
      if (existingUser) {
        errors.push({
          email: invitationData.email,
          error: 'User already exists',
        });
        continue;
      }
      
      // Check if invitation already exists
      const { data: existingInvitation } = await supabase
        .from('team_invitations')
        .select('id, status')
        .eq('company_id', validatedData.company_id)
        .eq('email', invitationData.email)
        .single();
      
      if (existingInvitation && existingInvitation.status !== 'cancelled') {
        errors.push({
          email: invitationData.email,
          error: 'Invitation already exists',
        });
        continue;
      }
      
      // Create invitation
      const { data: invitation, error: invitationError } = await supabase
        .from('team_invitations')
        .insert({
          company_id: validatedData.company_id,
          email: invitationData.email,
          role: invitationData.role,
          personal_message: invitationData.personal_message,
          status: 'pending',
        })
        .select()
        .single();
      
      if (invitationError) {
        errors.push({
          email: invitationData.email,
          error: 'Failed to create invitation',
        });
        continue;
      }
      
      // TODO: Send invitation email
      console.log('Would send invitation email to:', invitationData.email);
      
      // Update invitation status to 'sent'
      const { data: updatedInvitation, error: updateError } = await supabase
        .from('team_invitations')
        .update({ status: 'sent' })
        .eq('id', invitation.id)
        .select()
        .single();
      
      results.push(updatedInvitation || invitation);
      
    } catch (error) {
      errors.push({
        email: invitationData.email,
        error: 'Processing error',
      });
    }
  }
  
  return NextResponse.json({
    success: true,
    data: {
      successful_invitations: results,
      failed_invitations: errors,
      total_sent: results.length,
      total_failed: errors.length,
    },
  });
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
    
    // Get all invitations for the company
    const { data: invitations, error: invitationsError } = await supabase
      .from('team_invitations')
      .select('*')
      .eq('company_id', companyId)
      .order('invited_at', { ascending: false });
    
    if (invitationsError) {
      console.error('Error fetching invitations:', invitationsError);
      return NextResponse.json(
        { error: 'Failed to fetch invitations' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: invitations,
    });
    
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    const { searchParams } = new URL(request.url);
    const invitationId = searchParams.get('invitation_id');
    
    if (!invitationId) {
      return NextResponse.json(
        { error: 'Invitation ID is required' },
        { status: 400 }
      );
    }
    
    // Cancel the invitation
    const { data: invitation, error: invitationError } = await supabase
      .from('team_invitations')
      .update({ status: 'cancelled' })
      .eq('id', invitationId)
      .select()
      .single();
    
    if (invitationError) {
      console.error('Error cancelling invitation:', invitationError);
      return NextResponse.json(
        { error: 'Failed to cancel invitation' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: invitation,
    });
    
  } catch (error) {
    console.error('Error cancelling invitation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
