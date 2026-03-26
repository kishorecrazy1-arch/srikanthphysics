/** localStorage helpers for Foundation course — hub + analytics + daily practice */

const ANALYTICS_KEY = 'foundationAnalytics';
const TOPIC_PROGRESS_KEY = 'foundationTopicProgress';
const EXAM_HISTORY_KEY = 'foundationExamHistory';

export type FoundationAnalyticsState = {
  questionsSolved: number;
  correctAnswers: number;
  lastUpdated?: string;
};

export type FoundationTopicProgress = Record<string, number>;

export type FoundationExamResult = {
  id: string;
  submittedAt: string;
  examType: 'mock-test' | 'daily-practice';
  unitName?: string;
  answered: number;
  correct: number;
  total: number;
  accuracy: number;
  timeSpentSeconds?: number;
};

export function getFoundationAnalytics(): FoundationAnalyticsState {
  try {
    const raw = localStorage.getItem(ANALYTICS_KEY);
    if (!raw) return { questionsSolved: 0, correctAnswers: 0 };
    const p = JSON.parse(raw) as FoundationAnalyticsState;
    return {
      questionsSolved: p.questionsSolved ?? 0,
      correctAnswers: p.correctAnswers ?? 0,
      lastUpdated: p.lastUpdated,
    };
  } catch {
    return { questionsSolved: 0, correctAnswers: 0 };
  }
}

export function mergeFoundationAnalytics(partial: Partial<FoundationAnalyticsState>) {
  const cur = getFoundationAnalytics();
  const next = {
    ...cur,
    ...partial,
    lastUpdated: new Date().toISOString(),
  };
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(next));
}

export function getFoundationTopicProgress(): FoundationTopicProgress {
  try {
    const raw = localStorage.getItem(TOPIC_PROGRESS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as FoundationTopicProgress;
  } catch {
    return {};
  }
}

export function bumpTopicProgress(unitName: string, deltaCorrect: number, deltaAttempt: number) {
  const cur = getFoundationTopicProgress();
  const key = unitName;
  const prev = cur[key] ?? 0;
  const nextVal = Math.min(100, Math.round(prev + deltaCorrect * 2 - deltaAttempt * 0.5));
  cur[key] = Math.max(0, nextVal);
  localStorage.setItem(TOPIC_PROGRESS_KEY, JSON.stringify(cur));
}

export function getFoundationExamHistory(): FoundationExamResult[] {
  try {
    const raw = localStorage.getItem(EXAM_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => {
      return (
        item &&
        typeof item.submittedAt === 'string' &&
        typeof item.examType === 'string' &&
        typeof item.answered === 'number' &&
        typeof item.correct === 'number' &&
        typeof item.total === 'number' &&
        typeof item.accuracy === 'number'
      );
    }) as FoundationExamResult[];
  } catch {
    return [];
  }
}

export function appendFoundationExamResult(result: Omit<FoundationExamResult, 'id'>): void {
  const history = getFoundationExamHistory();
  const entry: FoundationExamResult = {
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    ...result,
  };
  const next = [entry, ...history].slice(0, 200);
  localStorage.setItem(EXAM_HISTORY_KEY, JSON.stringify(next));
}
