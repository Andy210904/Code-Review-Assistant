"""
SQL script to create the analysis_history table in Supabase

Run this SQL in your Supabase SQL editor to create the required table:
"""

CREATE_TABLE_SQL = """
-- Create the analysis_history table
CREATE TABLE IF NOT EXISTS analysis_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    filename TEXT NOT NULL,
    file_type TEXT NOT NULL CHECK (file_type IN ('single', 'multiple')),
    summary TEXT NOT NULL,
    results JSONB NOT NULL,
    quality_score INTEGER DEFAULT 0,
    security_score INTEGER DEFAULT 0,
    performance_score INTEGER DEFAULT 0,
    issues JSONB DEFAULT '[]'::jsonb,
    file_count INTEGER DEFAULT 1,
    file_names JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_analysis_history_user_id ON analysis_history(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_history_created_at ON analysis_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analysis_history_file_type ON analysis_history(file_type);

-- Add Row Level Security (RLS) policies
ALTER TABLE analysis_history ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own analyses
CREATE POLICY "Users can view own analyses" ON analysis_history
    FOR SELECT USING (auth.uid()::text = user_id);

-- Policy: Users can only insert their own analyses
CREATE POLICY "Users can insert own analyses" ON analysis_history
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Policy: Users can only update their own analyses
CREATE POLICY "Users can update own analyses" ON analysis_history
    FOR UPDATE USING (auth.uid()::text = user_id);

-- Policy: Users can only delete their own analyses
CREATE POLICY "Users can delete own analyses" ON analysis_history
    FOR DELETE USING (auth.uid()::text = user_id);
"""

if __name__ == "__main__":
    print("Copy and run the following SQL in your Supabase SQL editor:")
    print("=" * 60)
    print(CREATE_TABLE_SQL)
    print("=" * 60)
    print("\nAfter running this SQL, make sure to:")
    print("1. Set your SUPABASE_URL environment variable")
    print("2. Set your SUPABASE_KEY environment variable (anon/public key)")
    print("3. Optionally set SUPABASE_SERVICE_KEY for admin operations")