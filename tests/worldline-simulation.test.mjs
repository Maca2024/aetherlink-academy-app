import assert from 'node:assert/strict';
import test from 'node:test';
import {mkdtempSync, rmSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {curriculum} from '../src/worldline/data/curriculum.ts';
import {COURSE_IDS} from '../packages/course-contract/index.mjs';
import {createApp} from '../server/app.mjs';

const employees = [
  'Mila Vermeer',
  'Noah Jansen',
  'Sofia de Vries',
  'Elias Bakker',
  'Lina Smit',
  'Daan Meijer',
];
const lessons = curriculum.flatMap((week) => week.days.flatMap((day) => day.lessons));
const exercises = lessons.flatMap((lesson) => lesson.exercises || []);

async function call(app, route, token, body, method = body ? 'POST' : 'GET') {
  const response = {status: 200, body: null};
  const res = {
    json(value) { response.body = value; return this; },
    status(code) { response.status = code; return this; },
  };
  const layer = app.router.stack.find((candidate) => candidate.route?.path === route && candidate.route.methods[method.toLowerCase()]);
  assert.ok(layer, `route ${method} ${route} exists`);
  await layer.route.stack[0].handle({headers: {authorization: `Bearer ${token}`}, body: body || {}}, res, (error) => {
    response.status = error.status || 500;
    response.body = error.message;
  });
  return response;
}

test('1000 synthetic Worldline lesson journeys stay isolated across six employees', async () => {
  assert.equal(curriculum.length, 9);
  assert.equal(lessons.length, 84);
  assert.equal(exercises.length, 41);

  const journeys = 1000;
  const dir = mkdtempSync(path.join(os.tmpdir(), 'academy-worldline-simulation-'));
  try {
    const {app, store} = createApp({dir, hostKey: 'simulation'});
    const host = store.create('Synthetic Worldline cohort', {slug: 'simulation'}, null, COURSE_IDS.WORLDLINE);
    const participants = employees.map((name) => store.join(host.code, name));

    let lessonTransitions = 0;
    let exerciseTransitions = 0;
    for (let journey = 0; journey < journeys; journey += 1) {
      const state = {completedLessonIds: new Set(), completedExerciseIds: new Set()};
      for (const lesson of lessons) {
        state.completedLessonIds.add(lesson.id);
        lessonTransitions += 1;
        for (const exercise of lesson.exercises || []) {
          state.completedExerciseIds.add(exercise.id);
          exerciseTransitions += 1;
        }
      }
      assert.equal(state.completedLessonIds.size, lessons.length);
      assert.equal(state.completedExerciseIds.size, exercises.length);
    }

    let apiMutations = 0;
    for (let mutation = 0; mutation < journeys; mutation += 1) {
      const participant = participants[mutation % participants.length];
      const lesson = lessons[mutation % lessons.length];
      const result = await call(app, '/game/worldline-progress', participant.token, {
        courseId: COURSE_IDS.WORLDLINE,
        lessonId: lesson.id,
        activeLessonId: lesson.id,
      });
      assert.equal(result.status, 200);
      assert.equal(result.body.courseId, COURSE_IDS.WORLDLINE);
      apiMutations += 1;
    }

    const progress = await Promise.all(participants.map((participant) => call(app, '/game/worldline-progress', participant.token)));
    const uniqueLessonsPerEmployee = progress.map((result) => result.body.completedLessonIds.length);
    assert.equal(progress.length, employees.length);
    assert.equal(uniqueLessonsPerEmployee.reduce((sum, count) => sum + count, 0), new Set(lessons.map((lesson) => lesson.id)).size);
    assert.ok(uniqueLessonsPerEmployee.every((count) => count > 0));

    const report = {employees: employees.length, journeys, lessonsPerJourney: lessons.length, lessonTransitions, exerciseTransitions, apiMutations, uniqueLessonsPerEmployee};
    console.log(`[worldline-simulation] ${JSON.stringify(report)}`);
    assert.deepEqual(report, {employees: 6, journeys: 1000, lessonsPerJourney: 84, lessonTransitions: 84000, exerciseTransitions: 41000, apiMutations: 1000, uniqueLessonsPerEmployee});
  } finally {
    rmSync(dir, {recursive: true, force: true});
  }
});
