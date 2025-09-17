import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { z } from 'zod';

const updateProfileSchema = z.object({
  id: z.string().uuid('Invalid user ID'),
  email: z.string().email('Invalid email address'),
  company_id: z.string().uuid().optional(),
});

export async function POST(req: NextRequest) {
  const supabase = getServiceSupabase();

  try {
    const body = await req.json();
    const validatedData = updateProfileSchema.parse(body);

        const { id, email, company_id } = validatedData;

    // Create or update user profile in our database
        // Fetch auth user metadata to enrich profile (role, names)
        let authUserMeta: any = {};
        try {
          const { data: authUser } = await supabase.auth.admin.getUserById(id);
          authUserMeta = authUser?.user?.user_metadata || {};
        } catch (_) {}

        const payload: Record<string, any> = {
          id,
          email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          role: authUserMeta.role || 'sales_rep',
          first_name: authUserMeta.first_name || null,
          last_name: authUserMeta.last_name || null,
          is_active: true,
        };

        if (company_id) {
          payload.company_id = company_id;
        } else {
          // Try to infer company_id from email domain if not provided
          try {
            const domain = email.split('@')[1]?.toLowerCase();
            if (domain) {
              const exact = await supabase
                .from('companies')
                .select('id,domain')
                .eq('domain', domain)
                .maybeSingle();

              if (exact.data?.id) {
                payload.company_id = exact.data.id;
              } else {
                const like = await supabase
                  .from('companies')
                  .select('id,domain')
                  .ilike('domain', `%${domain}%`)
                  .limit(1)
                  .single();
                if (like.data?.id) {
                  payload.company_id = like.data.id;
                }
              }
            }
          } catch (_) {}
          // If still missing, create a lightweight company and use its id
          if (!payload.company_id) {
            try {
              const domain = email.split('@')[1]?.toLowerCase() || 'example.com';
              const name = email.split('@')[0] || 'User';
              const { data: newCo, error: coErr } = await supabase
                .from('companies')
                .insert({
                  name: `${name}'s Company`,
                  domain,
                  subscription_tier: 'starter',
                  settings: { timezone: 'UTC', currency: 'USD' },
                })
                .select('id')
                .single();
              if (!coErr && newCo?.id) {
                payload.company_id = newCo.id;
              }
            } catch (_) {}
          }
        }

        const { error } = await supabase
          .from('users')
          .upsert(payload, { onConflict: 'id' });

        if (error) {
          console.error('Error creating/updating user profile:', error);
          return NextResponse.json({ error: 'Failed to update user profile', details: error.message }, { status: 500 });
        }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Unexpected error updating user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
