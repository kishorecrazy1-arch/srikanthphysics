import type { CourseType } from '../types';

const FOUNDATION_COURSES: readonly CourseType[] = [
  'foundation_batch_1',
  'foundation_batch_2',
  'foundation_batch_3',
  'maths_foundation_batch',
  'chemistry_foundation_batch',
];

function isFoundationCourse(courseType: CourseType | undefined | null): boolean {
  return !!courseType && (FOUNDATION_COURSES as readonly string[]).includes(courseType);
}

export function isFoundationCourseType(courseType: CourseType | undefined | null): boolean {
  return isFoundationCourse(courseType);
}

export function sheetRedirectIsFoundation(redirectTo: string | null | undefined): boolean {
  if (!redirectTo) return false;
  const t = redirectTo.replace(/\/$/, '');
  return t === '/foundation-dashboard' || t.startsWith('/foundation-dashboard/');
}
