/*
  # Fix existing policies error

  This migration safely handles existing policies by dropping them first if they exist,
  then recreating them. This resolves the "policy already exists" error.

  1. Drop existing policies if they exist
  2. Recreate all policies with proper permissions
  3. Ensure all indexes and triggers are properly set up
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read all events" ON events;
DROP POLICY IF EXISTS "Users can insert events" ON events;
DROP POLICY IF EXISTS "Users can update events" ON events;
DROP POLICY IF EXISTS "Users can delete events" ON events;

-- Create the events table if it doesn't exist
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  date date NOT NULL,
  category text NOT NULL CHECK (category IN ('wellness', 'technical', 'team-building', 'sports', 'celebration', 'training', 'meeting')),
  time text,
  location text,
  organizer text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can read all events"
  ON events
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete events"
  ON events
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop and recreate the trigger to avoid conflicts
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();