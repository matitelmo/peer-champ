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
