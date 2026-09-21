import {buildActionTools} from './tool-adapter.ts';
import type {ActionRegistry} from '../registry.ts';

/**
 * Chat-function-calling shaped view of the same tool descriptors, for hosts
 * that speak an OpenAI/Anthropic-style `{name, description, parameters}`
 * function schema instead of raw MCP.
 */
export const toChatTools = <R>(registry: ActionRegistry<R>) =>
  buildActionTools(registry).map((tool) => ({
    type: 'function' as const,
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.inputSchema,
    },
    call: tool.call,
  }));
