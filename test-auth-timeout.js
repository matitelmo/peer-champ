const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuthTimeout() {
  console.log('🚀 Testing auth getSession with timeout...');
  
  try {
    // Test with timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout after 5 seconds')), 5000)
    );
    
    const sessionPromise = supabase.auth.getSession();
    
    const result = await Promise.race([sessionPromise, timeoutPromise]);
    console.log('✅ Session check completed:', result);
    
  } catch (error) {
    console.log('❌ Error or timeout:', error.message);
  }
}

testAuthTimeout();
