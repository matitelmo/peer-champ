import { config } from '../src/lib/config';

describe('Configuration', () => {
  it('should have default values for basic configuration', () => {
    expect(config.appUrl).toBe('http://localhost:3000');
    expect(config.appName).toBe('PeerChamps');
    expect(config.environment).toBe('test');
    expect(config.isTest).toBe(true);
    expect(config.isProduction).toBe(false);
    expect(config.isDevelopment).toBe(false);
  });

  it('should have all required configuration sections', () => {
    expect(config).toHaveProperty('supabase');
    expect(config).toHaveProperty('auth');
    expect(config).toHaveProperty('openai');
    expect(config).toHaveProperty('google');
    expect(config).toHaveProperty('microsoft');
    expect(config).toHaveProperty('salesforce');
    expect(config).toHaveProperty('hubspot');
    expect(config).toHaveProperty('sendgrid');
    expect(config).toHaveProperty('aws');
  });

  it('should have proper structure for supabase configuration', () => {
    expect(config.supabase).toHaveProperty('url');
    expect(config.supabase).toHaveProperty('anonKey');
    expect(config.supabase).toHaveProperty('serviceRoleKey');
  });

  it('should have proper structure for auth configuration', () => {
    expect(config.auth).toHaveProperty('url');
    expect(config.auth).toHaveProperty('secret');
  });
});
