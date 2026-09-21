import {buildActionTools} from './tool-adapter.ts';
import type {ActionRegistry} from '../registry.ts';

/**
 * MCP tool descriptors sharing schemas and the `dispatch` boundary with
 * every other adapter. Wiring these into an actual MCP transport/session
 * (`effect`'s `unstable/ai/McpServer`) is left to the host application —
 * see the README's "remaining bridge wiring" note.
 */
export const toMcpTools = <R>(registry: ActionRegistry<R>) => buildActionTools(registry);
