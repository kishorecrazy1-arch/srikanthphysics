import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const rows = JSON.parse(fs.readFileSync(path.join(root, 'api', 'foundationQuestionsBank.json'), 'utf8'));

function sqlStr(s) {
  return "'" + String(s ?? '').replace(/'/g, "''") + "'";
}

function sqlJsonb(arr) {
  return sqlStr(JSON.stringify(arr)) + '::jsonb';
}

const values = rows
  .map(
    (r) =>
      `(${sqlStr(r.unit)}, ${sqlStr(r.topic)}, ${sqlStr(r.exam_style)}, ${sqlStr(r.difficulty)}, ${Number(r.level)}, ${sqlStr(r.section)}, ${sqlStr(r.question)}, ${sqlJsonb(r.options)}, ${sqlStr(r.correct)}, ${sqlStr(r.explanation)}, ${sqlStr(r.formula)})`
  )
  .join(',\n');

const header = `-- Foundation Level 1 "Ordinary Thinking" MCQ bank (${rows.length} rows)
CREATE TABLE IF NOT EXISTS public.foundation_questions (
  id SERIAL PRIMARY KEY,
  unit TEXT NOT NULL,
  topic TEXT NOT NULL,
  exam_style TEXT,
  difficulty TEXT,
  level INT NOT NULL DEFAULT 1,
  section TEXT NOT NULL DEFAULT 'Ordinary Thinking',
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct TEXT NOT NULL,
  explanation TEXT,
  formula TEXT
);

CREATE INDEX IF NOT EXISTS idx_foundation_questions_unit_topic
  ON public.foundation_questions (unit, topic, level, section);

ALTER TABLE public.foundation_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read foundation_questions" ON public.foundation_questions;
CREATE POLICY "Allow read foundation_questions"
  ON public.foundation_questions FOR SELECT
  USING (true);

GRANT SELECT ON public.foundation_questions TO anon, authenticated, service_role;

INSERT INTO public.foundation_questions (unit, topic, exam_style, difficulty, level, section, question, options, correct, explanation, formula)
VALUES
`;

const outPath = path.join(root, 'supabase', 'migrations', '20260414120000_foundation_questions.sql');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${header}${values};\n`, 'utf8');
console.log('Wrote', outPath, 'rows:', rows.length);
