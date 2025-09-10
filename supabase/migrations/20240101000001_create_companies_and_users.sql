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
