-- Create magic_links table for prospect booking magic links
CREATE TABLE IF NOT EXISTS public.magic_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text NOT NULL UNIQUE,
  opportunity_id uuid NOT NULL,
  advocate_id uuid NOT NULL,
  prospect_email text,
  metadata jsonb DEFAULT '{}'::jsonb,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for quick token lookup
CREATE INDEX IF NOT EXISTS magic_links_token_idx ON public.magic_links (token);
CREATE INDEX IF NOT EXISTS magic_links_expires_idx ON public.magic_links (expires_at);

-- Enable RLS and add basic policies
ALTER TABLE public.magic_links ENABLE ROW LEVEL SECURITY;

-- Only allow service role to insert/update/delete (application server-side)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'magic_links' AND policyname = 'service_role_write_magic_links'
  ) THEN
    CREATE POLICY service_role_write_magic_links ON public.magic_links
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Allow service role to select rows for validation
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'magic_links' AND policyname = 'service_role_read_magic_links'
  ) THEN
    CREATE POLICY service_role_read_magic_links ON public.magic_links
      FOR SELECT
      TO service_role
      USING (true);
  END IF;
END $$;

-- Optional: prevent selecting expired tokens for non-service roles (keep locked down for now)

