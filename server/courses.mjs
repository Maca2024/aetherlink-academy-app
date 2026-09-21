import {COURSE_IDS, COURSE_REGISTRY, getCourse, isCourseId, normalizeCourseId} from '../packages/course-contract/index.mjs';

export {COURSE_IDS, COURSE_REGISTRY, getCourse, isCourseId, normalizeCourseId};

export function publicCourses({selectedCourseId} = {}) {
  return {
    courses: COURSE_REGISTRY,
    selectedCourseId: normalizeCourseId(selectedCourseId),
  };
}
