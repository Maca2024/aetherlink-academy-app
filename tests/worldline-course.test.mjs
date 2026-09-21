import assert from 'node:assert/strict';
import test from 'node:test';
import {mkdtempSync, rmSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createApp} from '../server/app.mjs';

async function call(app, route, token, body, method = body ? 'POST' : 'GET') {
  const response = {status: 200, body: null};
  const res = {
    json(value) { response.body = value; return this; },
    status(code) { response.status = code; return this; },
    type() { return this; },
    set() { return this; },
    send(value) { response.body = value; return this; },
  };
  const layer = app.router.stack.find((candidate) => candidate.route?.path === route && candidate.route.methods[method.toLowerCase()]);
  assert.ok(layer, `route ${method} ${route} exists`);
  await layer.route.stack[0].handle({headers: {authorization: `Bearer ${token}`}, body: body || {}}, res, (error) => {
    response.status = error.status || 500;
    response.body = error.message;
  });
  return response;
}

test('Worldline course progress is authenticated, durable and participant-scoped', async () => {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'academy-worldline-'));
  try {
    const {app, store} = createApp({dir, hostKey: 'test'});
    const host = store.create('Worldline squad', {slug: 'worldline'});
    const participant = store.join(host.code, 'Alex');

    const empty = await call(app, '/game/worldline-progress', participant.token);
    assert.equal(empty.status, 200);
    assert.deepEqual(empty.body.completedLessonIds, []);
    assert.equal(empty.body.canWrite, true);

    const saved = await call(app, '/game/worldline-progress', participant.token, {
      lessonId: 'w0d1-theory',
      exerciseId: 'w0d1-ex1',
      activeLessonId: 'w0d1-theory',
    });
    assert.equal(saved.status, 200);
    assert.deepEqual(saved.body.completedLessonIds, ['w0d1-theory']);
    assert.deepEqual(saved.body.completedExerciseIds, ['w0d1-ex1']);

    const restored = await call(app, '/game/worldline-progress', participant.token);
    assert.deepEqual(
      (({canWrite, ...value}) => value)(restored.body),
      (({canWrite, ...value}) => value)(saved.body),
    );
    const facilitator = await call(app, '/game/worldline-progress', host.token);
    assert.equal(facilitator.status, 200);
    assert.equal(facilitator.body.canWrite, false);
    assert.deepEqual(facilitator.body.completedLessonIds, []);

    const invalid = await call(app, '/game/worldline-progress', participant.token, {lessonId: '<script>'});
    assert.equal(invalid.status, 400);
  } finally {
    rmSync(dir, {recursive: true, force: true});
  }
});
