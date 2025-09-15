-- Migration: Create case_studies table
-- This migration creates the case_studies table for storing advocate case studies and documents

-- Case Studies table
-- Stores case studies, success stories, and documents associated with advocates
CREATE TABLE IF NOT EXISTS case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advocate_id UUID NOT NULL REFERENCES advocates(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Case study information
  title TEXT NOT NULL,
  description TEXT,
  content TEXT, -- Main case study content
  
  -- File information
  file_name TEXT,
  file_url TEXT, -- URL to the uploaded file in Supabase Storage
  file_size INTEGER, -- File size in bytes
  file_type TEXT, -- MIME type (e.g., 'application/pdf', 'image/jpeg')
  
  -- Categorization
  category TEXT DEFAULT 'success_story' CHECK (category IN ('success_story', 'case_study', 'testimonial', 'documentation', 'presentation')),
  tags TEXT[], -- Array of tags for categorization
  
  -- Metadata
  is_public BOOLEAN DEFAULT false, -- Whether this case study can be shared publicly
  is_featured BOOLEAN DEFAULT false, -- Whether this is a featured case study
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  
  -- Usage tracking
  view_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_case_studies_advocate_id ON case_studies(advocate_id);
CREATE INDEX IF NOT EXISTS idx_case_studies_company_id ON case_studies(company_id);
CREATE INDEX IF NOT EXISTS idx_case_studies_category ON case_studies(category);
CREATE INDEX IF NOT EXISTS idx_case_studies_approval_status ON case_studies(approval_status);
CREATE INDEX IF NOT EXISTS idx_case_studies_is_public ON case_studies(is_public);
CREATE INDEX IF NOT EXISTS idx_case_studies_is_featured ON case_studies(is_featured);
CREATE INDEX IF NOT EXISTS idx_case_studies_created_at ON case_studies(created_at);

-- Create GIN index for tags array
CREATE INDEX IF NOT EXISTS idx_case_studies_tags ON case_studies USING GIN(tags);

-- Create composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_case_studies_advocate_public ON case_studies(advocate_id, is_public);
CREATE INDEX IF NOT EXISTS idx_case_studies_company_approved ON case_studies(company_id, approval_status);
CREATE INDEX IF NOT EXISTS idx_case_studies_featured_public ON case_studies(is_featured, is_public);

-- Create trigger for automatic updated_at timestamp
CREATE TRIGGER update_case_studies_updated_at 
  BEFORE UPDATE ON case_studies 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE case_studies IS 'Case studies, success stories, and documents associated with advocates';
COMMENT ON COLUMN case_studies.file_url IS 'URL to the uploaded file in Supabase Storage';
COMMENT ON COLUMN case_studies.category IS 'Type of case study or document';
COMMENT ON COLUMN case_studies.is_public IS 'Whether this case study can be shared publicly';
COMMENT ON COLUMN case_studies.approval_status IS 'Approval status for case study publication';
