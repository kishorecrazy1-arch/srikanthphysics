-- Daily MCQ / practice generation inserts from the browser as authenticated users.
-- Original schema only had SELECT on public.questions → 403 on INSERT.

DROP POLICY IF EXISTS "Authenticated users can insert questions" ON public.questions;
CREATE POLICY "Authenticated users can insert questions"
  ON public.questions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update questions" ON public.questions;
CREATE POLICY "Authenticated users can update questions"
  ON public.questions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
