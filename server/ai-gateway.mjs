import {fail} from './store.mjs';

const cleanOrigin = (value) => String(value || '').trim().replace(/\/$/, '');

export function readAiConfig(env=process.env) {
  const baseUrl = cleanOrigin(env.LITELLM_BASE_URL || env.LITELLM_URL);
  const apiKey = String(env.LITELLM_API_KEY || env.WORLDLINE_LITELLM_API_KEY || '').trim();
  const tutorModel = String(env.LITELLM_TUTOR_MODEL || env.WORLDLINE_TUTOR_MODEL || 'anthropic/claude-sonnet-4-6').trim();
  const evaluatorModel = String(env.LITELLM_EVALUATOR_MODEL || env.WORLDLINE_EVALUATOR_MODEL || 'anthropic/claude-opus-4-8').trim();
  const maxTokens = Math.min(1600, Math.max(128, Number(env.LITELLM_MAX_TOKENS || 700)));
  return {baseUrl, apiKey, tutorModel, evaluatorModel, maxTokens, configured:Boolean(baseUrl && apiKey)};
}

export function publicAiConfig(env=process.env) {
  const config = readAiConfig(env);
  return {configured:config.configured, provider:'LiteLLM', tutorModel:config.configured ? config.tutorModel : null, evaluatorModel:config.configured ? config.evaluatorModel : null, maxTokens:config.maxTokens};
}

function safeModel(model) {
  if (!/^(?:claude(?:-|$)|anthropic\/claude(?:-|$))/i.test(model)) fail(500, 'De AI-gateway is niet op een Claude-model geconfigureerd.');
  return model;
}

export async function completeWithLiteLLM({messages,kind='tutor',temperature=0.2,fetchImpl=fetch,env=process.env}) {
  const config = readAiConfig(env);
  if (!config.configured) fail(503, 'AI-tutor is nog niet geconfigureerd. Stel LITELLM_BASE_URL en LITELLM_API_KEY in.');
  if (!Array.isArray(messages) || messages.length < 1 || messages.length > 12) fail(400, 'Ongeldige AI-conversatie.');
  const model = safeModel(kind === 'evaluator' ? config.evaluatorModel : config.tutorModel);
  const response = await fetchImpl(`${config.baseUrl}/v1/chat/completions`, {
    method:'POST',
    headers:{'content-type':'application/json',authorization:`Bearer ${config.apiKey}`},
    body:JSON.stringify({model,messages,temperature,max_tokens:config.maxTokens,stream:false}),
    signal:AbortSignal.timeout(30000),
  });
  const raw = await response.text();
  let data;
  try { data = JSON.parse(raw); } catch { data = null; }
  if (!response.ok) {
    console.warn('[academy] LiteLLM request failed', {status:response.status, model});
    fail(response.status >= 500 ? 502 : response.status, 'De AI-tutor kon geen antwoord geven.');
  }
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== 'string' || !content.trim()) fail(502, 'De AI-tutor gaf geen bruikbaar antwoord.');
  return {content:content.trim(),model,usage:data.usage||null};
}
