/** Normalize DB `correct_answer` / `correctAnswer` to A–D for MCQ UI. */
export function normalizeMcqCorrectLetter(raw: unknown): 'A' | 'B' | 'C' | 'D' | '' {
  const s = String(raw ?? '')
    .trim()
    .toUpperCase();
  if (/^[ABCD]$/.test(s)) return s as 'A' | 'B' | 'C' | 'D';
  if (/^[1-4]$/.test(s)) {
    const map = { '1': 'A', '2': 'B', '3': 'C', '4': 'D' } as const;
    return map[s as keyof typeof map];
  }
  return '';
}
