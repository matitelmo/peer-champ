/**
 * TypeScript Type Definition Tests
 *
 * These tests verify that our TypeScript types are properly defined
 * and can be used correctly throughout the application.
 */

import type {
  Company,
  User,
  Advocate,
  Opportunity,
  ReferenceCall,
  InsertCompany,
  UpdateCompany,
  UserRole,
  AdvocateStatus,
  DealStage,
  CallStatus,
  DatabaseResponse,
  AdvocateFilters,
} from '../src/types';

describe('Database Types', () => {
  it('should allow creating valid Company objects', () => {
    const company: Company = {
      id: 'uuid-string',
      name: 'Test Company',
      domain: 'test.com',
      subscription_tier: 'professional',
      settings: { theme: 'dark' },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    expect(company.name).toBe('Test Company');
    expect(company.subscription_tier).toBe('professional');
  });

  it('should allow creating valid User objects', () => {
    const user: User = {
      id: 'user-uuid',
      company_id: 'company-uuid',
      email: 'test@example.com',
      role: 'sales_rep',
      first_name: 'John',
      last_name: 'Doe',
      profile: { phone: '123-456-7890' },
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    expect(user.role).toBe('sales_rep');
    expect(user.is_active).toBe(true);
  });

  it('should allow creating valid Advocate objects', () => {
    const advocate: Advocate = {
      id: 'advocate-uuid',
      user_id: null,
      company_id: 'company-uuid',
      name: 'Jane Smith',
      email: 'jane@company.com',
      title: 'CTO',
      company_name: 'Tech Corp',
      phone: '+1-555-0123',
      industry: 'Software',
      company_size: '201-500',
      geographic_region: 'North America',
      use_cases: ['API Integration', 'Data Analytics'],
      expertise_areas: ['Technical Architecture', 'Cloud Computing'],
      success_stories: ['Reduced processing time by 50%'],
      availability_score: 85,
      total_calls_completed: 12,
      last_call_date: '2024-01-15T10:00:00Z',
      max_calls_per_month: 4,
      preferred_call_times: ['9-11 AM PST', '2-4 PM PST'],
      timezone: 'America/Los_Angeles',
      languages: ['English', 'Spanish'],
      call_duration_preference: 30,
      status: 'active',
      enrollment_date: '2023-06-01T00:00:00Z',
      last_activity_date: '2024-01-15T10:00:00Z',
      total_rewards_earned: 250.0,
      preferred_reward_type: 'gift_card',
      internal_notes: 'Excellent technical communicator',
      tags: ['technical', 'senior_executive'],
      average_rating: 4.8,
      total_ratings: 10,
      created_at: '2023-06-01T00:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
    };

    expect(advocate.status).toBe('active');
    expect(advocate.use_cases).toContain('API Integration');
    expect(advocate.availability_score).toBe(85);
  });

  it('should allow creating valid Opportunity objects', () => {
    const opportunity: Opportunity = {
      id: 'opportunity-uuid',
      company_id: 'company-uuid',
      sales_rep_id: 'sales-rep-uuid',
      prospect_company: 'Acme Corp',
      prospect_contact_name: 'Bob Wilson',
      prospect_contact_email: 'bob@acme.com',
      prospect_contact_title: 'VP Engineering',
      prospect_phone: '+1-555-0456',
      prospect_website: 'https://acme.com',
      prospect_industry: 'Manufacturing',
      prospect_size: '201-500',
      geographic_region: 'North America',
      opportunity_name: 'Acme Digital Transformation',
      use_case: 'Process Automation',
      product_interest: ['API Platform', 'Analytics'],
      technical_requirements: ['REST APIs', 'Real-time data'],
      business_challenges: ['Manual processes', 'Data silos'],
      deal_value: 150000,
      currency: 'USD',
      deal_stage: 'proposal',
      probability: 75,
      expected_close_date: '2024-03-15',
      reference_request_status: 'requested',
      reference_urgency: 'high',
      reference_type_needed: 'technical',
      desired_advocate_industry: 'Manufacturing',
      desired_advocate_size: '201-500',
      desired_advocate_region: 'North America',
      desired_use_cases: ['Process Automation'],
      desired_expertise_areas: ['Technical Implementation'],
      external_crm_id: 'SF-123456',
      external_crm_type: 'salesforce',
      external_crm_url: 'https://salesforce.com/opportunity/123456',
      reference_needed_by: '2024-02-28',
      follow_up_date: '2024-02-01',
      created_date: '2024-01-01',
      internal_notes: 'High-value prospect',
      sales_notes: 'Decision maker engaged',
      competitive_situation: 'Competing with Company X',
      decision_criteria: ['Technical fit', 'ROI', 'Support'],
      key_stakeholders: ['Bob Wilson', 'Sarah Johnson'],
      tags: ['enterprise', 'manufacturing'],
      priority_score: 85,
      last_activity_date: '2024-01-15T14:00:00Z',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-15T14:00:00Z',
    };

    expect(opportunity.deal_stage).toBe('proposal');
    expect(opportunity.reference_request_status).toBe('requested');
    expect(opportunity.priority_score).toBe(85);
  });

  it('should allow creating valid ReferenceCall objects', () => {
    const referenceCall: ReferenceCall = {
      id: 'call-uuid',
      opportunity_id: 'opportunity-uuid',
      advocate_id: 'advocate-uuid',
      sales_rep_id: 'sales-rep-uuid',
      prospect_name: 'Bob Wilson',
      prospect_email: 'bob@acme.com',
      prospect_title: 'VP Engineering',
      prospect_company: 'Acme Corp',
      prospect_phone: '+1-555-0456',
      scheduled_at: '2024-02-15T15:00:00Z',
      actual_start_time: null,
      actual_end_time: null,
      duration_minutes: null,
      timezone: 'America/Los_Angeles',
      meeting_link: 'https://zoom.us/j/123456789',
      meeting_platform: 'zoom',
      meeting_id: '123456789',
      meeting_password: 'secret123',
      calendar_event_id: 'calendar-event-123',
      status: 'scheduled',
      cancellation_reason: null,
      reschedule_count: 0,
      briefing_materials: ['Product overview', 'Technical specs'],
      talking_points: ['Implementation approach', 'ROI results'],
      questions_to_cover: ['Technical challenges', 'Timeline'],
      advocate_briefed: true,
      prospect_briefed: false,
      call_recording_url: null,
      call_transcript: null,
      call_intelligence: null,
      ai_summary: null,
      key_topics_discussed: null,
      sentiment_score: null,
      advocate_feedback: null,
      prospect_feedback: null,
      sales_rep_feedback: null,
      advocate_rating: null,
      call_quality_rating: null,
      technical_quality_score: null,
      business_value_score: null,
      follow_up_required: false,
      follow_up_actions: null,
      follow_up_completed: false,
      next_steps: null,
      reward_amount: 50.0,
      reward_type: 'gift_card',
      reward_status: 'pending',
      reward_notes: null,
      call_outcome: null,
      deal_impact: null,
      next_call_recommended: null,
      reference_strength: null,
      internal_notes: null,
      tags: ['technical_call', 'scheduled'],
      call_preparation_time_minutes: null,
      total_effort_score: null,
      external_meeting_id: null,
      external_recording_id: null,
      crm_activity_id: null,
      created_at: '2024-01-20T00:00:00Z',
      updated_at: '2024-01-20T00:00:00Z',
    };

    expect(referenceCall.status).toBe('scheduled');
    expect(referenceCall.meeting_platform).toBe('zoom');
    expect(referenceCall.reward_type).toBe('gift_card');
  });

  it('should support Insert and Update utility types', () => {
    const insertCompany: InsertCompany = {
      name: 'New Company',
      domain: 'newco.com',
      subscription_tier: 'starter',
      settings: {},
    };

    const updateCompany: UpdateCompany = {
      name: 'Updated Company Name',
    };

    expect(insertCompany.name).toBe('New Company');
    expect(updateCompany.name).toBe('Updated Company Name');
  });

  it('should support enum types for constraints', () => {
    const validRoles: UserRole[] = ['sales_rep', 'advocate', 'admin'];
    const validStatuses: AdvocateStatus[] = [
      'active',
      'inactive',
      'pending',
      'blacklisted',
    ];
    const validDealStages: DealStage[] = [
      'discovery',
      'qualification',
      'proposal',
      'negotiation',
      'closed_won',
      'closed_lost',
    ];
    const validCallStatuses: CallStatus[] = [
      'scheduled',
      'confirmed',
      'in_progress',
      'completed',
      'cancelled',
      'no_show',
      'rescheduled',
    ];

    expect(validRoles).toContain('sales_rep');
    expect(validStatuses).toContain('active');
    expect(validDealStages).toContain('proposal');
    expect(validCallStatuses).toContain('scheduled');
  });

  it('should support filter types for queries', () => {
    const advocateFilters: AdvocateFilters = {
      company_id: 'company-uuid',
      status: ['active', 'pending'],
      industry: 'Software',
      availability_score_min: 70,
      use_cases: ['API Integration'],
      tags: ['technical'],
    };

    expect(advocateFilters.industry).toBe('Software');
    expect(advocateFilters.status).toContain('active');
    expect(advocateFilters.availability_score_min).toBe(70);
  });

  it('should support database response types', () => {
    const successResponse: DatabaseResponse<Company> = {
      data: {
        id: 'company-uuid',
        name: 'Test Company',
        domain: 'test.com',
        subscription_tier: 'professional',
        settings: {},
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      error: null,
    };

    const errorResponse: DatabaseResponse<Company> = {
      data: null,
      error: new Error('Database connection failed'),
    };

    expect(successResponse.data?.name).toBe('Test Company');
    expect(errorResponse.error?.message).toBe('Database connection failed');
  });
});
