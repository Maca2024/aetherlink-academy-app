import assert from 'node:assert/strict';
import test from 'node:test';
import {completeWithLiteLLM, publicAiConfig, readAiConfig} from '../server/ai-gateway.mjs';

test('LiteLLM config exposes no secret and preserves Claude model routing', () => {
  const env = {
    LITELLM_BASE_URL: 'https://llm.example.test/',
    LITELLM_API_KEY: 'secret-key',
    LITELLM_TUTOR_MODEL: 'anthropic/claude-sonnet-4-6',
    LITELLM_EVALUATOR_MODEL: 'claude-opus-4-8',
  };
  const config = readAiConfig(env);
  assert.equal(config.baseUrl, 'https://llm.example.test');
  assert.equal(config.configured, true);
  assert.equal(publicAiConfig(env).tutorModel, 'anthropic/claude-sonnet-4-6');
  assert.equal(Object.hasOwn(publicAiConfig(env), 'apiKey'), false);
  assert.equal(readAiConfig({LITELLM_BASE_URL: 'https://llm.example.test', LITELLM_API_KEY: 'secret-key'}).evaluatorModel, 'anthropic/claude-opus-4-8');
});

test('LiteLLM gateway sends the key only server-side and returns Claude content', async () => {
  let request;
  const result = await completeWithLiteLLM({
    env: {LITELLM_BASE_URL: 'https://llm.example.test', LITELLM_API_KEY: 'secret-key', LITELLM_TUTOR_MODEL: 'claude-sonnet-4-6'},
    messages: [{role: 'user', content: 'Help me learn.'}],
    fetchImpl: async (url, options) => {
      request = {url, options};
      return {ok: true, status: 200, text: async () => JSON.stringify({choices: [{message: {content: 'A clear next step.'}}], usage: {total_tokens: 12}})};
    },
  });
  assert.equal(result.content, 'A clear next step.');
  assert.equal(result.model, 'claude-sonnet-4-6');
  assert.equal(request.url, 'https://llm.example.test/v1/chat/completions');
  assert.equal(request.options.headers.authorization, 'Bearer secret-key');
  assert.equal(JSON.parse(request.options.body).model, 'claude-sonnet-4-6');
});

test('LiteLLM gateway rejects an unconfigured or non-Claude route', async () => {
  await assert.rejects(
    completeWithLiteLLM({messages: [{role: 'user', content: 'Hi'}], env: {}}),
    (error) => error.status === 503,
  );
  await assert.rejects(
    completeWithLiteLLM({messages: [{role: 'user', content: 'Hi'}], env: {LITELLM_BASE_URL: 'https://llm.example.test', LITELLM_API_KEY: 'secret', LITELLM_TUTOR_MODEL: 'gpt-5'}}),
    (error) => error.status === 500,
  );
});
