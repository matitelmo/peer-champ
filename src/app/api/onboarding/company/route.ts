/**
 * API Route: Company Onboarding
 * Handles company creation and onboarding initialization
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { z } from 'zod';

// Validation schema for company creation
const CompanyCreationSchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  domain: z.string().email('Invalid domain format').or(z.string().min(1, 'Domain is required')),
  subscription_tier: z.enum(['starter', 'professional', 'enterprise']).default('professional'),
  industry: z.string().optional(),
  company_size: z.string().optional(),
  timezone: z.string().default('UTC'),
  currency: z.string().default('USD'),
  admin_user: z.object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    
    // Parse and validate request body
    const body = await request.json();
    const validatedData = CompanyCreationSchema.parse(body);
    
    // Check if company domain already exists
    const { data: existingCompany } = await supabase
      .from('companies')
      .select('id')
      .eq('domain', validatedData.domain)
      .single();
    
    if (existingCompany) {
      return NextResponse.json(
        { error: 'Company with this domain already exists' },
        { status: 409 }
      );
    }
    
    // Check if admin email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', validatedData.admin_user.email)
      .single();
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Start a transaction-like operation
    // 1. Create the company
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: validatedData.name,
        domain: validatedData.domain,
        subscription_tier: validatedData.subscription_tier,
        settings: {
          industry: validatedData.industry,
          company_size: validatedData.company_size,
          timezone: validatedData.timezone,
          currency: validatedData.currency,
        },
      })
      .select()
      .single();
    
    if (companyError) {
      console.error('Error creating company:', companyError);
      return NextResponse.json(
        { error: 'Failed to create company' },
        { status: 500 }
      );
    }
    
    // 2. Create the admin user in Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: validatedData.admin_user.email,
      password: validatedData.admin_user.password,
      user_metadata: {
        data: {
          first_name: validatedData.admin_user.first_name,
          last_name: validatedData.admin_user.last_name,
          
        },
      },
    });
    
    if (authError) {
      // Rollback company creation
      await supabase.from('companies').delete().eq('id', company.id);
      console.error('Error creating auth user:', authError);
      return NextResponse.json(
        { error: 'Failed to create admin user' },
        { status: 500 }
      );
    }
    
    // 3. Create the user record in our users table
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        id: authUser.user?.id,
        company_id: company.id,        email: validatedData.admin_user.email,
        role: 'admin',
        first_name: validatedData.admin_user.first_name,
        last_name: validatedData.admin_user.last_name,
        profile: {
          onboarding_completed: false,
        },
      })
      .select()
      .single();
    
    if (userError) {
      // Rollback auth user and company
      await supabase.auth.admin.deleteUser(authUser.user?.id || '');
      await supabase.from('companies').delete().eq('id', company.id);
      console.error('Error creating user record:', userError);
      return NextResponse.json(
        { error: 'Failed to create user record' },
        { status: 500 }
      );
    }
    
    // 4. Initialize company onboarding
    const { data: onboarding, error: onboardingError } = await supabase
      .from('onboarding_progress')
      .insert({
        company_id: company.id,
        
        current_step: 'company_setup',
        progress_data: {
          welcome: true,
          company_setup: true,
          company_info: {
            name: validatedData.name,
            domain: validatedData.domain,
            industry: validatedData.industry,
            company_size: validatedData.company_size,
          },
        },
      })
      .select()
      .single();
    
    if (onboardingError) {
      console.error('Error creating onboarding record:', onboardingError);
      // Don't rollback here as the main company/user creation succeeded
    }
    
    // 5. Initialize company configuration
    const { data: config, error: configError } = await supabase
      .from('companies')
      .insert({
        
        settings: {
          industry: validatedData.industry,
          company_size: validatedData.company_size,
          timezone: validatedData.timezone,
          currency: validatedData.currency,
        },
      })
      .select()
      .single();
    
    if (configError) {
      console.error('Error creating company configuration:', configError);
      // Don't rollback here as the main company/user creation succeeded
    }
    
    return NextResponse.json({
      success: true,
      data: {
        company,
        user,
        onboarding,
        config,
        auth_user: {
          id: authUser.user?.id,
        company_id: company.id,          email: authUser.user?.email,
          email_confirmed: authUser.user?.email_confirmed_at ? true : false,
        },
      },
    });
    
  } catch (error) {
    console.error('Company creation error:', error);
    
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
    
    // Get company details with onboarding progress
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select(`
        *,
        onboarding_progress(*),
        companies(*)
      `)
      .eq('id', company.id)
      .single();
    
    if (companyError) {
      console.error('Error fetching company:', companyError);
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: company,
    });
    
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
