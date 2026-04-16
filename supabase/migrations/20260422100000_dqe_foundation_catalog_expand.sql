-- Expand Foundation (dqe_*) catalog so more Foundation syllabus topics can resolve to engine subtopics.
--
-- Prerequisite: migration 20260420190000_daily_question_engine.sql must be applied first
-- (creates dqe_syllabus, dqe_subject, dqe_topic, dqe_subtopic, dqe_question, etc.).
-- If you see "relation public.dqe_topic does not exist", run that file before this one.

DO $guard$
BEGIN
  IF to_regclass('public.dqe_topic') IS NULL THEN
    RAISE EXCEPTION
      'Apply 20260420190000_daily_question_engine.sql first (missing public.dqe_topic).';
  END IF;
END;
$guard$;

-- Kinematics
INSERT INTO public.dqe_topic (subject_id, name, slug, display_order)
SELECT s.id, 'Kinematics', 'kinematics', 2
FROM public.dqe_subject s
JOIN public.dqe_syllabus y ON y.id = s.syllabus_id
WHERE y.slug = 'foundation_math_science' AND s.slug = 'science'
ON CONFLICT (subject_id, slug) DO NOTHING;

INSERT INTO public.dqe_subtopic (topic_id, name, slug, display_order)
SELECT t.id, 'Linear Motion and Graphs', 'linear_motion_graphs', 1
FROM public.dqe_topic t
JOIN public.dqe_subject s ON s.id = t.subject_id
JOIN public.dqe_syllabus y ON y.id = s.syllabus_id
WHERE y.slug = 'foundation_math_science' AND t.slug = 'kinematics'
ON CONFLICT (topic_id, slug) DO NOTHING;

INSERT INTO public.dqe_subtopic (topic_id, name, slug, display_order)
SELECT t.id, 'Kinematic Equations and Free Fall', 'kinematic_equations', 2
FROM public.dqe_topic t
JOIN public.dqe_subject s ON s.id = t.subject_id
JOIN public.dqe_syllabus y ON y.id = s.syllabus_id
WHERE y.slug = 'foundation_math_science' AND t.slug = 'kinematics'
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Laws of motion
INSERT INTO public.dqe_topic (subject_id, name, slug, display_order)
SELECT s.id, 'Laws of Motion', 'laws_of_motion', 3
FROM public.dqe_subject s
JOIN public.dqe_syllabus y ON y.id = s.syllabus_id
WHERE y.slug = 'foundation_math_science' AND s.slug = 'science'
ON CONFLICT (subject_id, slug) DO NOTHING;

INSERT INTO public.dqe_subtopic (topic_id, name, slug, display_order)
SELECT t.id, 'Newton''s Laws and Free-Body Diagrams', 'newtons_laws', 1
FROM public.dqe_topic t
JOIN public.dqe_subject s ON s.id = t.subject_id
JOIN public.dqe_syllabus y ON y.id = s.syllabus_id
WHERE y.slug = 'foundation_math_science' AND t.slug = 'laws_of_motion'
ON CONFLICT (topic_id, slug) DO NOTHING;

-- Work & energy
INSERT INTO public.dqe_topic (subject_id, name, slug, display_order)
SELECT s.id, 'Work, Energy and Power', 'work_energy_power', 4
FROM public.dqe_subject s
JOIN public.dqe_syllabus y ON y.id = s.syllabus_id
WHERE y.slug = 'foundation_math_science' AND s.slug = 'science'
ON CONFLICT (subject_id, slug) DO NOTHING;

INSERT INTO public.dqe_subtopic (topic_id, name, slug, display_order)
SELECT t.id, 'Work, Kinetic and Potential Energy', 'work_energy_basics', 1
FROM public.dqe_topic t
JOIN public.dqe_subject s ON s.id = t.subject_id
JOIN public.dqe_syllabus y ON y.id = s.syllabus_id
WHERE y.slug = 'foundation_math_science' AND t.slug = 'work_energy_power'
ON CONFLICT (topic_id, slug) DO NOTHING;
