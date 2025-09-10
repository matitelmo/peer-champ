import { supabase } from '@/lib/supabase';

export interface MagicLinkData {
  opportunityId: string;
  advocateId: string;
  prospectEmail?: string;
}

const DEFAULT_TTL_HOURS = 72;

export const generateUniqueToken = (): string => {
  const array = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < array.length; i += 1) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

const getExpiry = (ttlHours: number = DEFAULT_TTL_HOURS): string => {
  const d = new Date();
  d.setHours(d.getHours() + ttlHours);
  return d.toISOString();
};

export const storeMagicLinkToken = async (
  token: string,
  data: MagicLinkData,
  ttlHours: number = DEFAULT_TTL_HOURS
): Promise<void> => {
  const { error } = await supabase.from('magic_links').insert({
    token,
    opportunity_id: data.opportunityId,
    advocate_id: data.advocateId,
    prospect_email: data.prospectEmail ?? null,
    expires_at: getExpiry(ttlHours),
    metadata: {},
  });
  if (error) throw new Error(error.message);
};

export const getMagicLinkData = async (
  token: string
): Promise<{ opportunity_id: string; advocate_id: string; expires_at: string; used_at: string | null } | null> => {
  const { data, error } = await supabase
    .from('magic_links')
    .select('opportunity_id, advocate_id, expires_at, used_at')
    .eq('token', token)
    .single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }
  return data;
};

export const isExpired = (iso: string): boolean => new Date(iso).getTime() < Date.now();

export const markUsed = async (token: string): Promise<void> => {
  const { error } = await supabase
    .from('magic_links')
    .update({ used_at: new Date().toISOString() })
    .eq('token', token);
  if (error) throw new Error(error.message);
};

export const generateMagicLink = async (
  opportunityId: string,
  advocateId: string,
  prospectEmail?: string
): Promise<string> => {
  const token = generateUniqueToken();
  await storeMagicLinkToken(token, { opportunityId, advocateId, prospectEmail });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/booking/${token}`;
};

export const validateMagicLink = async (token: string): Promise<MagicLinkData> => {
  const row = await getMagicLinkData(token);
  if (!row) throw new Error('Invalid booking link');
  if (row.used_at) throw new Error('Booking link already used');
  if (isExpired(row.expires_at)) throw new Error('Booking link expired');
  return { opportunityId: row.opportunity_id, advocateId: row.advocate_id };
};


