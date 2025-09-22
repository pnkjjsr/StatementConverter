-- supabase/migrations/0002_anonymous_usage.sql

CREATE TABLE IF NOT EXISTS public.sc_anonymous_usage (
    ip_hash TEXT PRIMARY KEY,
    last_conversion_at TIMESTAMPTZ NOT NULL
);

ALTER TABLE public.sc_anonymous_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
ON public.sc_anonymous_usage
FOR SELECT
USING (true);

CREATE POLICY "Allow individual insert"
ON public.sc_anonymous_usage
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow individual update"
ON public.sc_anonymous_usage
FOR UPDATE
USING (true);
