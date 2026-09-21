import assert from 'node:assert/strict';
import test from 'node:test';
import {mkdtempSync, rmSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {COURSE_IDS} from '../packages/course-contract/index.mjs';
import {createApp} from '../server/app.mjs';

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

test('course tracks are explicit and support controls cannot overwrite Worldline progress', async () => {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'academy-course-compat-'));
  try {
    const {app, store} = createApp({dir, hostKey: 'test'});
    const host = store.create('Worldline squad', {slug: 'worldline'}, null, COURSE_IDS.WORLDLINE);
    const participant = store.join(host.code, 'Alex');

    const courses = await call(app, '/game/courses', participant.token);
    assert.equal(courses.status, 200);
    assert.equal(courses.body.selectedCourseId, COURSE_IDS.WORLDLINE);
    assert.deepEqual(courses.body.courses.map((course) => course.id), [COURSE_IDS.SUPPORT, COURSE_IDS.WORLDLINE]);

    const state = await call(app, '/game/state', participant.token);
    assert.equal(state.body.courseId, COURSE_IDS.WORLDLINE);
    assert.equal(state.body.supportDay, 1);
    assert.equal(state.body.activeLessonId, null);

    const changed = await call(app, '/game/control', host.token, {action: 'course', value: COURSE_IDS.SUPPORT});
    assert.equal(changed.status, 200);
    assert.equal(changed.body.courseId, COURSE_IDS.SUPPORT);

    const forbidden = await call(app, '/game/control', participant.token, {action: 'course', value: COURSE_IDS.WORLDLINE});
    assert.equal(forbidden.status, 403);
  } finally {
    rmSync(dir, {recursive: true, force: true});
  }
});
