# Run from repo: python supabase/build_run_sql.py
from pathlib import Path

ROOT = Path(__file__).resolve().parent
hdr = """/* =============================================================================
   Srikanth Physics - paste ENTIRE file into Supabase SQL Editor and Run
   Re-runnable: pre-drops policies if their tables exist (fixes ERROR 42710 duplicate policy)
   Skips: 20251103194903 (sample questions use old topic UUIDs)
============================================================================= */

DO $policypre$
BEGIN
  IF to_regclass('public.user_profiles') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
    DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
  END IF;
  IF to_regclass('public.topic_mastery') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Users can view own topic mastery" ON topic_mastery;
    DROP POLICY IF EXISTS "Users can insert own topic mastery" ON topic_mastery;
    DROP POLICY IF EXISTS "Users can update own topic mastery" ON topic_mastery;
  END IF;
  IF to_regclass('public.quiz_sessions') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Users can view own quiz sessions" ON quiz_sessions;
    DROP POLICY IF EXISTS "Users can insert own quiz sessions" ON quiz_sessions;
    DROP POLICY IF EXISTS "Users can update own quiz sessions" ON quiz_sessions;
  END IF;
  IF to_regclass('public.quiz_answers') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Users can view own quiz answers" ON quiz_answers;
    DROP POLICY IF EXISTS "Users can insert own quiz answers" ON quiz_answers;
  END IF;
  IF to_regclass('public.badges') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Users can view own badges" ON badges;
    DROP POLICY IF EXISTS "Users can insert own badges" ON badges;
  END IF;
  IF to_regclass('public.schedule_items') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Users can view own schedule" ON schedule_items;
    DROP POLICY IF EXISTS "Users can insert own schedule" ON schedule_items;
    DROP POLICY IF EXISTS "Users can update own schedule" ON schedule_items;
    DROP POLICY IF EXISTS "Users can delete own schedule" ON schedule_items;
  END IF;
  IF to_regclass('public.topics') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Anyone can view topics" ON topics;
  END IF;
  IF to_regclass('public.topic_progress') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Users can view own progress" ON topic_progress;
    DROP POLICY IF EXISTS "Users can insert own progress" ON topic_progress;
    DROP POLICY IF EXISTS "Users can update own progress" ON topic_progress;
  END IF;
  IF to_regclass('public.questions') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Authenticated users can view questions" ON questions;
  END IF;
  IF to_regclass('public.homework') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Authenticated users can view homework" ON homework;
    DROP POLICY IF EXISTS "Authenticated users can insert homework" ON homework;
  END IF;
  IF to_regclass('public.user_answers') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Users can view own answers" ON user_answers;
    DROP POLICY IF EXISTS "Users can insert own answers" ON user_answers;
  END IF;
  IF to_regclass('public.subtopics') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Anyone can view subtopics" ON subtopics;
  END IF;
END $policypre$;

"""
files = [
    "migrations/20251017065909_create_ap_physics_schema.sql",
    "migrations/20251022125040_create_topic_learning_system.sql",
    "migrations/20251028104042_add_phone_number_fields.sql",
    "migrations/20251028122259_remove_exam_date_and_study_time.sql",
    "migrations/20251101091516_add_difficulty_levels_system.sql",
    "migrations/20251103181538_add_subtopics_table.sql",
    "migrations/20251103182129_populate_ap_physics_subtopics.sql",
]
extra = """
/* Circular Motion & Gravitation subtopics (no hardcoded topic UUID) */
DO $$
DECLARE
  grav_id uuid;
BEGIN
  SELECT id INTO grav_id FROM topics
    WHERE name ILIKE '%Circular Motion%Gravitation%'
       OR name ILIKE '%Gravitation%'
    ORDER BY display_order
    LIMIT 1;
  IF grav_id IS NOT NULL THEN
    INSERT INTO subtopics (topic_id, name, description, display_order)
    SELECT grav_id, v.name, v.description, v.ord
    FROM (VALUES
      ('Uniform Circular Motion'::text, 'Motion in a circle at constant speed'::text, 1),
      ('Centripetal Force and Acceleration', 'Forces causing circular motion', 2),
      ('Universal Gravitation', 'Newton''s Law of Universal Gravitation', 3),
      ('Orbital Motion', 'Planets, moons, and orbital mechanics', 4),
      ('Gravitational Potential Energy', 'Energy in gravitational fields', 5),
      ('Satellites and Kepler''s Laws', 'Satellite motion and Kepler''s three laws', 6)
    ) AS v(name, description, ord)
    WHERE NOT EXISTS (
      SELECT 1 FROM subtopics s WHERE s.topic_id = grav_id AND s.name = v.name
    );
  END IF;
END $$;

/* Subscription columns (auth / profile) */
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'free';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS subscription_expires_at timestamptz;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS payment_date timestamptz;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS payment_amount numeric(10,2);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS payment_method text;
"""
out_path = ROOT / "RUN_IN_SUPABASE.sql"
parts = [hdr]
for rel in files:
    parts.append((ROOT / rel).read_text(encoding="utf-8").rstrip() + "\n\n")
parts.append(extra)
out_path.write_text("".join(parts), encoding="utf-8")
print(f"Wrote {out_path}")
