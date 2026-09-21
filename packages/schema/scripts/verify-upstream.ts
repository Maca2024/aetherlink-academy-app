import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {strict as assert} from 'node:assert';
import vm from 'node:vm';
import {decodeSlide, encodeSlide} from '../src/index.ts';

const sourcePath = process.argv.find((argument) => argument !== '--' && argument.endsWith('.js'));
const expectedSha = '0c194f6fc38481290922b878ac5a7d31ca795c8d';
const expectedSourceDigest = '7a6785dde8972216291fe99139e402a85d2e7a2a142f491b4ebe795db558a8ae';
if (!sourcePath) throw new Error('usage: pnpm verify:upstream -- /path/to/slides.js');

const context: {window: {SLIDES?: unknown}} = {window: {}};
vm.createContext(context);
const sourceBytes = readFileSync(sourcePath);
const sourceDigest = createHash('sha256').update(sourceBytes).digest('hex');
assert.equal(sourceDigest, expectedSourceDigest, `source bytes do not match ${expectedSha}`);
vm.runInContext(sourceBytes.toString('utf8'), context, {filename: sourcePath, timeout: 1000});
const sourceSlides = context.window.SLIDES;
assert(Array.isArray(sourceSlides), `no window.SLIDES in ${sourcePath}`);
assert.equal(sourceSlides.length, 78, 'source contract changed: expected 78 slides');

for (const [index, source] of sourceSlides.entries()) {
  assert(source && typeof source === 'object');
  const withIdentity = {id: `source-${index + 1}`, lessonId: 'source-lesson', ordinal: index + 1, ...(source as Record<string, unknown>)};
  const decoded = decodeSlide(withIdentity);
  const roundTrip = encodeSlide(decoded) as Record<string, unknown>;
  delete roundTrip.id;
  delete roundTrip.lessonId;
  delete roundTrip.ordinal;
  const original = JSON.parse(JSON.stringify(source)) as Record<string, unknown>;
  assert.deepEqual(roundTrip, original, `lossless round-trip failed at slide ${index + 1}`);
}

console.log(`verified ${sourceSlides.length} slides from source fixture at commit ${expectedSha}`);
