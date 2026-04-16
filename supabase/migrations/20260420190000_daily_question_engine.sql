-- Multi-syllabus Daily Question Engine (prefix dqe_)
-- Orthogonal to legacy public.questions (AP topic_id); this catalog drives AI batch generation.

CREATE TABLE IF NOT EXISTS public.dqe_syllabus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('ap', 'iit_jee', 'cbse', 'neet', 'foundation')),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.dqe_subject (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  syllabus_id uuid NOT NULL REFERENCES public.dqe_syllabus(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (syllabus_id, slug)
);

CREATE TABLE IF NOT EXISTS public.dqe_topic (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid NOT NULL REFERENCES public.dqe_subject(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (subject_id, slug)
);

CREATE TABLE IF NOT EXISTS public.dqe_subtopic (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES public.dqe_topic(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (topic_id, slug)
);

CREATE TABLE IF NOT EXISTS public.dqe_question (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  syllabus_id uuid NOT NULL REFERENCES public.dqe_syllabus(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES public.dqe_subject(id) ON DELETE SET NULL,
  topic_id uuid REFERENCES public.dqe_topic(id) ON DELETE SET NULL,
  subtopic_id uuid REFERENCES public.dqe_subtopic(id) ON DELETE SET NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  question_text text NOT NULL,
  options jsonb NOT NULL,
  correct_answer text NOT NULL,
  explanation jsonb NOT NULL,
  concept_tag text,
  content_hash text NOT NULL,
  generated_for_date date,
  ai_provider text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (subtopic_id, content_hash, generated_for_date)
);

CREATE INDEX IF NOT EXISTS idx_dqe_question_syllabus_date ON public.dqe_question (syllabus_id, generated_for_date DESC);
CREATE INDEX IF NOT EXISTS idx_dqe_question_subtopic ON public.dqe_question (subtopic_id);

CREATE TABLE IF NOT EXISTS public.dqe_daily_schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  syllabus_id uuid NOT NULL REFERENCES public.dqe_syllabus(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES public.dqe_subject(id) ON DELETE SET NULL,
  topic_id uuid REFERENCES public.dqe_topic(id) ON DELETE SET NULL,
  subtopic_id uuid NOT NULL REFERENCES public.dqe_subtopic(id) ON DELETE CASCADE,
  for_date date NOT NULL,
  question_count integer NOT NULL DEFAULT 5 CHECK (question_count >= 1 AND question_count <= 20),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  UNIQUE (subtopic_id, for_date)
);

CREATE INDEX IF NOT EXISTS idx_dqe_schedule_date ON public.dqe_daily_schedule (for_date, status);

-- RLS: catalog readable by clients; writes intended via service role (Python engine) or future Edge Function
ALTER TABLE public.dqe_syllabus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dqe_subject ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dqe_topic ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dqe_subtopic ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dqe_question ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dqe_daily_schedule ENABLE ROW LEVEL SECURITY;

CREATE POLICY dqe_syllabus_select ON public.dqe_syllabus FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY dqe_subject_select ON public.dqe_subject FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY dqe_topic_select ON public.dqe_topic FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY dqe_subtopic_select ON public.dqe_subtopic FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY dqe_question_select ON public.dqe_question FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY dqe_schedule_select ON public.dqe_daily_schedule FOR SELECT TO authenticated, anon USING (true);

-- Seed minimal tree (AP Physics, IIT JEE Physics, NEET Biology, CBSE, Foundation)
INSERT INTO public.dqe_syllabus (slug, name, kind, display_order)
VALUES
  ('ap_physics', 'AP Program — Physics', 'ap', 1),
  ('ap_chemistry', 'AP Program — Chemistry', 'ap', 2),
  ('ap_calculus_ab', 'AP Program — Calculus AB', 'ap', 3),
  ('iit_jee_physics', 'IIT JEE — Physics', 'iit_jee', 10),
  ('iit_jee_chemistry', 'IIT JEE — Chemistry', 'iit_jee', 11),
  ('iit_jee_math', 'IIT JEE — Mathematics', 'iit_jee', 12),
  ('cbse_science_10', 'CBSE — Class 10 Science', 'cbse', 20),
  ('neet_biology', 'NEET — Biology', 'neet', 30),
  ('foundation_math_science', 'Foundation — Math & Science', 'foundation', 40)
ON CONFLICT (slug) DO NOTHING;

-- AP Physics — Mechanics — Laws of Motion
INSERT INTO public.dqe_subject (syllabus_id, name, slug, display_order)
SELECT id, 'Physics', 'physics', 1 FROM public.dqe_syllabus WHERE slug = 'ap_physics'
ON CONFLICT (syllabus_id, slug) DO NOTHING;

INSERT INTO public.dqe_topic (subject_id, name, slug, display_order)
SELECT s.id, 'Mechanics', 'mechanics', 1
FROM public.dqe_subject s
JOIN public.dqe_syllabus y ON y.id = s.syllabus_id
WHERE y.slug = 'ap_physics' AND s.slug = 'physics'
ON CONFLICT (subject_id, slug) DO NOTHING;

INSERT INTO public.dqe_subtopic (topic_id, name, slug, display_order)
SELECT t.id, 'Laws of Motion', 'laws_of_motion', 1
FROM public.dqe_topic t
JOIN public.dqe_subject s ON s.id = t.subject_id
JOIN public.dqe_syllabus y ON y.id = s.syllabus_id
WHERE y.slug = 'ap_physics' AND t.slug = 'mechanics'
ON CONFLICT (topic_id, slug) DO NOTHING;

-- CBSE Class 10 Science — Light
INSERT INTO public.dqe_subject (syllabus_id, name, slug, display_order)
SELECT id, 'Science', 'science', 1 FROM public.dqe_syllabus WHERE slug = 'cbse_science_10'
ON CONFLICT (syllabus_id, slug) DO NOTHING;

INSERT INTO public.dqe_topic (subject_id, name, slug, display_order)
SELECT s.id, 'Physics (Optics)', 'physics_optics', 1
FROM public.dqe_subject s
JOIN public.dqe_syllabus y ON y.id = s.syllabus_id
WHERE y.slug = 'cbse_science_10' AND s.slug = 'science'
ON CONFLICT (subject_id, slug) DO NOTHING;

INSERT INTO public.dqe_subtopic (topic_id, name, slug, display_order)
SELECT t.id, 'Reflection and Refraction', 'reflection_refraction', 1
FROM public.dqe_topic t
JOIN public.dqe_subject s ON s.id = t.subject_id
JOIN public.dqe_syllabus y ON y.id = s.syllabus_id
WHERE y.slug = 'cbse_science_10' AND t.slug = 'physics_optics'
ON CONFLICT (topic_id, slug) DO NOTHING;

-- IIT JEE Physics — Mechanics — Laws of Motion
WITH j AS (SELECT id FROM public.dqe_syllabus WHERE slug = 'iit_jee_physics' LIMIT 1)
INSERT INTO public.dqe_subject (syllabus_id, name, slug, display_order)
SELECT id, 'Physics', 'physics', 1 FROM j
ON CONFLICT (syllabus_id, slug) DO NOTHING;

WITH j AS (SELECT id FROM public.dqe_syllabus WHERE slug = 'iit_jee_physics' LIMIT 1),
sub AS (SELECT s.id FROM public.dqe_subject s JOIN j ON s.syllabus_id = j.id AND s.slug = 'physics')
INSERT INTO public.dqe_topic (subject_id, name, slug, display_order)
SELECT id, 'Mechanics', 'mechanics', 1 FROM sub
ON CONFLICT (subject_id, slug) DO NOTHING;

WITH j AS (SELECT id FROM public.dqe_syllabus WHERE slug = 'iit_jee_physics' LIMIT 1),
sub AS (SELECT s.id FROM public.dqe_subject s JOIN j ON s.syllabus_id = j.id AND s.slug = 'physics'),
top AS (SELECT t.id FROM public.dqe_topic t JOIN sub ON t.subject_id = sub.id AND t.slug = 'mechanics')
INSERT INTO public.dqe_subtopic (topic_id, name, slug, display_order)
SELECT id, 'Laws of Motion', 'laws_of_motion', 1 FROM top
ON CONFLICT (topic_id, slug) DO NOTHING;

-- NEET Biology — Genetics — DNA
WITH n AS (SELECT id FROM public.dqe_syllabus WHERE slug = 'neet_biology' LIMIT 1)
INSERT INTO public.dqe_subject (syllabus_id, name, slug, display_order)
SELECT id, 'Biology', 'biology', 1 FROM n
ON CONFLICT (syllabus_id, slug) DO NOTHING;

WITH n AS (SELECT id FROM public.dqe_syllabus WHERE slug = 'neet_biology' LIMIT 1),
sub AS (SELECT s.id FROM public.dqe_subject s JOIN n ON s.syllabus_id = n.id AND s.slug = 'biology')
INSERT INTO public.dqe_topic (subject_id, name, slug, display_order)
SELECT id, 'Genetics', 'genetics', 1 FROM sub
ON CONFLICT (subject_id, slug) DO NOTHING;

WITH n AS (SELECT id FROM public.dqe_syllabus WHERE slug = 'neet_biology' LIMIT 1),
sub AS (SELECT s.id FROM public.dqe_subject s JOIN n ON s.syllabus_id = n.id AND s.slug = 'biology'),
top AS (SELECT t.id FROM public.dqe_topic t JOIN sub ON t.subject_id = sub.id AND t.slug = 'genetics')
INSERT INTO public.dqe_subtopic (topic_id, name, slug, display_order)
SELECT id, 'DNA and RNA', 'dna_rna', 1 FROM top
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Foundation — basic science — measurements
WITH f AS (SELECT id FROM public.dqe_syllabus WHERE slug = 'foundation_math_science' LIMIT 1)
INSERT INTO public.dqe_subject (syllabus_id, name, slug, display_order)
SELECT id, 'Science', 'science', 1 FROM f
ON CONFLICT (syllabus_id, slug) DO NOTHING;

WITH f AS (SELECT id FROM public.dqe_syllabus WHERE slug = 'foundation_math_science' LIMIT 1),
sub AS (SELECT s.id FROM public.dqe_subject s JOIN f ON s.syllabus_id = f.id AND s.slug = 'science')
INSERT INTO public.dqe_topic (subject_id, name, slug, display_order)
SELECT id, 'Measurements', 'measurements', 1 FROM sub
ON CONFLICT (subject_id, slug) DO NOTHING;

WITH f AS (SELECT id FROM public.dqe_syllabus WHERE slug = 'foundation_math_science' LIMIT 1),
sub AS (SELECT s.id FROM public.dqe_subject s JOIN f ON s.syllabus_id = f.id AND s.slug = 'science'),
top AS (SELECT t.id FROM public.dqe_topic t JOIN sub ON t.subject_id = sub.id AND t.slug = 'measurements')
INSERT INTO public.dqe_subtopic (topic_id, name, slug, display_order)
SELECT id, 'SI Units and Dimensional Analysis', 'si_units_dimensional', 1 FROM top
ON CONFLICT (topic_id, slug) DO NOTHING;
