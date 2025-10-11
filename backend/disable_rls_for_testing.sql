-- Temporarily disable RLS for testing (Run this in Supabase SQL Editor)

-- OPTION 1: Disable RLS entirely (for development/testing only)
ALTER TABLE analysis_history DISABLE ROW LEVEL SECURITY;

-- OPTION 2: OR create a policy that allows all operations (for development/testing only)
/*
-- Keep RLS enabled but allow all operations for testing
ALTER TABLE analysis_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own analyses" ON analysis_history;
DROP POLICY IF EXISTS "Users can insert own analyses" ON analysis_history;
DROP POLICY IF EXISTS "Users can update own analyses" ON analysis_history;
DROP POLICY IF EXISTS "Users can delete own analyses" ON analysis_history;

-- Create permissive policies for testing
CREATE POLICY "Allow all select" ON analysis_history FOR SELECT USING (true);
CREATE POLICY "Allow all insert" ON analysis_history FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update" ON analysis_history FOR UPDATE USING (true);
CREATE POLICY "Allow all delete" ON analysis_history FOR DELETE USING (true);
*/

-- To re-enable proper RLS later, run:
/*
ALTER TABLE analysis_history ENABLE ROW LEVEL SECURITY;

-- And recreate the original policies from setup_supabase_schema.py
*/