-- App code uses extra segment_type values (e.g. practice_bank). Original schema only allowed basics/homework/practice.

ALTER TABLE questions DROP CONSTRAINT IF EXISTS questions_segment_type_check;

ALTER TABLE questions
  ADD CONSTRAINT questions_segment_type_check
  CHECK (segment_type IN ('basics', 'homework', 'practice', 'practice_bank', 'daily_qa'));
