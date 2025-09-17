const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Testing connection to:', supabaseUrl);
console.log('Service key exists:', !!supabaseServiceKey);

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  try {
    // Try a simple query to test connection
    const { data, error } = await supabase
      .from('companies')
      .select('id')
      .limit(1);

    if (error) {
      console.log('Error (expected if table doesn\'t exist):', error.message);
      
      // Try to create a simple table to test permissions
      const { data: createData, error: createError } = await supabase.rpc('exec', {
        sql: 'SELECT 1 as test;'
      });
      
      if (createError) {
        console.log('RPC error:', createError.message);
      } else {
        console.log('RPC success:', createData);
      }
    } else {
      console.log('Connection successful, data:', data);
    }
  } catch (err) {
    console.log('Connection error:', err.message);
  }
}

testConnection();
