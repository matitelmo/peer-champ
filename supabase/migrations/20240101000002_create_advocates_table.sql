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
