/*
  # Add Subtopics Table

  1. New Tables
    - `subtopics`
      - `id` (uuid, primary key)
      - `topic_id` (uuid, foreign key to topics)
      - `name` (text, not null)
      - `description` (text)
      - `display_order` (integer, not null)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `subtopics` table
    - Add policy for all users to read subtopics

  3. Changes
    - Creates a subtopics table to store sub-topics for each main topic
    - Each subtopic belongs to a parent topic via topic_id
    - Display order controls the order of subtopics in the UI
*/

CREATE TABLE IF NOT EXISTS subtopics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subtopics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view subtopics"
  ON subtopics
  FOR SELECT
  TO public
  USING (true);

CREATE INDEX IF NOT EXISTS idx_subtopics_topic_id ON subtopics(topic_id);
CREATE INDEX IF NOT EXISTS idx_subtopics_display_order ON subtopics(display_order);
