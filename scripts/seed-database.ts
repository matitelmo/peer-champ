#!/usr/bin/env node

/**
 * Database Seeding Script
 *
 * This script populates the database with comprehensive sample data
 * for development and testing purposes. It creates realistic data
 * that demonstrates all features of the PeerChamps platform.
 *
 * Usage:
 *   npm run seed
 *   npx ts-node scripts/seed-database.ts
 */

import { getServiceSupabase } from '../src/lib/supabase';
import type {
  InsertCompany,
  InsertUser,
  InsertAdvocate,
  InsertOpportunity,
  InsertReferenceCall,
} from '../src/types';

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabase = getServiceSupabase();

// Sample data generators
const companies: InsertCompany[] = [
  {
    name: 'TechFlow Solutions',
    domain: 'techflow.com',
    subscription_tier: 'enterprise',
    settings: {
      theme: 'corporate',
      features: [
        'advanced_analytics',
        'custom_integrations',
        'priority_support',
      ],
      timezone: 'America/New_York',
    },
  },
  {
    name: 'StartupBoost Inc',
    domain: 'startupboost.io',
    subscription_tier: 'professional',
    settings: {
      theme: 'modern',
      features: ['basic_analytics', 'standard_integrations'],
      timezone: 'America/Los_Angeles',
    },
  },
  {
    name: 'Enterprise Corp',
    domain: 'enterprisecorp.com',
    subscription_tier: 'enterprise',
    settings: {
      theme: 'enterprise',
      features: ['advanced_analytics', 'custom_integrations', 'white_label'],
      timezone: 'America/Chicago',
    },
  },
];

const generateUsers = (companyId: string): InsertUser[] => [
  {
    company_id: companyId,
    email: `admin@${companies.find((c) => c.name === 'TechFlow Solutions')?.domain}`,
    role: 'admin',
    first_name: 'Alice',
    last_name: 'Johnson',
    profile: {
      phone: '+1-555-0101',
      title: 'VP of Customer Success',
      department: 'Customer Success',
    },
    is_active: true,
  },
  {
    company_id: companyId,
    email: `sales1@${companies.find((c) => c.name === 'TechFlow Solutions')?.domain}`,
    role: 'sales_rep',
    first_name: 'Bob',
    last_name: 'Smith',
    profile: {
      phone: '+1-555-0102',
      title: 'Senior Sales Representative',
      department: 'Sales',
      territory: 'West Coast',
    },
    is_active: true,
  },
  {
    company_id: companyId,
    email: `sales2@${companies.find((c) => c.name === 'TechFlow Solutions')?.domain}`,
    role: 'sales_rep',
    first_name: 'Carol',
    last_name: 'Davis',
    profile: {
      phone: '+1-555-0103',
      title: 'Account Executive',
      department: 'Sales',
      territory: 'East Coast',
    },
    is_active: true,
  },
];

const generateAdvocates = (companyId: string): InsertAdvocate[] => [
  {
    user_id: null, // External advocate, not a platform user
    company_id: companyId,
    name: 'John Chen',
    email: 'john.chen@innovatetech.com',
    title: 'Chief Technology Officer',
    company_name: 'InnovateTech Solutions',
    phone: '+1-555-1001',
    industry: 'Software',
    company_size: '201-500',
    geographic_region: 'North America',
    use_cases: [
      'API Integration',
      'Data Analytics',
      'Cloud Migration',
      'Microservices Architecture',
    ],
    expertise_areas: [
      'Technical Architecture',
      'Enterprise Integration',
      'Cloud Computing',
      'DevOps',
    ],
    success_stories: [
      'Reduced API response time by 75%',
      'Migrated legacy system to cloud in 6 months',
      'Implemented real-time analytics for 1M+ users',
    ],
    availability_score: 95,
    total_calls_completed: 23,
    last_call_date: '2024-01-10T14:00:00Z',
    max_calls_per_month: 6,
    preferred_call_times: ['10-12 AM PST', '2-4 PM PST'],
    timezone: 'America/Los_Angeles',
    languages: ['English', 'Mandarin'],
    call_duration_preference: 45,
    status: 'active',
    enrollment_date: '2023-03-15T00:00:00Z',
    last_activity_date: '2024-01-10T14:00:00Z',
    total_rewards_earned: 1150.0,
    preferred_reward_type: 'donation',
    internal_notes:
      'Excellent technical communicator, strong on enterprise architecture topics',
    tags: ['technical', 'senior_executive', 'cloud_expert', 'high_performer'],
    average_rating: 4.9,
    total_ratings: 21,
  },
  {
    user_id: null,
    company_id: companyId,
    name: 'Sarah Martinez',
    email: 'sarah.martinez@globalmanufacturing.com',
    title: 'VP of Operations',
    company_name: 'Global Manufacturing Inc',
    phone: '+1-555-1002',
    industry: 'Manufacturing',
    company_size: '501-1000',
    geographic_region: 'North America',
    use_cases: [
      'Process Automation',
      'Supply Chain Optimization',
      'Quality Control',
      'IoT Integration',
    ],
    expertise_areas: [
      'Operations Management',
      'Process Optimization',
      'Quality Assurance',
      'Digital Transformation',
    ],
    success_stories: [
      'Automated 80% of manual quality checks',
      'Reduced supply chain costs by 30%',
      'Implemented IoT monitoring across 12 facilities',
    ],
    availability_score: 87,
    total_calls_completed: 18,
    last_call_date: '2024-01-05T16:30:00Z',
    max_calls_per_month: 4,
    preferred_call_times: ['9-11 AM CST', '1-3 PM CST'],
    timezone: 'America/Chicago',
    languages: ['English', 'Spanish'],
    call_duration_preference: 30,
    status: 'active',
    enrollment_date: '2023-05-20T00:00:00Z',
    last_activity_date: '2024-01-05T16:30:00Z',
    total_rewards_earned: 900.0,
    preferred_reward_type: 'gift_card',
    internal_notes: 'Great for manufacturing use cases, speaks well to ROI',
    tags: ['operations', 'manufacturing', 'roi_focused', 'reliable'],
    average_rating: 4.7,
    total_ratings: 16,
  },
  {
    user_id: null,
    company_id: companyId,
    name: 'Michael Thompson',
    email: 'mike.thompson@finservices.com',
    title: 'Director of IT',
    company_name: 'Premier Financial Services',
    phone: '+1-555-1003',
    industry: 'Financial Services',
    company_size: '1000+',
    geographic_region: 'North America',
    use_cases: [
      'Security Compliance',
      'API Management',
      'Data Governance',
      'Risk Management',
    ],
    expertise_areas: [
      'Cybersecurity',
      'Compliance',
      'Enterprise Architecture',
      'Risk Management',
    ],
    success_stories: [
      'Achieved SOC 2 Type II compliance in 8 months',
      'Implemented zero-trust security architecture',
      'Reduced security incidents by 90%',
    ],
    availability_score: 92,
    total_calls_completed: 15,
    last_call_date: '2024-01-08T11:00:00Z',
    max_calls_per_month: 3,
    preferred_call_times: ['10-12 PM EST', '2-4 PM EST'],
    timezone: 'America/New_York',
    languages: ['English'],
    call_duration_preference: 60,
    status: 'active',
    enrollment_date: '2023-07-10T00:00:00Z',
    last_activity_date: '2024-01-08T11:00:00Z',
    total_rewards_earned: 750.0,
    preferred_reward_type: 'company_swag',
    internal_notes: 'Security expert, great for compliance-focused prospects',
    tags: ['security', 'compliance', 'financial_services', 'detailed'],
    average_rating: 4.8,
    total_ratings: 13,
  },
];

const generateOpportunities = (
  companyId: string,
  salesRepIds: string[]
): InsertOpportunity[] => [
  {
    company_id: companyId,
    sales_rep_id: salesRepIds[0],
    prospect_company: 'Acme Manufacturing Corp',
    prospect_contact_name: 'Jennifer Williams',
    prospect_contact_email: 'jennifer.williams@acmemfg.com',
    prospect_contact_title: 'Chief Information Officer',
    prospect_phone: '+1-555-2001',
    prospect_website: 'https://acmemfg.com',
    prospect_industry: 'Manufacturing',
    prospect_size: '201-500',
    geographic_region: 'North America',
    opportunity_name: 'Acme Manufacturing - Digital Transformation Initiative',
    use_case: 'Process Automation & Quality Control',
    product_interest: [
      'API Platform',
      'Process Automation',
      'Quality Management',
      'IoT Integration',
    ],
    technical_requirements: [
      'REST API Integration',
      'Real-time Monitoring',
      'Mobile Access',
      'Cloud Deployment',
    ],
    business_challenges: [
      'Manual Quality Processes',
      'Data Silos',
      'Compliance Reporting',
      'Scalability',
    ],
    deal_value: 285000.0,
    currency: 'USD',
    deal_stage: 'proposal',
    probability: 75,
    expected_close_date: '2024-03-15',
    reference_request_status: 'requested',
    reference_urgency: 'high',
    reference_type_needed: 'peer_to_peer',
    desired_advocate_industry: 'Manufacturing',
    desired_advocate_size: '201-500',
    desired_advocate_region: 'North America',
    desired_use_cases: ['Process Automation', 'Quality Control'],
    desired_expertise_areas: ['Operations Management', 'Process Optimization'],
    external_crm_id: 'SF-001-ACM-2024',
    external_crm_type: 'salesforce',
    external_crm_url:
      'https://techflow.salesforce.com/lightning/r/Opportunity/001XX000004DGb2/view',
    reference_needed_by: '2024-02-28',
    follow_up_date: '2024-02-01',
    created_date: '2024-01-01',
    internal_notes:
      'High-value prospect, decision committee includes CTO and COO',
    sales_notes:
      'Strong technical fit, budget approved, evaluating against 2 competitors',
    competitive_situation: 'Competing with legacy vendor and startup solution',
    decision_criteria: [
      'Technical Capability',
      'Implementation Timeline',
      'ROI Demonstration',
      'Reference Customers',
    ],
    key_stakeholders: [
      'Jennifer Williams (CIO)',
      'Robert Chen (CTO)',
      'Maria Rodriguez (COO)',
    ],
    tags: ['enterprise', 'manufacturing', 'high_value', 'competitive'],
    priority_score: 90,
    last_activity_date: '2024-01-15T10:00:00Z',
  },
  {
    company_id: companyId,
    sales_rep_id: salesRepIds[1],
    prospect_company: 'TechStart Innovations',
    prospect_contact_name: 'David Park',
    prospect_contact_email: 'david.park@techstart.io',
    prospect_contact_title: 'VP of Engineering',
    prospect_phone: '+1-555-2002',
    prospect_website: 'https://techstart.io',
    prospect_industry: 'Software',
    prospect_size: '51-200',
    geographic_region: 'North America',
    opportunity_name: 'TechStart - API Gateway & Security Platform',
    use_case: 'API Management & Security',
    product_interest: [
      'API Gateway',
      'Security Platform',
      'Developer Portal',
      'Analytics',
    ],
    technical_requirements: [
      'OAuth/JWT Support',
      'Rate Limiting',
      'API Analytics',
      'Multi-tenant',
    ],
    business_challenges: [
      'API Security',
      'Developer Experience',
      'Scaling API Usage',
      'Monitoring',
    ],
    deal_value: 125000.0,
    currency: 'USD',
    deal_stage: 'negotiation',
    probability: 65,
    expected_close_date: '2024-02-29',
    reference_request_status: 'in_progress',
    reference_urgency: 'medium',
    reference_type_needed: 'technical',
    desired_advocate_industry: 'Software',
    desired_advocate_size: '51-200',
    desired_advocate_region: 'North America',
    desired_use_cases: ['API Integration', 'Security'],
    desired_expertise_areas: ['Technical Architecture', 'API Management'],
    external_crm_id: 'HUB-002-TSI-2024',
    external_crm_type: 'hubspot',
    external_crm_url: 'https://app.hubspot.com/contacts/12345/deal/67890',
    reference_needed_by: '2024-02-15',
    follow_up_date: '2024-01-25',
    created_date: '2023-12-15',
    internal_notes: 'Technical team is engaged, pricing discussion in progress',
    sales_notes:
      'Strong technical validation, negotiating on professional services',
    competitive_situation:
      'Build vs buy decision, also evaluating open source options',
    decision_criteria: [
      'Technical Features',
      'Total Cost of Ownership',
      'Support Quality',
      'Roadmap Alignment',
    ],
    key_stakeholders: [
      'David Park (VP Eng)',
      'Lisa Kim (CTO)',
      'Alex Johnson (Lead Dev)',
    ],
    tags: ['mid_market', 'software', 'technical', 'price_sensitive'],
    priority_score: 70,
    last_activity_date: '2024-01-20T14:30:00Z',
  },
];

const generateReferenceCalls = (
  opportunityIds: string[],
  advocateIds: string[],
  salesRepIds: string[]
): InsertReferenceCall[] => [
  {
    opportunity_id: opportunityIds[0],
    advocate_id: advocateIds[1], // Sarah Martinez (Manufacturing)
    sales_rep_id: salesRepIds[0],
    prospect_name: 'Jennifer Williams',
    prospect_email: 'jennifer.williams@acmemfg.com',
    prospect_title: 'Chief Information Officer',
    prospect_company: 'Acme Manufacturing Corp',
    prospect_phone: '+1-555-2001',
    scheduled_at: '2024-02-08T15:00:00Z',
    actual_start_time: null,
    actual_end_time: null,
    duration_minutes: null,
    timezone: 'America/Chicago',
    meeting_link: 'https://zoom.us/j/123456789',
    meeting_platform: 'zoom',
    meeting_id: '123-456-789',
    meeting_password: 'PeerRef2024',
    calendar_event_id: 'cal-event-001',
    status: 'scheduled',
    cancellation_reason: null,
    reschedule_count: 0,
    briefing_materials: [
      'Global Manufacturing case study',
      'Process automation ROI calculator',
      'Quality control implementation guide',
    ],
    talking_points: [
      'Implementation timeline and approach',
      'ROI achieved from process automation',
      'Quality improvement metrics',
      'Change management best practices',
    ],
    questions_to_cover: [
      'What were the biggest implementation challenges?',
      'How did you measure ROI?',
      'What would you do differently?',
      'How was user adoption handled?',
    ],
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
    next_steps: 'Follow up with technical demo',
    reward_amount: 75.0,
    reward_type: 'gift_card',
    reward_status: 'pending',
    reward_notes: null,
    call_outcome: null,
    deal_impact: null,
    next_call_recommended: null,
    reference_strength: null,
    internal_notes: 'Perfect match - same industry and company size',
    tags: ['manufacturing', 'scheduled', 'peer_to_peer', 'high_priority'],
    call_preparation_time_minutes: null,
    total_effort_score: null,
    external_meeting_id: null,
    external_recording_id: null,
    crm_activity_id: 'SF-Activity-001',
  },
  {
    opportunity_id: opportunityIds[1],
    advocate_id: advocateIds[0], // John Chen (Software)
    sales_rep_id: salesRepIds[1],
    prospect_name: 'David Park',
    prospect_email: 'david.park@techstart.io',
    prospect_title: 'VP of Engineering',
    prospect_company: 'TechStart Innovations',
    prospect_phone: '+1-555-2002',
    scheduled_at: '2024-01-18T14:00:00Z',
    actual_start_time: '2024-01-18T14:05:00Z',
    actual_end_time: '2024-01-18T14:50:00Z',
    duration_minutes: 45,
    timezone: 'America/Los_Angeles',
    meeting_link: 'https://teams.microsoft.com/l/meetup-join/456',
    meeting_platform: 'teams',
    meeting_id: 'teams-456-789',
    meeting_password: null,
    calendar_event_id: 'cal-event-002',
    status: 'completed',
    cancellation_reason: null,
    reschedule_count: 1,
    briefing_materials: [
      'InnovateTech API architecture overview',
      'Security implementation best practices',
      'Developer portal setup guide',
    ],
    talking_points: [
      'API gateway implementation approach',
      'Security and authentication patterns',
      'Developer experience and documentation',
      'Performance and scaling considerations',
    ],
    questions_to_cover: [
      'How did you approach API security?',
      'What were the key technical decisions?',
      'How did developers adopt the new platform?',
      'What monitoring and analytics do you use?',
    ],
    advocate_briefed: true,
    prospect_briefed: true,
    call_recording_url: 'https://recordings.zoom.us/rec/abc123',
    call_transcript: 'Full transcript available in call intelligence',
    call_intelligence: {
      sentiment: 'positive',
      key_topics: ['api_security', 'developer_experience', 'performance'],
      engagement_score: 8.5,
      technical_depth: 9,
      business_value_discussion: 7,
    },
    ai_summary:
      'Highly successful technical reference call. Prospect was impressed with security approach and developer portal. Strong alignment on technical requirements.',
    key_topics_discussed: [
      'API Gateway Architecture',
      'OAuth Implementation',
      'Rate Limiting',
      'Developer Portal',
    ],
    sentiment_score: 0.8,
    advocate_feedback: {
      preparation_quality: 5,
      prospect_engagement: 5,
      technical_level: 'appropriate',
      likelihood_to_recommend: 'very_likely',
      additional_comments:
        'Great technical discussion, prospect asked excellent questions',
    },
    prospect_feedback: {
      advocate_knowledge: 5,
      relevance_to_situation: 5,
      likelihood_to_proceed: 'high',
      additional_questions: 'Would like to see technical demo',
      overall_satisfaction: 5,
    },
    sales_rep_feedback: {
      call_effectiveness: 5,
      advocate_performance: 5,
      prospect_interest_level: 'high',
      next_steps_clarity: 'clear',
      overall_satisfaction: 5,
    },
    advocate_rating: 5,
    call_quality_rating: 5,
    technical_quality_score: 9,
    business_value_score: 8,
    follow_up_required: true,
    follow_up_actions: [
      'Send technical architecture documentation',
      'Schedule product demo',
      'Provide pricing proposal',
    ],
    follow_up_completed: false,
    next_steps: 'Schedule technical demo for next week',
    reward_amount: 100.0,
    reward_type: 'donation',
    reward_status: 'approved',
    reward_notes:
      'Excellent call performance, donation to tech education charity',
    call_outcome: 'positive',
    deal_impact: 'accelerated',
    next_call_recommended: false,
    reference_strength: 'strong',
    internal_notes:
      'Excellent call, prospect highly engaged, strong technical alignment',
    tags: ['software', 'completed', 'technical', 'high_impact'],
    call_preparation_time_minutes: 30,
    total_effort_score: 8,
    external_meeting_id: 'teams-meeting-456',
    external_recording_id: 'rec-456-789',
    crm_activity_id: 'HUB-Activity-002',
  },
];

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clear existing data (optional - uncomment if needed)
    // console.log('🧹 Clearing existing data...');
    // await supabase.from('reference_calls').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    // await supabase.from('opportunities').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    // await supabase.from('advocates').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    // await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    // await supabase.from('companies').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Create companies
    console.log('🏢 Creating companies...');
    const { data: createdCompanies, error: companiesError } = await supabase
      .from('companies')
      .insert(companies)
      .select();

    if (companiesError) throw companiesError;
    console.log(`✅ Created ${createdCompanies.length} companies`);

    // Create users for the first company
    const firstCompanyId = createdCompanies[0].id;
    const users = generateUsers(firstCompanyId);

    console.log('👥 Creating users...');
    const { data: createdUsers, error: usersError } = await supabase
      .from('users')
      .insert(users)
      .select();

    if (usersError) throw usersError;
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create advocates
    const advocates = generateAdvocates(firstCompanyId);

    console.log('🎯 Creating advocates...');
    const { data: createdAdvocates, error: advocatesError } = await supabase
      .from('advocates')
      .insert(advocates)
      .select();

    if (advocatesError) throw advocatesError;
    console.log(`✅ Created ${createdAdvocates.length} advocates`);

    // Create opportunities
    const salesRepIds = createdUsers
      .filter((u) => u.role === 'sales_rep')
      .map((u) => u.id);
    const opportunities = generateOpportunities(firstCompanyId, salesRepIds);

    console.log('💼 Creating opportunities...');
    const { data: createdOpportunities, error: opportunitiesError } =
      await supabase.from('opportunities').insert(opportunities).select();

    if (opportunitiesError) throw opportunitiesError;
    console.log(`✅ Created ${createdOpportunities.length} opportunities`);

    // Create reference calls
    const opportunityIds = createdOpportunities.map((o) => o.id);
    const advocateIds = createdAdvocates.map((a) => a.id);
    const referenceCalls = generateReferenceCalls(
      opportunityIds,
      advocateIds,
      salesRepIds
    );

    console.log('📞 Creating reference calls...');
    const { data: createdCalls, error: callsError } = await supabase
      .from('reference_calls')
      .insert(referenceCalls)
      .select();

    if (callsError) throw callsError;
    console.log(`✅ Created ${createdCalls.length} reference calls`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   ${createdCompanies.length} companies`);
    console.log(`   ${createdUsers.length} users`);
    console.log(`   ${createdAdvocates.length} advocates`);
    console.log(`   ${createdOpportunities.length} opportunities`);
    console.log(`   ${createdCalls.length} reference calls`);

    console.log('\n🔑 Login Information:');
    console.log('   Company: TechFlow Solutions (techflow.com)');
    console.log('   Admin: admin@techflow.com');
    console.log('   Sales Rep 1: sales1@techflow.com');
    console.log('   Sales Rep 2: sales2@techflow.com');

    console.log('\n🎯 Test Data Includes:');
    console.log(
      '   • Multi-industry advocates (Software, Manufacturing, Financial Services)'
    );
    console.log(
      '   • Realistic opportunities with different stages and urgencies'
    );
    console.log('   • Completed and scheduled reference calls');
    console.log('   • Comprehensive feedback and analytics data');
    console.log('   • CRM integration examples (Salesforce, HubSpot)');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log(
        '\n✨ You can now start developing with realistic test data!'
      );
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Fatal error:', error);
      process.exit(1);
    });
}

export { seedDatabase };
