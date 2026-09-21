import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import {describe, expect, test} from 'vitest';
import {describeActions} from '../src/adapters/tool-adapter.ts';
import {toWebMcpTools, type ActionDescriptor} from '../src/adapters/web-mcp.ts';
import {registry} from '../src/actions/index.ts';

const here = path.dirname(fileURLToPath(import.meta.url));

describe('toWebMcpTools (browser-safe adapter)', () => {
  test('bundles for the browser with no node:crypto or other node builtins pulled in', async () => {
    const result = await build({
      stdin: {contents: "export {toWebMcpTools} from '@academy/actions/web-mcp';", resolveDir: path.join(here, '..')},
      bundle: true,
      write: false,
      platform: 'browser',
      format: 'esm',
      logLevel: 'silent',
    });
    const code = result.outputFiles[0]!.text;
    expect(code).not.toMatch(/node:crypto/);
    expect(code).not.toMatch(/require\(["']crypto["']\)/);
    expect(code).not.toContain('randomUUID');
  });

  test('calls the injected remote invoke with the action name, payload, and confirmation token — no local dispatch', async () => {
    const descriptors: ReadonlyArray<ActionDescriptor> = describeActions(registry);
    const calls: Array<{name: string; payload: unknown; confirmationToken: string | undefined}> = [];
    const invoke = async (name: string, payload: unknown, confirmationToken?: string) => {
      calls.push({name, payload, confirmationToken});
      return {ok: true};
    };
    const tools = toWebMcpTools(descriptors, invoke);
    const startTimer = tools.find((t) => t.name === 'startTimer')!;
    const result = await startTimer.call({seconds: 30}, 'some-token');
    expect(result).toEqual({ok: true});
    expect(calls).toEqual([{name: 'startTimer', payload: {seconds: 30}, confirmationToken: 'some-token'}]);
  });

  test('descriptors carry the same JSON-schema-derived input/output as the server tools', () => {
    const descriptors = describeActions(registry);
    const getScreenState = descriptors.find((d) => d.name === 'getScreenState')!;
    expect(getScreenState.outputSchema).toMatchObject({type: 'object', properties: {screen: {type: 'string'}}});
  });
});
