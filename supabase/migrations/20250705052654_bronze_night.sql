/*
  # Create events table for calendar application

  1. New Tables
    - `events`
      - `id` (uuid, primary key) - Unique identifier for each event
      - `title` (text, required) - Event title
      - `description` (text, required) - Event description  
      - `date` (date, required) - Event date
      - `category` (text, required) - Event category (wellness, technical, team-building, sports, celebration, training, meeting)
      - `time` (text, optional) - Event time
      - `location` (text, optional) - Event location
      - `organizer` (text, optional) - Event organizer
      - `created_at` (timestamp) - Record creation timestamp
      - `updated_at` (timestamp) - Record update timestamp

  2. Security
    - Enable RLS on `events` table
    - Add policy for authenticated users to read all events
    - Add policy for authenticated users to insert events
    - Add policy for authenticated users to update events
    - Add policy for authenticated users to delete events

  3. Constraints
    - Add check constraint for valid category values
*/

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

-- Create an index on the date column for better query performance
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);

-- Create an index on the category column for filtering
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();