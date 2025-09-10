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
