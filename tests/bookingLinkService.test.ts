import { jest } from '@jest/globals';
import { supabase } from '@/lib/supabase';
import {
  generateUniqueToken,
  storeMagicLinkToken,
  getMagicLinkData,
  isExpired,
  generateMagicLink,
  validateMagicLink,
} from '@/lib/services/bookingLinkService';

beforeAll(() => {
  const insertMock = jest.fn().mockResolvedValue({ error: null });
  const updateMock = jest.fn().mockResolvedValue({ error: null });
  const singleMock = jest.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } });
  const eqMock = jest.fn().mockReturnThis();
  const selectMock = jest.fn().mockReturnValue({ eq: eqMock, single: singleMock });
  const fromMock = jest.fn().mockReturnValue({ insert: insertMock, update: updateMock, select: selectMock, eq: eqMock, single: singleMock });
  // @ts-ignore override supabase client method for unit tests
  supabase.from = fromMock as any;
  // @ts-ignore expose mocks for assertions
  (supabase as any).__mocks = { fromMock };
});

describe('bookingLinkService', () => {
  it('generateUniqueToken returns hex string of length 32', () => {
    const t = generateUniqueToken();
    expect(typeof t).toBe('string');
    expect(t).toMatch(/^[0-9a-f]{32}$/);
  });

  it('storeMagicLinkToken inserts row', async () => {
    await expect(
      storeMagicLinkToken('tok', { opportunityId: 'opp', advocateId: 'adv' }, 1)
    ).resolves.toBeUndefined();
    // @ts-ignore
    const { fromMock } = (supabase as any).__mocks;
    expect(fromMock).toHaveBeenCalledWith('magic_links');
  });

  it('getMagicLinkData returns null when not found', async () => {
    const row = await getMagicLinkData('missing');
    expect(row).toBeNull();
  });

  it('isExpired detects past time', () => {
    const past = new Date(Date.now() - 1000).toISOString();
    expect(isExpired(past)).toBe(true);
  });

  it('generateMagicLink creates URL with token', async () => {
    const url = await generateMagicLink('opp', 'adv');
    expect(url).toMatch(/\/booking\//);
  });

  it('validateMagicLink throws on invalid', async () => {
    await expect(validateMagicLink('missing')).rejects.toThrow('Invalid');
  });
});


