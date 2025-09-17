-- Migration: Create onboarding-related tables
-- This migration creates tables for managing the customer onboarding flow

-- Company onboarding progress tracking
CREATE TABLE IF NOT EXISTS company_onboarding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Onboarding steps completion tracking
  steps_completed JSONB DEFAULT '{
    "welcome": false,
    "company_setup": false,
    "admin_account": false,
    "team_invitations": false,
    "initial_config": false,
    "advocate_setup": false,
    "crm_integration": false,
    "success_metrics": false,
    "welcome_tour": false,
    "completion": false
  }',
  
  -- Current step and progress
  current_step TEXT DEFAULT 'welcome',
  progress_percentage INTEGER DEFAULT 0,
  
  -- Onboarding metadata
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Configuration data collected during onboarding
  onboarding_data JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one onboarding record per company
  UNIQUE(company_id)
);

-- Team invitations table
CREATE TABLE IF NOT EXISTS team_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Invitation details
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('sales_rep', 'advocate', 'admin')),
  invited_by UUID REFERENCES users(id),
  
  -- Invitation status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'accepted', 'expired', 'cancelled')),
  
  -- Invitation metadata
  invitation_token TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  personal_message TEXT,
  
  -- Timestamps
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  accepted_at TIMESTAMP WITH TIME ZONE,
  
  -- Ensure unique invitations per company/email combination
  UNIQUE(company_id, email)
);

-- Company configurations table
CREATE TABLE IF NOT EXISTS company_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Integration settings
  crm_integrations JSONB DEFAULT '{}',
  calendar_integrations JSONB DEFAULT '{}',
  email_integrations JSONB DEFAULT '{}',
  
  -- Business settings
  business_settings JSONB DEFAULT '{
    "industry": null,
    "company_size": null,
    "timezone": "UTC",
    "currency": "USD",
    "fiscal_year_start": "01-01"
  }',
  
  -- Feature flags and preferences
  feature_flags JSONB DEFAULT '{}',
  notification_settings JSONB DEFAULT '{
    "email_notifications": true,
    "slack_notifications": false,
    "webhook_notifications": false
  }',
  
  -- Success metrics configuration
  success_metrics JSONB DEFAULT '{
    "track_reference_calls": true,
    "track_conversion_rates": true,
    "track_advocate_satisfaction": true,
    "reporting_frequency": "monthly"
  }',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one configuration per company
  UNIQUE(company_id)
);

-- Onboarding feedback table
CREATE TABLE IF NOT EXISTS onboarding_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  
  -- Feedback data
  step_name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  suggestions TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_company_onboarding_company_id ON company_onboarding(company_id);
CREATE INDEX IF NOT EXISTS idx_company_onboarding_current_step ON company_onboarding(current_step);
CREATE INDEX IF NOT EXISTS idx_company_onboarding_progress ON company_onboarding(progress_percentage);

CREATE INDEX IF NOT EXISTS idx_team_invitations_company_id ON team_invitations(company_id);
CREATE INDEX IF NOT EXISTS idx_team_invitations_email ON team_invitations(email);
CREATE INDEX IF NOT EXISTS idx_team_invitations_status ON team_invitations(status);
CREATE INDEX IF NOT EXISTS idx_team_invitations_token ON team_invitations(invitation_token);
CREATE INDEX IF NOT EXISTS idx_team_invitations_expires_at ON team_invitations(expires_at);

CREATE INDEX IF NOT EXISTS idx_company_configurations_company_id ON company_configurations(company_id);

CREATE INDEX IF NOT EXISTS idx_onboarding_feedback_company_id ON onboarding_feedback(company_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_feedback_step ON onboarding_feedback(step_name);

-- Create triggers to automatically update updated_at timestamps
CREATE TRIGGER update_company_onboarding_updated_at 
  BEFORE UPDATE ON company_onboarding 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_invitations_updated_at 
  BEFORE UPDATE ON team_invitations 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_configurations_updated_at 
  BEFORE UPDATE ON company_configurations 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on all tables
ALTER TABLE company_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies for company_onboarding
CREATE POLICY "company_members_can_view_onboarding" ON company_onboarding
  FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "company_admins_can_update_onboarding" ON company_onboarding
  FOR UPDATE
  USING (
    company_id IN (
      SELECT company_id FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "company_admins_can_insert_onboarding" ON company_onboarding
  FOR INSERT
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for team_invitations
CREATE POLICY "company_members_can_view_invitations" ON team_invitations
  FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "company_admins_can_manage_invitations" ON team_invitations
  FOR ALL
  USING (
    company_id IN (
      SELECT company_id FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for company_configurations
CREATE POLICY "company_members_can_view_configurations" ON company_configurations
  FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "company_admins_can_update_configurations" ON company_configurations
  FOR UPDATE
  USING (
    company_id IN (
      SELECT company_id FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "company_admins_can_insert_configurations" ON company_configurations
  FOR INSERT
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for onboarding_feedback
CREATE POLICY "company_members_can_view_feedback" ON onboarding_feedback
  FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "company_members_can_insert_feedback" ON onboarding_feedback
  FOR INSERT
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- Comments for documentation
COMMENT ON TABLE company_onboarding IS 'Tracks the progress of company onboarding through various steps';
COMMENT ON TABLE team_invitations IS 'Manages team member invitations during onboarding and beyond';
COMMENT ON TABLE company_configurations IS 'Stores company-specific configuration and integration settings';
COMMENT ON TABLE onboarding_feedback IS 'Collects feedback from users during the onboarding process';

COMMENT ON COLUMN company_onboarding.steps_completed IS 'JSON object tracking completion status of each onboarding step';
COMMENT ON COLUMN company_onboarding.current_step IS 'Current step in the onboarding process';
COMMENT ON COLUMN company_onboarding.progress_percentage IS 'Overall completion percentage (0-100)';
COMMENT ON COLUMN company_onboarding.onboarding_data IS 'Temporary data collected during onboarding steps';

COMMENT ON COLUMN team_invitations.invitation_token IS 'Unique token for invitation links';
COMMENT ON COLUMN team_invitations.personal_message IS 'Optional personal message from the inviter';

COMMENT ON COLUMN company_configurations.crm_integrations IS 'CRM integration settings (Salesforce, HubSpot, etc.)';
COMMENT ON COLUMN company_configurations.calendar_integrations IS 'Calendar integration settings (Google, Outlook, etc.)';
COMMENT ON COLUMN company_configurations.business_settings IS 'Company business settings and preferences';
COMMENT ON COLUMN company_configurations.success_metrics IS 'Configuration for tracking success metrics and KPIs';
