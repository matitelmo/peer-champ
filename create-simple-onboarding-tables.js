const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createOnboardingTables() {
  try {
    console.log('🚀 Creating onboarding tables...');
    
    // Create onboarding_progress table
    const onboardingProgressSQL = `
      CREATE TABLE IF NOT EXISTS onboarding_progress (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
        current_step TEXT NOT NULL DEFAULT 'welcome',
        progress_data JSONB DEFAULT '{}',
        is_completed BOOLEAN DEFAULT FALSE,
        completed_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(company_id)
      );
    `;
    
    // Create invitations table
    const invitationsSQL = `
      CREATE TABLE IF NOT EXISTS invitations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
        invited_by UUID REFERENCES users(id) ON DELETE SET NULL,
        email TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('sales_rep', 'advocate', 'admin')),
        token TEXT UNIQUE NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'accepted', 'expired', 'cancelled')),
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        message TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(company_id, email)
      );
    `;
    
    // Try to create tables using direct SQL execution
    console.log('Creating onboarding_progress table...');
    const { error: progressError } = await supabase
      .from('onboarding_progress')
      .select('id')
      .limit(1);
    
    if (progressError && progressError.message.includes('Could not find the table')) {
      console.log('Table does not exist, need to create it via Supabase dashboard');
      console.log('Please run this SQL in your Supabase SQL editor:');
      console.log('\n' + onboardingProgressSQL);
    } else {
      console.log('✅ onboarding_progress table already exists');
    }
    
    console.log('Creating invitations table...');
    const { error: invitationsError } = await supabase
      .from('invitations')
      .select('id')
      .limit(1);
    
    if (invitationsError && invitationsError.message.includes('Could not find the table')) {
      console.log('Table does not exist, need to create it via Supabase dashboard');
      console.log('Please run this SQL in your Supabase SQL editor:');
      console.log('\n' + invitationsSQL);
    } else {
      console.log('✅ invitations table already exists');
    }
    
  } catch (err) {
    console.log('Error:', err.message);
  }
}

createOnboardingTables();
