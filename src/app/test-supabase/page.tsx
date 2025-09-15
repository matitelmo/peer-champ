'use client';

import React, { useState, useEffect } from 'react';
import { supabase, testConnection } from '@/lib/supabase';

export default function TestSupabasePage() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing...');
  const [envStatus, setEnvStatus] = useState<string>('Checking...');

  useEffect(() => {
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      setEnvStatus('❌ Missing environment variables');
      setConnectionStatus('❌ Cannot test connection - missing env vars');
      return;
    }
    
    setEnvStatus('✅ Environment variables found');
    
    // Test database connection
    testConnection().then((result) => {
      if (result.success) {
        setConnectionStatus('✅ Database connection successful');
      } else {
        setConnectionStatus(`❌ Database connection failed: ${result.error}`);
      }
    });
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Supabase Connection Test</h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Environment Variables</h2>
            <p className="text-gray-700">{envStatus}</p>
            <div className="mt-2 text-sm text-gray-500">
              <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
              <p>Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
            </div>
          </div>
          
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Database Connection</h2>
            <p className="text-gray-700">{connectionStatus}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
