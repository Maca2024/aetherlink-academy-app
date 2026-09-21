export const COURSE_IDS = Object.freeze({
  SUPPORT: 'aetherlink-support',
  WORLDLINE: 'worldline-ai-first',
});

export const COURSE_REGISTRY = Object.freeze([
  Object.freeze({
    id: COURSE_IDS.SUPPORT,
    kind: 'classroom',
    title: 'AetherLink Support Track',
    subtitle: 'Five support days for squad practice, evidence and handoff.',
    duration: '5 support days',
    contentPath: '/game/day-pack',
    ai: 'claude-code-mcp',
  }),
  Object.freeze({
    id: COURSE_IDS.WORLDLINE,
    kind: 'curriculum',
    title: 'Worldline AI-First Academy',
    subtitle: 'Nine levels from AI foundations to RALF and team-scale delivery.',
    duration: '9 levels',
    contentPath: '/game/worldline-progress',
    ai: 'litellm-claude',
  }),
]);

export function getCourse(courseId) {
  return COURSE_REGISTRY.find((course) => course.id === courseId) || null;
}

export function isCourseId(courseId) {
  return COURSE_REGISTRY.some((course) => course.id === courseId);
}

export function normalizeCourseId(courseId) {
  return isCourseId(courseId) ? courseId : COURSE_IDS.SUPPORT;
}

export function emptyWorldlineProgress() {
  return {
    version: 1,
    courseId: COURSE_IDS.WORLDLINE,
    completedLessonIds: [],
    completedExerciseIds: [],
    activeLessonId: null,
    updatedAt: null,
  };
}
