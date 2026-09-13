import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getHeadlessMilkdownParser, serializeMarkdown } from '../vendor/proof-sdk/server/milkdown-headless.ts';

test('headless serialization supports an empty collaborative fragment and subsequent content', async () => {
  const parser = await getHeadlessMilkdownParser();
  assert.equal(await serializeMarkdown(parser.schema.topNodeType.create()), '');
  const content = parser.parseMarkdown('# Restored\n\nContent after an empty fragment.\n');
  assert.equal(await serializeMarkdown(content), '# Restored\n\nContent after an empty fragment.\n');
});
