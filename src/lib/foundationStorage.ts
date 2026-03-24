/** localStorage helpers for Foundation course — hub + analytics + daily practice */

const ANALYTICS_KEY = 'foundationAnalytics';
const TOPIC_PROGRESS_KEY = 'foundationTopicProgress';

export type FoundationAnalyticsState = {
  questionsSolved: number;
  correctAnswers: number;
  lastUpdated?: string;
};

export type FoundationTopicProgress = Record<string, number>;

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
