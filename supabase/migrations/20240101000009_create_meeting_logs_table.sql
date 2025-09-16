-- Create meeting_logs table for audit trail
CREATE TABLE IF NOT EXISTS meeting_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id TEXT NOT NULL,
  platform TEXT NOT NULL,
  action TEXT NOT NULL, -- 'created', 'updated', 'cancelled', 'rescheduled'
  reference_call_id UUID REFERENCES reference_calls(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  details JSONB DEFAULT '{}', -- Store additional context about the action
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes for performance
  INDEX idx_meeting_logs_meeting_id ON meeting_logs(meeting_id),
  INDEX idx_meeting_logs_timestamp ON meeting_logs(timestamp),
  INDEX idx_meeting_logs_reference_call_id ON meeting_logs(reference_call_id)
);

-- Enable RLS for meeting_logs
ALTER TABLE meeting_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view logs for their own meetings
CREATE POLICY "Users can view own meeting logs" ON meeting_logs
  FOR SELECT
  USING (
    user_id = auth.uid() OR
    reference_call_id IN (
      SELECT id FROM reference_calls 
      WHERE advocate_id = auth.uid() OR sales_rep_id = auth.uid()
    )
  );

-- Policy: System can insert logs (no user restriction for audit purposes)
CREATE POLICY "System can insert meeting logs" ON meeting_logs
  FOR INSERT
  WITH CHECK (true);

-- Policy: No updates or deletes allowed (audit trail integrity)
CREATE POLICY "No meeting log modifications" ON meeting_logs
  FOR UPDATE
  USING (false);

CREATE POLICY "No meeting log deletions" ON meeting_logs
  FOR DELETE
  USING (false);
