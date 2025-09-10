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
