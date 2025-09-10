/**
 * Supabase Configuration Tests
 *
 * These tests verify that Supabase is properly configured.
 * Note: These tests will fail until actual Supabase credentials are provided.
 */

describe('Supabase Configuration', () => {
  // Mock environment variables for testing
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SUPABASE_URL: 'https://test-project.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
      SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should create supabase client with valid environment variables', async () => {
    const { supabase } = await import('../src/lib/supabase');
    expect(supabase).toBeDefined();
    expect(supabase.supabaseUrl).toBe('https://test-project.supabase.co');
    expect(supabase.supabaseKey).toBe('test-anon-key');
  });

  it('should create service supabase client', async () => {
    const { getServiceSupabase } = await import('../src/lib/supabase');
    const serviceClient = getServiceSupabase();
    expect(serviceClient).toBeDefined();
    expect(serviceClient.supabaseUrl).toBe('https://test-project.supabase.co');
    expect(serviceClient.supabaseKey).toBe('test-service-role-key');
  });

  it('should throw error when missing environment variables', async () => {
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SUPABASE_URL: undefined,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: undefined,
    };

    await expect(async () => {
      await import('../src/lib/supabase');
    }).rejects.toThrow('Missing Supabase environment variables');
  });

  it('should throw error when missing service role key', async () => {
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SUPABASE_URL: 'https://test-project.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
      SUPABASE_SERVICE_ROLE_KEY: undefined,
    };

    const { getServiceSupabase } = await import('../src/lib/supabase');

    expect(() => {
      getServiceSupabase();
    }).toThrow('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  });
});
