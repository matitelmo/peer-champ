const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Anon Key exists:', !!supabaseAnonKey);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('🚀 Testing getSession...');
    
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log('❌ Error getting session:', error.message);
    } else {
      console.log('✅ Session check successful');
      console.log('Session exists:', !!data.session);
      if (data.session) {
        console.log('User email:', data.session.user.email);
      }
    }

    // Test a simple query
    console.log('🚀 Testing database query...');
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('id, email')
      .limit(1);
    
    if (testError) {
      console.log('❌ Database query error:', testError.message);
    } else {
      console.log('✅ Database query successful');
      console.log('Users found:', testData.length);
    }

  } catch (err) {
    console.log('❌ Unexpected error:', err.message);
  }
}

testConnection();
