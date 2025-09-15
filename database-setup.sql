-- Migration 1: 20240101000001_create_companies_and_users.sql
-- Migration: Create companies and users tables
-- This migration creates the foundational tables for multi-tenant architecture

-- Companies table (Tenants)
-- Each company represents a separate tenant in the system
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  domain TEXT UNIQUE, -- Company domain for email-based tenant identification
  subscription_tier TEXT DEFAULT 'professional' CHECK (subscription_tier IN ('starter', 'professional', 'enterprise')),
  settings JSONB DEFAULT '{}', -- Company-specific configuration
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for domain lookups (common operation for tenant identification)
CREATE INDEX IF NOT EXISTS idx_companies_domain ON companies(domain);

-- Users table (Sales Reps, Advocates, Admins)
-- Note: This extends Supabase's built-in auth.users with application-specific data
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('sales_rep', 'advocate', 'admin')),
  first_name TEXT,
  last_name TEXT,
  profile JSONB DEFAULT '{}', -- Additional user profile data
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_company_role ON users(company_id, role);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at timestamps
CREATE TRIGGER update_companies_updated_at 
  BEFORE UPDATE ON companies 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert a default company for development
INSERT INTO companies (name, domain, subscription_tier) 
VALUES ('Demo Company', 'demo.com', 'professional')
ON CONFLICT (domain) DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE companies IS 'Multi-tenant companies using the PeerChamps platform';
COMMENT ON TABLE users IS 'Application users (sales reps, advocates, admins) belonging to companies';
COMMENT ON COLUMN companies.domain IS 'Company email domain for automatic tenant identification';
COMMENT ON COLUMN companies.subscription_tier IS 'Subscription level: starter, professional, or enterprise';
COMMENT ON COLUMN users.role IS 'User role: sales_rep, advocate, or admin';
COMMENT ON COLUMN users.profile IS 'Additional user profile data stored as JSON';


-- Migration 2: 20240101000002_create_advocates_table.sql
-- Migration: Create advocates table
-- This migration creates the advocates table for customer reference program participants

-- Advocates table
-- Stores information about customer advocates who participate in reference calls
CREATE TABLE IF NOT EXISTS advocates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Link to Supabase auth if they have an account
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Basic advocate information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  title TEXT,
  company_name TEXT,
  phone TEXT,
  
  -- Company/industry details
  industry TEXT,
  company_size TEXT CHECK (company_size IN ('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+')),
  geographic_region TEXT,
  
  -- Expertise and specialization
  use_cases TEXT[], -- Array of use cases they can speak to
  expertise_areas TEXT[], -- Array of technical areas they can discuss
  success_stories TEXT[], -- Array of success story topics
  
  -- Availability and capacity management
  availability_score INTEGER DEFAULT 100 CHECK (availability_score >= 0 AND availability_score <= 100),
  total_calls_completed INTEGER DEFAULT 0 CHECK (total_calls_completed >= 0),
  last_call_date TIMESTAMP WITH TIME ZONE,
  max_calls_per_month INTEGER DEFAULT 4 CHECK (max_calls_per_month >= 0 AND max_calls_per_month <= 20),
  
  -- Preferences and constraints
  preferred_call_times TEXT[], -- Array of preferred time slots
  timezone TEXT DEFAULT 'UTC',
  languages TEXT[] DEFAULT ARRAY['English'], -- Languages they can conduct calls in
  call_duration_preference INTEGER DEFAULT 30 CHECK (call_duration_preference IN (15, 30, 45, 60)), -- Minutes
  
  -- Program participation
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending', 'blacklisted')),
  enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Reward and incentive tracking
  total_rewards_earned DECIMAL(10,2) DEFAULT 0.00,
  preferred_reward_type TEXT DEFAULT 'gift_card' CHECK (preferred_reward_type IN ('gift_card', 'donation', 'company_swag', 'cash')),
  
  -- Internal notes and tags
  internal_notes TEXT,
  tags TEXT[], -- For categorization and filtering
  
  -- Quality and performance metrics
  average_rating DECIMAL(3,2) CHECK (average_rating >= 1.0 AND average_rating <= 5.0),
  total_ratings INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_advocates_company_id ON advocates(company_id);
CREATE INDEX IF NOT EXISTS idx_advocates_status ON advocates(status);
CREATE INDEX IF NOT EXISTS idx_advocates_industry ON advocates(industry);
CREATE INDEX IF NOT EXISTS idx_advocates_company_size ON advocates(company_size);
CREATE INDEX IF NOT EXISTS idx_advocates_geographic_region ON advocates(geographic_region);
CREATE INDEX IF NOT EXISTS idx_advocates_availability_score ON advocates(availability_score);
CREATE INDEX IF NOT EXISTS idx_advocates_last_call_date ON advocates(last_call_date);
CREATE INDEX IF NOT EXISTS idx_advocates_enrollment_date ON advocates(enrollment_date);
CREATE INDEX IF NOT EXISTS idx_advocates_email ON advocates(email);

-- Create GIN indexes for array columns (for efficient searching)
CREATE INDEX IF NOT EXISTS idx_advocates_use_cases ON advocates USING GIN(use_cases);
CREATE INDEX IF NOT EXISTS idx_advocates_expertise_areas ON advocates USING GIN(expertise_areas);
CREATE INDEX IF NOT EXISTS idx_advocates_tags ON advocates USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_advocates_languages ON advocates USING GIN(languages);

-- Create composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_advocates_company_status ON advocates(company_id, status);
CREATE INDEX IF NOT EXISTS idx_advocates_status_availability ON advocates(status, availability_score);
CREATE INDEX IF NOT EXISTS idx_advocates_industry_size ON advocates(industry, company_size);

-- Create trigger for automatic updated_at timestamp
CREATE TRIGGER update_advocates_updated_at 
  BEFORE UPDATE ON advocates 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create a function to update availability score based on call frequency
CREATE OR REPLACE FUNCTION update_advocate_availability()
RETURNS TRIGGER AS $$
BEGIN
  -- Update last_activity_date when any relevant field changes
  NEW.last_activity_date = NOW();
  
  -- Recalculate availability score based on recent call activity
  -- This is a simplified algorithm; real implementation might be more complex
  IF NEW.total_calls_completed > OLD.total_calls_completed THEN
    -- Advocate just completed a call, slightly reduce availability
    NEW.availability_score = GREATEST(0, NEW.availability_score - 5);
    NEW.last_call_date = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for availability score updates
CREATE TRIGGER update_advocate_availability_trigger
  BEFORE UPDATE ON advocates
  FOR EACH ROW
  EXECUTE FUNCTION update_advocate_availability();

-- Add some sample data for development
DO $$
DECLARE
  demo_company_id UUID;
BEGIN
  -- Get the demo company ID
  SELECT id INTO demo_company_id FROM companies WHERE domain = 'demo.com';
  
  -- Insert sample advocates if demo company exists
  IF demo_company_id IS NOT NULL THEN
    INSERT INTO advocates (
      company_id, name, email, title, company_name, industry, company_size,
      use_cases, expertise_areas, geographic_region, languages,
      preferred_reward_type, tags
    ) VALUES 
    (
      demo_company_id,
      'John Smith',
      'john.smith@techcorp.com',
      'Chief Technology Officer',
      'TechCorp Solutions',
      'Software',
      '201-500',
      ARRAY['API Integration', 'Data Analytics', 'Cloud Migration'],
      ARRAY['Technical Architecture', 'Enterprise Integration', 'Cloud Computing'],
      'North America',
      ARRAY['English'],
      'gift_card',
      ARRAY['technical', 'senior_executive', 'cloud_expert']
    ),
    (
      demo_company_id,
      'Sarah Johnson',
      'sarah.johnson@innovate.com',
      'VP of Operations',
      'Innovate Inc',
      'Manufacturing',
      '51-200',
      ARRAY['Process Automation', 'Quality Control', 'Supply Chain'],
      ARRAY['Operations Management', 'Process Optimization', 'Quality Assurance'],
      'North America',
      ARRAY['English', 'Spanish'],
      'donation',
      ARRAY['operations', 'manufacturing', 'process_expert']
    )
    ON CONFLICT (email) DO NOTHING;
  END IF;
END $$;

-- Add comments for documentation
COMMENT ON TABLE advocates IS 'Customer advocates who participate in reference calls and customer success programs';
COMMENT ON COLUMN advocates.user_id IS 'Optional link to Supabase auth user if advocate has platform access';
COMMENT ON COLUMN advocates.availability_score IS 'Score from 0-100 indicating advocate availability (100 = most available)';
COMMENT ON COLUMN advocates.use_cases IS 'Array of use cases the advocate can speak to';
COMMENT ON COLUMN advocates.expertise_areas IS 'Array of technical/business areas of expertise';
COMMENT ON COLUMN advocates.max_calls_per_month IS 'Maximum number of calls advocate is willing to do per month';
COMMENT ON COLUMN advocates.preferred_reward_type IS 'Advocate preference for reward/incentive type';
COMMENT ON COLUMN advocates.tags IS 'Array of tags for categorization and filtering';


-- Migration 3: 20240101000003_create_opportunities_table.sql
-- Migration: Create opportunities table
-- This migration creates the opportunities table for tracking sales opportunities and prospects

-- Opportunities table
-- Stores information about sales opportunities that may need customer references
CREATE TABLE IF NOT EXISTS opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  sales_rep_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Prospect/Customer Information
  prospect_company TEXT NOT NULL,
  prospect_contact_name TEXT,
  prospect_contact_email TEXT,
  prospect_contact_title TEXT,
  prospect_phone TEXT,
  prospect_website TEXT,
  
  -- Company Classification
  prospect_industry TEXT,
  prospect_size TEXT CHECK (prospect_size IN ('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+')),
  geographic_region TEXT,
  
  -- Opportunity Details
  opportunity_name TEXT NOT NULL,
  use_case TEXT,
  product_interest TEXT[],
  technical_requirements TEXT[],
  business_challenges TEXT[],
  
  -- Deal Information
  deal_value DECIMAL(12,2),
  currency TEXT DEFAULT 'USD',
  deal_stage TEXT DEFAULT 'discovery' CHECK (deal_stage IN (
    'discovery', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost'
  )),
  probability INTEGER CHECK (probability >= 0 AND probability <= 100),
  expected_close_date DATE,
  
  -- Reference Request Details
  reference_request_status TEXT DEFAULT 'not_requested' CHECK (reference_request_status IN (
    'not_requested', 'requested', 'in_progress', 'completed', 'declined'
  )),
  reference_urgency TEXT DEFAULT 'medium' CHECK (reference_urgency IN ('low', 'medium', 'high', 'urgent')),
  reference_type_needed TEXT DEFAULT 'general' CHECK (reference_type_needed IN (
    'general', 'technical', 'executive', 'peer_to_peer', 'roi_focused'
  )),
  
  -- Matching Requirements
  desired_advocate_industry TEXT,
  desired_advocate_size TEXT,
  desired_advocate_region TEXT,
  desired_use_cases TEXT[],
  desired_expertise_areas TEXT[],
  
  -- CRM Integration
  external_crm_id TEXT, -- ID in Salesforce, HubSpot, etc.
  external_crm_type TEXT CHECK (external_crm_type IN ('salesforce', 'hubspot', 'pipedrive', 'other')),
  external_crm_url TEXT,
  
  -- Timeline and Scheduling
  reference_needed_by DATE,
  follow_up_date DATE,
  created_date DATE DEFAULT CURRENT_DATE,
  
  -- Internal Notes and Tracking
  internal_notes TEXT,
  sales_notes TEXT,
  competitive_situation TEXT,
  decision_criteria TEXT[],
  key_stakeholders TEXT[],
  
  -- Tags and Classification
  tags TEXT[],
  priority_score INTEGER DEFAULT 50 CHECK (priority_score >= 0 AND priority_score <= 100),
  
  -- Activity Tracking
  last_activity_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_opportunities_company_id ON opportunities(company_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_sales_rep_id ON opportunities(sales_rep_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_deal_stage ON opportunities(deal_stage);
CREATE INDEX IF NOT EXISTS idx_opportunities_reference_status ON opportunities(reference_request_status);
CREATE INDEX IF NOT EXISTS idx_opportunities_reference_urgency ON opportunities(reference_urgency);
CREATE INDEX IF NOT EXISTS idx_opportunities_prospect_industry ON opportunities(prospect_industry);
CREATE INDEX IF NOT EXISTS idx_opportunities_prospect_size ON opportunities(prospect_size);
CREATE INDEX IF NOT EXISTS idx_opportunities_geographic_region ON opportunities(geographic_region);
CREATE INDEX IF NOT EXISTS idx_opportunities_expected_close_date ON opportunities(expected_close_date);
CREATE INDEX IF NOT EXISTS idx_opportunities_reference_needed_by ON opportunities(reference_needed_by);
CREATE INDEX IF NOT EXISTS idx_opportunities_priority_score ON opportunities(priority_score);
CREATE INDEX IF NOT EXISTS idx_opportunities_last_activity_date ON opportunities(last_activity_date);
CREATE INDEX IF NOT EXISTS idx_opportunities_external_crm_id ON opportunities(external_crm_id);

-- Create GIN indexes for array columns
CREATE INDEX IF NOT EXISTS idx_opportunities_product_interest ON opportunities USING GIN(product_interest);
CREATE INDEX IF NOT EXISTS idx_opportunities_technical_requirements ON opportunities USING GIN(technical_requirements);
CREATE INDEX IF NOT EXISTS idx_opportunities_business_challenges ON opportunities USING GIN(business_challenges);
CREATE INDEX IF NOT EXISTS idx_opportunities_desired_use_cases ON opportunities USING GIN(desired_use_cases);
CREATE INDEX IF NOT EXISTS idx_opportunities_desired_expertise_areas ON opportunities USING GIN(desired_expertise_areas);
CREATE INDEX IF NOT EXISTS idx_opportunities_decision_criteria ON opportunities USING GIN(decision_criteria);
CREATE INDEX IF NOT EXISTS idx_opportunities_key_stakeholders ON opportunities USING GIN(key_stakeholders);
CREATE INDEX IF NOT EXISTS idx_opportunities_tags ON opportunities USING GIN(tags);

-- Create composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_opportunities_company_stage ON opportunities(company_id, deal_stage);
CREATE INDEX IF NOT EXISTS idx_opportunities_rep_status ON opportunities(sales_rep_id, reference_request_status);
CREATE INDEX IF NOT EXISTS idx_opportunities_stage_urgency ON opportunities(deal_stage, reference_urgency);
CREATE INDEX IF NOT EXISTS idx_opportunities_industry_size ON opportunities(prospect_industry, prospect_size);

-- Create trigger for automatic updated_at timestamp
CREATE TRIGGER update_opportunities_updated_at 
  BEFORE UPDATE ON opportunities 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create a function to update activity tracking
CREATE OR REPLACE FUNCTION update_opportunity_activity()
RETURNS TRIGGER AS $$
BEGIN
  -- Update last_activity_date when important fields change
  IF (OLD.deal_stage IS DISTINCT FROM NEW.deal_stage) OR
     (OLD.reference_request_status IS DISTINCT FROM NEW.reference_request_status) OR
     (OLD.probability IS DISTINCT FROM NEW.probability) OR
     (OLD.expected_close_date IS DISTINCT FROM NEW.expected_close_date) THEN
    NEW.last_activity_date = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for activity tracking
CREATE TRIGGER update_opportunity_activity_trigger
  BEFORE UPDATE ON opportunities
  FOR EACH ROW
  EXECUTE FUNCTION update_opportunity_activity();

-- Add some sample data for development
DO $$
DECLARE
  demo_company_id UUID;
  demo_sales_rep_id UUID;
BEGIN
  -- Get the demo company and sales rep IDs
  SELECT id INTO demo_company_id FROM companies WHERE domain = 'demo.com';
  SELECT id INTO demo_sales_rep_id FROM users WHERE role = 'sales_rep' AND company_id = demo_company_id LIMIT 1;
  
  -- Insert sample opportunities if demo data exists
  IF demo_company_id IS NOT NULL AND demo_sales_rep_id IS NOT NULL THEN
    INSERT INTO opportunities (
      company_id, sales_rep_id, prospect_company, prospect_contact_name, 
      prospect_contact_email, prospect_industry, prospect_size, opportunity_name,
      use_case, deal_value, deal_stage, probability, expected_close_date,
      reference_request_status, reference_urgency, reference_type_needed,
      product_interest, technical_requirements, business_challenges,
      desired_advocate_industry, desired_advocate_size, tags, priority_score
    ) VALUES 
    (
      demo_company_id,
      demo_sales_rep_id,
      'Acme Corporation',
      'Jane Smith',
      'jane.smith@acmecorp.com',
      'Manufacturing',
      '201-500',
      'Acme Corp - Digital Transformation',
      'Process Automation',
      250000.00,
      'proposal',
      75,
      CURRENT_DATE + INTERVAL '45 days',
      'requested',
      'high',
      'technical',
      ARRAY['API Platform', 'Data Analytics', 'Cloud Migration'],
      ARRAY['REST API Integration', 'Real-time Analytics', 'Scalable Architecture'],
      ARRAY['Legacy System Integration', 'Data Silos', 'Manual Processes'],
      'Manufacturing',
      '201-500',
      ARRAY['enterprise', 'manufacturing', 'digital_transformation'],
      85
    ),
    (
      demo_company_id,
      demo_sales_rep_id,
      'TechStart Solutions',
      'Bob Wilson',
      'bob.wilson@techstart.com',
      'Software',
      '51-200',
      'TechStart - API Gateway Implementation',
      'API Management',
      75000.00,
      'negotiation',
      60,
      CURRENT_DATE + INTERVAL '30 days',
      'in_progress',
      'medium',
      'peer_to_peer',
      ARRAY['API Gateway', 'Security'],
      ARRAY['OAuth Implementation', 'Rate Limiting', 'API Monitoring'],
      ARRAY['API Security', 'Developer Experience', 'Performance'],
      'Software',
      '51-200',
      ARRAY['mid_market', 'software', 'api_management'],
      70
    )
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Add comments for documentation
COMMENT ON TABLE opportunities IS 'Sales opportunities that may require customer reference calls';
COMMENT ON COLUMN opportunities.external_crm_id IS 'ID from external CRM system (Salesforce, HubSpot, etc.)';
COMMENT ON COLUMN opportunities.reference_request_status IS 'Status of reference request: not_requested, requested, in_progress, completed, declined';
COMMENT ON COLUMN opportunities.reference_urgency IS 'Urgency level for reference call: low, medium, high, urgent';
COMMENT ON COLUMN opportunities.reference_type_needed IS 'Type of reference needed: general, technical, executive, peer_to_peer, roi_focused';
COMMENT ON COLUMN opportunities.priority_score IS 'Internal priority score from 0-100 for reference matching';
COMMENT ON COLUMN opportunities.desired_use_cases IS 'Array of use cases the prospect wants to hear about';
COMMENT ON COLUMN opportunities.desired_expertise_areas IS 'Array of expertise areas needed from advocates';


-- Migration 4: 20240101000004_create_reference_calls_table.sql
-- Migration: Create reference_calls table
-- This migration creates the reference_calls table for tracking reference call sessions

-- Reference Calls table
-- Stores information about scheduled and completed reference calls between advocates and prospects
CREATE TABLE IF NOT EXISTS reference_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Core Relationships
  opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  advocate_id UUID NOT NULL REFERENCES advocates(id) ON DELETE CASCADE,
  sales_rep_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Prospect Information
  prospect_name TEXT,
  prospect_email TEXT,
  prospect_title TEXT,
  prospect_company TEXT, -- Derived from opportunity but stored for convenience
  prospect_phone TEXT,
  
  -- Call Scheduling
  scheduled_at TIMESTAMP WITH TIME ZONE,
  actual_start_time TIMESTAMP WITH TIME ZONE,
  actual_end_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER, -- Calculated from start/end times
  timezone TEXT DEFAULT 'UTC',
  
  -- Meeting Details
  meeting_link TEXT,
  meeting_platform TEXT CHECK (meeting_platform IN ('zoom', 'teams', 'meet', 'webex', 'phone', 'other')),
  meeting_id TEXT, -- Platform-specific meeting ID
  meeting_password TEXT,
  calendar_event_id TEXT, -- For calendar integration
  
  -- Call Status and Lifecycle
  status TEXT DEFAULT 'scheduled' CHECK (status IN (
    'scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show', 'rescheduled'
  )),
  cancellation_reason TEXT,
  reschedule_count INTEGER DEFAULT 0,
  
  -- Pre-Call Preparation
  briefing_materials TEXT[],
  talking_points TEXT[],
  questions_to_cover TEXT[],
  advocate_briefed BOOLEAN DEFAULT false,
  prospect_briefed BOOLEAN DEFAULT false,
  
  -- Call Intelligence and AI Analysis
  call_recording_url TEXT,
  call_transcript TEXT,
  call_intelligence JSONB, -- AI-extracted insights, sentiment, key topics
  ai_summary TEXT,
  key_topics_discussed TEXT[],
  sentiment_score DECIMAL(3,2) CHECK (sentiment_score >= -1.0 AND sentiment_score <= 1.0),
  
  -- Post-Call Feedback
  advocate_feedback JSONB,
  prospect_feedback JSONB,
  sales_rep_feedback JSONB,
  
  -- Ratings and Quality
  advocate_rating INTEGER CHECK (advocate_rating >= 1 AND advocate_rating <= 5),
  call_quality_rating INTEGER CHECK (call_quality_rating >= 1 AND call_quality_rating <= 5),
  technical_quality_score INTEGER CHECK (technical_quality_score >= 1 AND technical_quality_score <= 10),
  business_value_score INTEGER CHECK (business_value_score >= 1 AND business_value_score <= 10),
  
  -- Follow-up Actions
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_actions TEXT[],
  follow_up_completed BOOLEAN DEFAULT false,
  next_steps TEXT,
  
  -- Rewards and Incentives
  reward_amount DECIMAL(10,2),
  reward_type TEXT CHECK (reward_type IN ('gift_card', 'donation', 'company_swag', 'cash', 'none')),
  reward_status TEXT DEFAULT 'pending' CHECK (reward_status IN ('pending', 'approved', 'sent', 'received', 'declined')),
  reward_notes TEXT,
  
  -- Outcome and Impact
  call_outcome TEXT CHECK (call_outcome IN ('positive', 'neutral', 'negative', 'no_outcome')),
  deal_impact TEXT CHECK (deal_impact IN ('accelerated', 'neutral', 'delayed', 'lost', 'unknown')),
  next_call_recommended BOOLEAN,
  reference_strength TEXT CHECK (reference_strength IN ('strong', 'moderate', 'weak', 'negative')),
  
  -- Internal Tracking
  internal_notes TEXT,
  tags TEXT[],
  call_preparation_time_minutes INTEGER,
  total_effort_score INTEGER CHECK (total_effort_score >= 1 AND total_effort_score <= 10),
  
  -- External Integration
  external_meeting_id TEXT, -- Calendar system meeting ID
  external_recording_id TEXT, -- Recording platform ID
  crm_activity_id TEXT, -- Associated CRM activity ID
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_reference_calls_opportunity_id ON reference_calls(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_reference_calls_advocate_id ON reference_calls(advocate_id);
CREATE INDEX IF NOT EXISTS idx_reference_calls_sales_rep_id ON reference_calls(sales_rep_id);
CREATE INDEX IF NOT EXISTS idx_reference_calls_status ON reference_calls(status);
CREATE INDEX IF NOT EXISTS idx_reference_calls_scheduled_at ON reference_calls(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_reference_calls_actual_start_time ON reference_calls(actual_start_time);
CREATE INDEX IF NOT EXISTS idx_reference_calls_call_outcome ON reference_calls(call_outcome);
CREATE INDEX IF NOT EXISTS idx_reference_calls_deal_impact ON reference_calls(deal_impact);
CREATE INDEX IF NOT EXISTS idx_reference_calls_reward_status ON reference_calls(reward_status);
CREATE INDEX IF NOT EXISTS idx_reference_calls_prospect_email ON reference_calls(prospect_email);
CREATE INDEX IF NOT EXISTS idx_reference_calls_meeting_platform ON reference_calls(meeting_platform);

-- Create GIN indexes for array and JSONB columns
CREATE INDEX IF NOT EXISTS idx_reference_calls_call_intelligence ON reference_calls USING GIN(call_intelligence);
CREATE INDEX IF NOT EXISTS idx_reference_calls_advocate_feedback ON reference_calls USING GIN(advocate_feedback);
CREATE INDEX IF NOT EXISTS idx_reference_calls_prospect_feedback ON reference_calls USING GIN(prospect_feedback);
CREATE INDEX IF NOT EXISTS idx_reference_calls_briefing_materials ON reference_calls USING GIN(briefing_materials);
CREATE INDEX IF NOT EXISTS idx_reference_calls_talking_points ON reference_calls USING GIN(talking_points);
CREATE INDEX IF NOT EXISTS idx_reference_calls_key_topics ON reference_calls USING GIN(key_topics_discussed);
CREATE INDEX IF NOT EXISTS idx_reference_calls_follow_up_actions ON reference_calls USING GIN(follow_up_actions);
CREATE INDEX IF NOT EXISTS idx_reference_calls_tags ON reference_calls USING GIN(tags);

-- Create composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_reference_calls_advocate_status ON reference_calls(advocate_id, status);
CREATE INDEX IF NOT EXISTS idx_reference_calls_opportunity_status ON reference_calls(opportunity_id, status);
CREATE INDEX IF NOT EXISTS idx_reference_calls_date_status ON reference_calls(scheduled_at, status);
CREATE INDEX IF NOT EXISTS idx_reference_calls_outcome_impact ON reference_calls(call_outcome, deal_impact);

-- Create trigger for automatic updated_at timestamp
CREATE TRIGGER update_reference_calls_updated_at 
  BEFORE UPDATE ON reference_calls 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create a function to calculate call duration and update advocate stats
CREATE OR REPLACE FUNCTION update_call_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate duration if start and end times are provided
  IF NEW.actual_start_time IS NOT NULL AND NEW.actual_end_time IS NOT NULL THEN
    NEW.duration_minutes = EXTRACT(EPOCH FROM (NEW.actual_end_time - NEW.actual_start_time)) / 60;
  END IF;
  
  -- Update advocate stats when call is completed
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    UPDATE advocates 
    SET 
      total_calls_completed = total_calls_completed + 1,
      last_call_date = NEW.actual_start_time,
      -- Slightly reduce availability score after completing a call
      availability_score = GREATEST(0, availability_score - 3)
    WHERE id = NEW.advocate_id;
  END IF;
  
  -- Reset availability if call was cancelled or rescheduled
  IF NEW.status IN ('cancelled', 'rescheduled') AND OLD.status = 'scheduled' THEN
    UPDATE advocates 
    SET availability_score = LEAST(100, availability_score + 2)
    WHERE id = NEW.advocate_id;
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for call statistics updates
CREATE TRIGGER update_call_stats_trigger
  BEFORE UPDATE ON reference_calls
  FOR EACH ROW
  EXECUTE FUNCTION update_call_stats();

-- Create trigger for new call statistics
CREATE TRIGGER insert_call_stats_trigger
  BEFORE INSERT ON reference_calls
  FOR EACH ROW
  EXECUTE FUNCTION update_call_stats();

-- Add some sample data for development
DO $$
DECLARE
  demo_opportunity_id UUID;
  demo_advocate_id UUID;
  demo_sales_rep_id UUID;
BEGIN
  -- Get sample IDs from existing data
  SELECT id INTO demo_opportunity_id FROM opportunities LIMIT 1;
  SELECT id INTO demo_advocate_id FROM advocates LIMIT 1;
  SELECT id INTO demo_sales_rep_id FROM users WHERE role = 'sales_rep' LIMIT 1;
  
  -- Insert sample reference calls if data exists
  IF demo_opportunity_id IS NOT NULL AND demo_advocate_id IS NOT NULL AND demo_sales_rep_id IS NOT NULL THEN
    INSERT INTO reference_calls (
      opportunity_id, advocate_id, sales_rep_id, prospect_name, prospect_email,
      prospect_title, scheduled_at, status, meeting_platform, meeting_link,
      briefing_materials, talking_points, advocate_briefed, prospect_briefed,
      reward_type, tags
    ) VALUES 
    (
      demo_opportunity_id,
      demo_advocate_id,
      demo_sales_rep_id,
      'Jane Smith',
      'jane.smith@acmecorp.com',
      'CTO',
      NOW() + INTERVAL '7 days',
      'scheduled',
      'zoom',
      'https://zoom.us/j/123456789',
      ARRAY['Product overview deck', 'Technical architecture document', 'ROI case study'],
      ARRAY['Technical implementation approach', 'Integration challenges', 'ROI results achieved'],
      true,
      false,
      'gift_card',
      ARRAY['technical_call', 'manufacturing', 'scheduled']
    ),
    (
      demo_opportunity_id,
      demo_advocate_id,
      demo_sales_rep_id,
      'Bob Wilson',
      'bob.wilson@techstart.com',
      'VP Engineering',
      NOW() - INTERVAL '3 days',
      'completed',
      'teams',
      'https://teams.microsoft.com/l/meetup-join/123',
      ARRAY['API documentation', 'Implementation timeline'],
      ARRAY['Development experience', 'API performance', 'Support quality'],
      true,
      true,
      'donation',
      ARRAY['peer_to_peer', 'software', 'completed']
    )
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Add comments for documentation
COMMENT ON TABLE reference_calls IS 'Reference calls between customer advocates and prospects';
COMMENT ON COLUMN reference_calls.call_intelligence IS 'AI-extracted insights, sentiment analysis, and key topics from the call';
COMMENT ON COLUMN reference_calls.advocate_feedback IS 'Post-call feedback from the advocate in JSON format';
COMMENT ON COLUMN reference_calls.prospect_feedback IS 'Post-call feedback from the prospect in JSON format';
COMMENT ON COLUMN reference_calls.sentiment_score IS 'Overall call sentiment from -1.0 (negative) to 1.0 (positive)';
COMMENT ON COLUMN reference_calls.reward_amount IS 'Monetary value of reward/incentive for the advocate';
COMMENT ON COLUMN reference_calls.call_outcome IS 'Overall outcome of the call: positive, neutral, negative, no_outcome';
COMMENT ON COLUMN reference_calls.deal_impact IS 'Impact on the associated deal: accelerated, neutral, delayed, lost, unknown';
COMMENT ON COLUMN reference_calls.reference_strength IS 'Strength of the reference provided: strong, moderate, weak, negative';


-- Migration 5: 20240101000005_configure_rls_policies.sql
-- Migration: Configure Row Level Security (RLS) Policies
-- This migration implements comprehensive RLS policies for multi-tenant data isolation

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE advocates ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE reference_calls ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's company ID
CREATE OR REPLACE FUNCTION get_user_company_id()
RETURNS UUID AS $$
DECLARE
  user_company_id UUID;
BEGIN
  -- Get the company_id for the current authenticated user
  SELECT company_id INTO user_company_id
  FROM users
  WHERE id = auth.uid();
  
  RETURN user_company_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user has admin role
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM users
  WHERE id = auth.uid();
  
  RETURN user_role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is sales rep
CREATE OR REPLACE FUNCTION is_sales_rep()
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM users
  WHERE id = auth.uid();
  
  RETURN user_role = 'sales_rep';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- COMPANIES TABLE POLICIES
-- ============================================================================

-- Policy: Users can only view their own company
CREATE POLICY "users_can_view_own_company" ON companies
  FOR SELECT
  USING (id = get_user_company_id());

-- Policy: Only admins can update company information
CREATE POLICY "admins_can_update_company" ON companies
  FOR UPDATE
  USING (id = get_user_company_id() AND is_admin_user());

-- Policy: No one can delete companies (protect data integrity)
CREATE POLICY "no_company_deletion" ON companies
  FOR DELETE
  USING (false);

-- ============================================================================
-- USERS TABLE POLICIES
-- ============================================================================

-- Policy: Users can view other users in their company
CREATE POLICY "users_can_view_company_users" ON users
  FOR SELECT
  USING (company_id = get_user_company_id());

-- Policy: Users can update their own profile
CREATE POLICY "users_can_update_own_profile" ON users
  FOR UPDATE
  USING (id = auth.uid());

-- Policy: Admins can update any user in their company
CREATE POLICY "admins_can_update_company_users" ON users
  FOR UPDATE
  USING (company_id = get_user_company_id() AND is_admin_user());

-- Policy: Admins can insert new users in their company
CREATE POLICY "admins_can_insert_company_users" ON users
  FOR INSERT
  WITH CHECK (company_id = get_user_company_id() AND is_admin_user());

-- Policy: No one can delete users (protect data integrity)
CREATE POLICY "no_user_deletion" ON users
  FOR DELETE
  USING (false);

-- ============================================================================
-- ADVOCATES TABLE POLICIES
-- ============================================================================

-- Policy: Users can view advocates in their company
CREATE POLICY "users_can_view_company_advocates" ON advocates
  FOR SELECT
  USING (company_id = get_user_company_id());

-- Policy: Sales reps and admins can update advocates in their company
CREATE POLICY "sales_reps_can_update_advocates" ON advocates
  FOR UPDATE
  USING (
    company_id = get_user_company_id() AND 
    (is_admin_user() OR is_sales_rep())
  );

-- Policy: Sales reps and admins can insert new advocates
CREATE POLICY "sales_reps_can_insert_advocates" ON advocates
  FOR INSERT
  WITH CHECK (
    company_id = get_user_company_id() AND 
    (is_admin_user() OR is_sales_rep())
  );

-- Policy: Only admins can delete advocates
CREATE POLICY "admins_can_delete_advocates" ON advocates
  FOR DELETE
  USING (company_id = get_user_company_id() AND is_admin_user());

-- ============================================================================
-- OPPORTUNITIES TABLE POLICIES
-- ============================================================================

-- Policy: Users can view opportunities in their company
CREATE POLICY "users_can_view_company_opportunities" ON opportunities
  FOR SELECT
  USING (company_id = get_user_company_id());

-- Policy: Sales reps can update their own opportunities
CREATE POLICY "sales_reps_can_update_own_opportunities" ON opportunities
  FOR UPDATE
  USING (
    company_id = get_user_company_id() AND 
    (sales_rep_id = auth.uid() OR is_admin_user())
  );

-- Policy: Sales reps and admins can insert new opportunities
CREATE POLICY "sales_reps_can_insert_opportunities" ON opportunities
  FOR INSERT
  WITH CHECK (
    company_id = get_user_company_id() AND 
    (is_admin_user() OR is_sales_rep())
  );

-- Policy: Only opportunity owners and admins can delete opportunities
CREATE POLICY "owners_can_delete_opportunities" ON opportunities
  FOR DELETE
  USING (
    company_id = get_user_company_id() AND 
    (sales_rep_id = auth.uid() OR is_admin_user())
  );

-- ============================================================================
-- REFERENCE_CALLS TABLE POLICIES
-- ============================================================================

-- Policy: Users can view reference calls for opportunities in their company
CREATE POLICY "users_can_view_company_reference_calls" ON reference_calls
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM opportunities o 
      WHERE o.id = reference_calls.opportunity_id 
      AND o.company_id = get_user_company_id()
    )
  );

-- Policy: Sales reps can update reference calls for their opportunities
CREATE POLICY "sales_reps_can_update_own_reference_calls" ON reference_calls
  FOR UPDATE
  USING (
    (sales_rep_id = auth.uid() OR is_admin_user()) AND
    EXISTS (
      SELECT 1 FROM opportunities o 
      WHERE o.id = reference_calls.opportunity_id 
      AND o.company_id = get_user_company_id()
    )
  );

-- Policy: Advocates can update their own call feedback
CREATE POLICY "advocates_can_update_own_call_feedback" ON reference_calls
  FOR UPDATE
  USING (
    advocate_id IN (
      SELECT a.id FROM advocates a 
      WHERE a.user_id = auth.uid() 
      AND a.company_id = get_user_company_id()
    )
  );

-- Policy: Sales reps and admins can insert new reference calls
CREATE POLICY "sales_reps_can_insert_reference_calls" ON reference_calls
  FOR INSERT
  WITH CHECK (
    (is_admin_user() OR is_sales_rep()) AND
    EXISTS (
      SELECT 1 FROM opportunities o 
      WHERE o.id = reference_calls.opportunity_id 
      AND o.company_id = get_user_company_id()
    )
  );

-- Policy: Only call owners and admins can delete reference calls
CREATE POLICY "owners_can_delete_reference_calls" ON reference_calls
  FOR DELETE
  USING (
    (sales_rep_id = auth.uid() OR is_admin_user()) AND
    EXISTS (
      SELECT 1 FROM opportunities o 
      WHERE o.id = reference_calls.opportunity_id 
      AND o.company_id = get_user_company_id()
    )
  );

-- ============================================================================
-- ADDITIONAL SECURITY FUNCTIONS
-- ============================================================================

-- Function to validate company access for API operations
CREATE OR REPLACE FUNCTION validate_company_access(target_company_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN target_company_id = get_user_company_id();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can access specific advocate
CREATE OR REPLACE FUNCTION can_access_advocate(advocate_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  advocate_company_id UUID;
BEGIN
  SELECT company_id INTO advocate_company_id
  FROM advocates
  WHERE id = advocate_id;
  
  RETURN advocate_company_id = get_user_company_id();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can access specific opportunity
CREATE OR REPLACE FUNCTION can_access_opportunity(opportunity_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  opportunity_company_id UUID;
  opportunity_sales_rep_id UUID;
  current_user_role TEXT;
BEGIN
  SELECT o.company_id, o.sales_rep_id INTO opportunity_company_id, opportunity_sales_rep_id
  FROM opportunities o
  WHERE o.id = opportunity_id;
  
  SELECT role INTO current_user_role
  FROM users
  WHERE id = auth.uid();
  
  -- Check if user is in the same company
  IF opportunity_company_id != get_user_company_id() THEN
    RETURN false;
  END IF;
  
  -- Admins can access all opportunities in their company
  IF current_user_role = 'admin' THEN
    RETURN true;
  END IF;
  
  -- Sales reps can access their own opportunities
  IF current_user_role = 'sales_rep' AND opportunity_sales_rep_id = auth.uid() THEN
    RETURN true;
  END IF;
  
  -- Advocates can view opportunities they're involved in
  IF current_user_role = 'advocate' THEN
    RETURN EXISTS (
      SELECT 1 FROM reference_calls rc
      JOIN advocates a ON a.id = rc.advocate_id
      WHERE rc.opportunity_id = opportunity_id
      AND a.user_id = auth.uid()
    );
  END IF;
  
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant usage on helper functions to authenticated users
GRANT EXECUTE ON FUNCTION get_user_company_id() TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin_user() TO authenticated;
GRANT EXECUTE ON FUNCTION is_sales_rep() TO authenticated;
GRANT EXECUTE ON FUNCTION validate_company_access(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION can_access_advocate(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION can_access_opportunity(UUID) TO authenticated;

-- Grant appropriate table permissions
GRANT SELECT ON companies TO authenticated;
GRANT SELECT, UPDATE ON users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON advocates TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON opportunities TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON reference_calls TO authenticated;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON FUNCTION get_user_company_id() IS 'Returns the company_id for the currently authenticated user';
COMMENT ON FUNCTION is_admin_user() IS 'Returns true if the current user has admin role';
COMMENT ON FUNCTION is_sales_rep() IS 'Returns true if the current user has sales_rep role';
COMMENT ON FUNCTION validate_company_access(UUID) IS 'Validates if user can access data for the specified company';
COMMENT ON FUNCTION can_access_advocate(UUID) IS 'Checks if user can access the specified advocate';
COMMENT ON FUNCTION can_access_opportunity(UUID) IS 'Checks if user can access the specified opportunity';

-- Add table comments for RLS documentation
COMMENT ON TABLE companies IS 'Multi-tenant companies with RLS enabled - users can only see their own company';
COMMENT ON TABLE users IS 'Application users with RLS enabled - users can see other users in their company';
COMMENT ON TABLE advocates IS 'Customer advocates with RLS enabled - users can see advocates in their company';
COMMENT ON TABLE opportunities IS 'Sales opportunities with RLS enabled - users can see opportunities in their company';
COMMENT ON TABLE reference_calls IS 'Reference calls with RLS enabled - users can see calls for their company opportunities';


-- Migration 6: 20240101000006_create_magic_links_table.sql
-- Create magic_links table for prospect booking magic links
CREATE TABLE IF NOT EXISTS public.magic_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text NOT NULL UNIQUE,
  opportunity_id uuid NOT NULL,
  advocate_id uuid NOT NULL,
  prospect_email text,
  metadata jsonb DEFAULT '{}'::jsonb,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for quick token lookup
CREATE INDEX IF NOT EXISTS magic_links_token_idx ON public.magic_links (token);
CREATE INDEX IF NOT EXISTS magic_links_expires_idx ON public.magic_links (expires_at);

-- Enable RLS and add basic policies
ALTER TABLE public.magic_links ENABLE ROW LEVEL SECURITY;

-- Only allow service role to insert/update/delete (application server-side)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'magic_links' AND policyname = 'service_role_write_magic_links'
  ) THEN
    CREATE POLICY service_role_write_magic_links ON public.magic_links
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Allow service role to select rows for validation
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'magic_links' AND policyname = 'service_role_read_magic_links'
  ) THEN
    CREATE POLICY service_role_read_magic_links ON public.magic_links
      FOR SELECT
      TO service_role
      USING (true);
  END IF;
END $$;

-- Optional: prevent selecting expired tokens for non-service roles (keep locked down for now)



