/**
 * API Route: Customer Advocates
 * Handles customer advocate creation during onboarding
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { z } from 'zod';

// Validation schema for advocates
const AdvocateSchema = z.object({
  company_id: z.string().uuid('Invalid company ID'),
  name: z.string().min(1, 'Name is required'),
  title: z.string().optional(),
  company: z.string().min(1, 'Company is required'),
  email: z.string().email('Invalid email format'),
  industry: z.string().optional(),
  use_cases: z.array(z.string()).default([]),
});

const BulkAdvocateSchema = z.object({
  company_id: z.string().uuid('Invalid company ID'),
  advocates: z.array(z.object({
    name: z.string().min(1, 'Name is required'),
    title: z.string().optional(),
    company: z.string().min(1, 'Company is required'),
    email: z.string().email('Invalid email format'),
    industry: z.string().optional(),
    use_cases: z.array(z.string()).default([]),
  })).min(1, 'At least one advocate is required'),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    const body = await request.json();
    
    // Check if it's a bulk advocate creation
    if (body.advocates && Array.isArray(body.advocates)) {
      return handleBulkAdvocates(supabase, body);
    } else {
      return handleSingleAdvocate(supabase, body);
    }
    
  } catch (error) {
    console.error('Advocate error:', error);
    
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

async function handleSingleAdvocate(supabase: any, body: any) {
  const validatedData = AdvocateSchema.parse(body);
  
  const { data, error } = await supabase
    .from('advocates')
    .insert({
      company_id: validatedData.company_id,
      name: validatedData.name,
      title: validatedData.title,
      company: validatedData.company,
      email: validatedData.email,
      industry: validatedData.industry,
      use_cases: validatedData.use_cases,
      status: 'active',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating advocate:', error);
    return NextResponse.json(
      { error: 'Failed to create advocate' },
      { status: 500 }
    );
  }

  return NextResponse.json({ advocate: data }, { status: 201 });
}

async function handleBulkAdvocates(supabase: any, body: any) {
  const validatedData = BulkAdvocateSchema.parse(body);
  
  const advocatesToInsert = validatedData.advocates.map(advocate => ({
    company_id: validatedData.company_id,
    name: advocate.name,
    title: advocate.title,
    company: advocate.company,
    email: advocate.email,
    industry: advocate.industry,
    use_cases: advocate.use_cases,
    status: 'active',
  }));

  const { data, error } = await supabase
    .from('advocates')
    .insert(advocatesToInsert)
    .select();

  if (error) {
    console.error('Error creating advocates:', error);
    return NextResponse.json(
      { error: 'Failed to create advocates' },
      { status: 500 }
    );
  }

  // Update onboarding progress
  await supabase
    .from('onboarding_progress')
    .upsert({ 
      company_id: validatedData.company_id, 
      current_step: 'advocates_added' 
    }, { onConflict: 'company_id' });

  return NextResponse.json({ advocates: data }, { status: 201 });
}

export async function GET(request: NextRequest) {
  const supabase = getServiceSupabase();
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get('company_id');

  if (!companyId) {
    return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('advocates')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching advocates:', error);
      return NextResponse.json({ error: 'Failed to fetch advocates' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Unexpected error fetching advocates:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
