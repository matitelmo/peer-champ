/**
 * Database Seed Script
 *
 * Populates the database with sample data for development and testing.
 * This script creates companies, users, advocates, opportunities, and reference calls.
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Sample data
const sampleCompanies = [
  {
    name: 'TechCorp Solutions',
    domain: 'techcorp.com',
    subscription_tier: 'enterprise' as const,
    settings: {
      branding: {
        logo_url: 'https://example.com/techcorp-logo.png',
        primary_color: '#3b82f6',
      },
      features: {
        sso_enabled: true,
        advanced_analytics: true,
      },
    },
  },
  {
    name: 'StartupXYZ',
    domain: 'startupxyz.com',
    subscription_tier: 'professional' as const,
    settings: {
      branding: {
        logo_url: 'https://example.com/startupxyz-logo.png',
        primary_color: '#10b981',
      },
      features: {
        sso_enabled: false,
        advanced_analytics: false,
      },
    },
  },
  {
    name: 'Global Enterprises Inc',
    domain: 'globalenterprises.com',
    subscription_tier: 'enterprise' as const,
    settings: {
      branding: {
        logo_url: 'https://example.com/global-logo.png',
        primary_color: '#8b5cf6',
      },
      features: {
        sso_enabled: true,
        advanced_analytics: true,
        custom_integrations: true,
      },
    },
  },
];

const sampleUsers = [
  {
    company_id: '', // Will be set after companies are created
    email: 'admin@techcorp.com',
    role: 'admin' as const,
    first_name: 'John',
    last_name: 'Admin',
    profile: {
      department: 'IT',
      phone: '+1-555-0101',
    },
    is_active: true,
  },
  {
    company_id: '', // Will be set after companies are created
    email: 'sales@techcorp.com',
    role: 'sales_rep' as const,
    first_name: 'Sarah',
    last_name: 'Sales',
    profile: {
      department: 'Sales',
      phone: '+1-555-0102',
    },
    is_active: true,
  },
  {
    company_id: '', // Will be set after companies are created
    email: 'manager@startupxyz.com',
    role: 'admin' as const,
    first_name: 'Mike',
    last_name: 'Manager',
    profile: {
      department: 'Operations',
      phone: '+1-555-0201',
    },
    is_active: true,
  },
  {
    company_id: '', // Will be set after companies are created
    email: 'rep@startupxyz.com',
    role: 'sales_rep' as const,
    first_name: 'Emily',
    last_name: 'Rep',
    profile: {
      department: 'Sales',
      phone: '+1-555-0202',
    },
    is_active: true,
  },
];

const sampleAdvocates = [
  {
    company_id: '', // Will be set after companies are created
    name: 'Alex Johnson',
    email: 'alex.johnson@customer1.com',
    title: 'CTO',
    company_name: 'Customer Corp 1',
    phone: '+1-555-1001',
    industry: 'Technology',
    company_size: '201-500' as const,
    geographic_region: 'North America',
    use_cases: ['API Integration', 'Data Analytics', 'Cloud Migration'],
    expertise_areas: ['Backend Development', 'DevOps', 'Data Engineering'],
    success_stories: [
      'Reduced API response time by 60%',
      'Implemented successful cloud migration',
    ],
    availability_score: 85,
    total_calls_completed: 12,
    last_call_date: new Date(
      Date.now() - 7 * 24 * 60 * 60 * 1000
    ).toISOString(),
    max_calls_per_month: 8,
    preferred_call_times: ['09:00-12:00', '14:00-17:00'],
    timezone: 'America/New_York',
    languages: ['English'],
    call_duration_preference: 30,
    status: 'active' as const,
    enrollment_date: new Date(
      Date.now() - 90 * 24 * 60 * 60 * 1000
    ).toISOString(),
    last_activity_date: new Date(
      Date.now() - 1 * 24 * 60 * 60 * 1000
    ).toISOString(),
    total_rewards_earned: 450,
    preferred_reward_type: 'donation' as const,
    internal_notes: 'Very engaged advocate, great technical knowledge',
    tags: ['technical', 'senior', 'engaged'],
    average_rating: 4.8,
    total_ratings: 12,
  },
  {
    company_id: '', // Will be set after companies are created
    name: 'Maria Garcia',
    email: 'maria.garcia@customer2.com',
    title: 'VP of Engineering',
    company_name: 'Customer Corp 2',
    phone: '+1-555-1002',
    industry: 'Fintech',
    company_size: '51-200' as const,
    geographic_region: 'North America',
    use_cases: ['Security Implementation', 'Compliance', 'Scalability'],
    expertise_areas: ['Security', 'Compliance', 'System Architecture'],
    success_stories: [
      'Implemented SOC 2 compliance',
      'Scaled system to handle 10x traffic',
    ],
    availability_score: 70,
    total_calls_completed: 8,
    last_call_date: new Date(
      Date.now() - 14 * 24 * 60 * 60 * 1000
    ).toISOString(),
    max_calls_per_month: 6,
    preferred_call_times: ['10:00-12:00', '15:00-17:00'],
    timezone: 'America/Los_Angeles',
    languages: ['English', 'Spanish'],
    call_duration_preference: 45,
    status: 'active' as const,
    enrollment_date: new Date(
      Date.now() - 60 * 24 * 60 * 60 * 1000
    ).toISOString(),
    last_activity_date: new Date(
      Date.now() - 3 * 24 * 60 * 60 * 1000
    ).toISOString(),
    total_rewards_earned: 300,
    preferred_reward_type: 'gift_card' as const,
    internal_notes: 'Excellent for security and compliance discussions',
    tags: ['security', 'compliance', 'senior'],
    average_rating: 4.6,
    total_ratings: 8,
  },
  {
    company_id: '', // Will be set after companies are created
    name: 'David Chen',
    email: 'david.chen@customer3.com',
    title: 'Product Manager',
    company_name: 'Customer Corp 3',
    phone: '+1-555-1003',
    industry: 'E-commerce',
    company_size: '501-1000' as const,
    geographic_region: 'Asia Pacific',
    use_cases: ['Product Integration', 'User Experience', 'Analytics'],
    expertise_areas: ['Product Management', 'UX/UI', 'Analytics'],
    success_stories: [
      'Improved user engagement by 40%',
      'Successfully integrated new product features',
    ],
    availability_score: 90,
    total_calls_completed: 15,
    last_call_date: new Date(
      Date.now() - 3 * 24 * 60 * 60 * 1000
    ).toISOString(),
    max_calls_per_month: 10,
    preferred_call_times: ['08:00-11:00', '13:00-16:00'],
    timezone: 'Asia/Tokyo',
    languages: ['English', 'Mandarin'],
    call_duration_preference: 30,
    status: 'active' as const,
    enrollment_date: new Date(
      Date.now() - 120 * 24 * 60 * 60 * 1000
    ).toISOString(),
    last_activity_date: new Date(
      Date.now() - 1 * 24 * 60 * 60 * 1000
    ).toISOString(),
    total_rewards_earned: 600,
    preferred_reward_type: 'donation' as const,
    internal_notes: 'Very active advocate, great for product discussions',
    tags: ['product', 'ux', 'active'],
    average_rating: 4.9,
    total_ratings: 15,
  },
];

const sampleOpportunities = [
  {
    company_id: '', // Will be set after companies are created
    sales_rep_id: '', // Will be set after users are created
    prospect_company: 'Prospect Corp 1',
    prospect_contact_name: 'Jane Smith',
    prospect_contact_email: 'jane.smith@prospect1.com',
    prospect_contact_title: 'CTO',
    prospect_phone: '+1-555-2001',
    prospect_website: 'https://prospect1.com',
    prospect_industry: 'Technology',
    prospect_size: '201-500' as const,
    geographic_region: 'North America',
    opportunity_name: 'API Integration Project',
    use_case: 'Customer wants to integrate our API with their existing systems',
    product_interest: ['API', 'Integration Tools', 'Documentation'],
    technical_requirements: ['REST API', 'Webhooks', 'SDK'],
    business_challenges: ['Legacy System Integration', 'Data Synchronization'],
    deal_value: 50000,
    currency: 'USD',
    deal_stage: 'proposal' as const,
    probability: 75,
    expected_close_date: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
    reference_request_status: 'requested' as const,
    reference_urgency: 'medium' as const,
    reference_type_needed: 'technical' as const,
    desired_advocate_industry: 'Technology',
    desired_advocate_size: '201-500' as const,
    desired_advocate_region: 'North America',
    desired_use_cases: ['API Integration', 'Data Analytics'],
    desired_expertise_areas: ['Backend Development', 'API Design'],
    external_crm_id: 'SF-OPP-001',
    external_crm_type: 'salesforce' as const,
    external_crm_url: 'https://salesforce.com/opportunity/001',
    reference_needed_by: new Date(
      Date.now() + 14 * 24 * 60 * 60 * 1000
    ).toISOString(),
    follow_up_date: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString(),
    created_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    internal_notes: 'High priority opportunity, customer is very interested',
    sales_notes:
      'Customer has budget approved, waiting for technical validation',
    competitive_situation: 'Competing with 2 other vendors',
    decision_criteria: ['Technical Fit', 'Price', 'Support'],
    key_stakeholders: ['CTO', 'VP Engineering', 'Procurement'],
    tags: ['api', 'integration', 'high-value'],
    priority_score: 85,
    last_activity_date: new Date(
      Date.now() - 2 * 24 * 60 * 60 * 1000
    ).toISOString(),
  },
  {
    company_id: '', // Will be set after companies are created
    sales_rep_id: '', // Will be set after users are created
    prospect_company: 'Prospect Corp 2',
    prospect_contact_name: 'Bob Wilson',
    prospect_contact_email: 'bob.wilson@prospect2.com',
    prospect_contact_title: 'VP of Engineering',
    prospect_phone: '+1-555-2002',
    prospect_website: 'https://prospect2.com',
    prospect_industry: 'Fintech',
    prospect_size: '51-200' as const,
    geographic_region: 'North America',
    opportunity_name: 'Security Compliance Implementation',
    use_case: 'Customer needs to implement security compliance for SOC 2',
    product_interest: ['Security Features', 'Compliance Tools', 'Audit Logs'],
    technical_requirements: [
      'SOC 2 Compliance',
      'Audit Logging',
      'Access Controls',
    ],
    business_challenges: ['Compliance Requirements', 'Security Audit'],
    deal_value: 75000,
    currency: 'USD',
    deal_stage: 'qualification' as const,
    probability: 60,
    expected_close_date: new Date(
      Date.now() + 45 * 24 * 60 * 60 * 1000
    ).toISOString(),
    reference_request_status: 'not_requested' as const,
    reference_urgency: 'low' as const,
    reference_type_needed: 'general' as const,
    desired_advocate_industry: 'Fintech',
    desired_advocate_size: '51-200' as const,
    desired_advocate_region: 'North America',
    desired_use_cases: ['Security Implementation', 'Compliance'],
    desired_expertise_areas: ['Security', 'Compliance'],
    external_crm_id: 'SF-OPP-002',
    external_crm_type: 'salesforce' as const,
    external_crm_url: 'https://salesforce.com/opportunity/002',
    reference_needed_by: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
    follow_up_date: new Date(
      Date.now() + 10 * 24 * 60 * 60 * 1000
    ).toISOString(),
    created_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    internal_notes: 'Customer is in early evaluation phase',
    sales_notes: 'Need to schedule technical demo',
    competitive_situation: 'Early stage, no clear competitors yet',
    decision_criteria: [
      'Security Features',
      'Compliance',
      'Ease of Implementation',
    ],
    key_stakeholders: ['VP Engineering', 'Security Team', 'Compliance Officer'],
    tags: ['security', 'compliance', 'fintech'],
    priority_score: 70,
    last_activity_date: new Date(
      Date.now() - 5 * 24 * 60 * 60 * 1000
    ).toISOString(),
  },
];

const sampleReferenceCalls = [
  {
    opportunity_id: '', // Will be set after opportunities are created
    advocate_id: '', // Will be set after advocates are created
    sales_rep_id: '', // Will be set after users are created
    prospect_name: 'Jane Smith',
    prospect_email: 'jane.smith@prospect1.com',
    prospect_title: 'CTO',
    prospect_company: 'Prospect Corp 1',
    prospect_phone: '+1-555-2001',
    scheduled_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    timezone: 'America/New_York',
    meeting_platform: 'zoom' as const,
    meeting_link: 'https://zoom.us/j/123456789',
    meeting_id: '123456789',
    status: 'scheduled' as const,
    briefing_materials: [
      'Product overview document',
      'Technical specifications',
      'Customer success stories',
    ],
    talking_points: [
      'API integration experience',
      'Performance improvements achieved',
      'Support and documentation quality',
    ],
    questions_to_cover: [
      'How did the integration process go?',
      'What challenges did you face?',
      'How has the solution performed?',
    ],
    advocate_briefed: false,
    prospect_briefed: false,
    follow_up_required: true,
    follow_up_actions: [
      'Send meeting reminder',
      'Prepare briefing materials',
      'Schedule follow-up call',
    ],
    follow_up_completed: false,
    reward_amount: 100,
    reward_type: 'donation' as const,
    reward_status: 'pending' as const,
    internal_notes: 'First reference call for this opportunity',
    tags: ['api', 'integration', 'technical'],
    call_preparation_time_minutes: 30,
    total_effort_score: 7,
  },
];

// Main seeding function
async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // 1. Create companies
    console.log('📊 Creating companies...');
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .insert(sampleCompanies)
      .select();

    if (companiesError) {
      throw new Error(`Error creating companies: ${companiesError.message}`);
    }

    console.log(`✅ Created ${companies.length} companies`);

    // 2. Update user company IDs and create users
    console.log('👥 Creating users...');
    const usersWithCompanyIds = sampleUsers.map((user, index) => ({
      ...user,
      company_id: companies[Math.floor(index / 2)].id, // Distribute users across companies
    }));

    const { data: users, error: usersError } = await supabase
      .from('users')
      .insert(usersWithCompanyIds)
      .select();

    if (usersError) {
      throw new Error(`Error creating users: ${usersError.message}`);
    }

    console.log(`✅ Created ${users.length} users`);

    // 3. Update advocate company IDs and create advocates
    console.log('🤝 Creating advocates...');
    const advocatesWithCompanyIds = sampleAdvocates.map((advocate, index) => ({
      ...advocate,
      company_id: companies[index % companies.length].id, // Distribute advocates across companies
    }));

    const { data: advocates, error: advocatesError } = await supabase
      .from('advocates')
      .insert(advocatesWithCompanyIds)
      .select();

    if (advocatesError) {
      throw new Error(`Error creating advocates: ${advocatesError.message}`);
    }

    console.log(`✅ Created ${advocates.length} advocates`);

    // 4. Update opportunity company and sales rep IDs and create opportunities
    console.log('💼 Creating opportunities...');
    const opportunitiesWithIds = sampleOpportunities.map(
      (opportunity, index) => ({
        ...opportunity,
        company_id: companies[index % companies.length].id,
        sales_rep_id: users.filter((u) => u.role === 'sales_rep')[index % 2].id,
      })
    );

    const { data: opportunities, error: opportunitiesError } = await supabase
      .from('opportunities')
      .insert(opportunitiesWithIds)
      .select();

    if (opportunitiesError) {
      throw new Error(
        `Error creating opportunities: ${opportunitiesError.message}`
      );
    }

    console.log(`✅ Created ${opportunities.length} opportunities`);

    // 5. Update reference call IDs and create reference calls
    console.log('📞 Creating reference calls...');
    const referenceCallsWithIds = sampleReferenceCalls.map((call, index) => ({
      ...call,
      opportunity_id: opportunities[index].id,
      advocate_id: advocates[index].id,
      sales_rep_id: users.filter((u) => u.role === 'sales_rep')[index % 2].id,
    }));

    const { data: referenceCalls, error: referenceCallsError } = await supabase
      .from('reference_calls')
      .insert(referenceCallsWithIds)
      .select();

    if (referenceCallsError) {
      throw new Error(
        `Error creating reference calls: ${referenceCallsError.message}`
      );
    }

    console.log(`✅ Created ${referenceCalls.length} reference calls`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   Companies: ${companies.length}`);
    console.log(`   Users: ${users.length}`);
    console.log(`   Advocates: ${advocates.length}`);
    console.log(`   Opportunities: ${opportunities.length}`);
    console.log(`   Reference Calls: ${referenceCalls.length}`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding function
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;
