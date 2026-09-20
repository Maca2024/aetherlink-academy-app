import test from 'node:test';
import assert from 'node:assert/strict';
import {CLASSROOM_DECK_ID, SLIDES_EMBED_URL, CLASSROOM_SANDBOX, classroomEmbedUrl} from '../src/classroom.js';

test('classroom embed targets Wave daily deck and /embed', () => {
  assert.equal(CLASSROOM_DECK_ID, '1DZ9-9XynhHBj62e-_r9wAy3MQHOni85VCGnW6kgh8bI');
  assert.match(SLIDES_EMBED_URL, /docs\.google\.com\/presentation\/d\//);
  assert.match(SLIDES_EMBED_URL, new RegExp(CLASSROOM_DECK_ID));
  assert.match(SLIDES_EMBED_URL, /\/embed/);
  assert.match(SLIDES_EMBED_URL, /start=false/);
});

test('classroomEmbedUrl keeps free browse (no day slide lock)', () => {
  const url = classroomEmbedUrl(3);
  assert.match(url, new RegExp(CLASSROOM_DECK_ID));
  assert.match(url, /\/embed/);
  assert.doesNotMatch(url, /slide=id\./);
  // day hint is chrome-only; URL may carry rm=minimal but not day lock
  const u = new URL(url);
  assert.equal(u.searchParams.has('day'), false);
});

test('facilitator classroom UI hooks exist in main.jsx', async () => {
  const {readFileSync} = await import('node:fs');
  const main = readFileSync(new URL('../src/main.jsx', import.meta.url), 'utf8');
  assert.match(main, /ClassroomOverlay/);
  assert.match(main, /onOpenClassroom/);
  assert.match(main, /classroomOpen/);
  assert.match(main, /classroom\.title/);
  assert.match(main, /classroom\.exit/);
  assert.match(main, /keydown/);
  assert.match(main, /Escape/);
  assert.doesNotMatch(main, /vendor\/proof-sdk/);
});

test('classroom chrome is translated in both catalogs', async () => {
  const {readFileSync} = await import('node:fs');
  const en = JSON.parse(readFileSync(new URL('../src/i18n/en.json', import.meta.url), 'utf8'));
  const nl = JSON.parse(readFileSync(new URL('../src/i18n/nl.json', import.meta.url), 'utf8'));
  for (const key of ['classroom.title', 'classroom.open', 'classroom.exit', 'classroom.exitShort', 'classroom.dayHint', 'classroom.frameTitle']) {
    assert.ok(en[key], `missing EN ${key}`);
    assert.ok(nl[key], `missing NL ${key}`);
  }
  assert.match(en['classroom.dayHint'], /\{day\}/);
  assert.match(nl['classroom.dayHint'], /\{day\}/);
});

test('classroom iframe is sandboxed and cannot navigate the facilitator away', async () => {
  const {readFileSync} = await import('node:fs');
  const main = readFileSync(new URL('../src/main.jsx', import.meta.url), 'utf8');
  // The embed must carry the sandbox attribute, not just the allow= policy.
  assert.match(main, /className="classroom-frame"[^>]*sandbox=\{CLASSROOM_SANDBOX\}/);

  const tokens = CLASSROOM_SANDBOX.split(' ');
  // What the Slides viewer needs to render and stay usable.
  for (const needed of ['allow-scripts', 'allow-same-origin', 'allow-popups', 'allow-presentation']) {
    assert.ok(tokens.includes(needed), `missing ${needed}`);
  }
  // Withheld on purpose: a deck must never navigate the facilitator out of the room.
  for (const withheld of ['allow-top-navigation', 'allow-top-navigation-by-user-activation', 'allow-forms', 'allow-downloads', 'allow-modals', 'allow-pointer-lock']) {
    assert.ok(!tokens.includes(withheld), `unexpectedly granted ${withheld}`);
  }
  // allow-scripts + allow-same-origin is only an escape for a same-origin frame.
  assert.match(SLIDES_EMBED_URL, /^https:\/\/docs\.google\.com\//);
});
