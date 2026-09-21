import {Schema} from 'effect';

/**
 * `Schema.toJsonSchemaDocument` returns `{schema, definitions}` separately;
 * refs in `schema` point at `#/$defs/<key>`, so a JSON Schema consumer needs
 * `definitions` merged back in as `$defs` to resolve them.
 */
export const toFullJsonSchema = (schema: Schema.Codec<unknown, unknown, never, never>): Record<string, unknown> => {
  const document = Schema.toJsonSchemaDocument(schema);
  const defs = document.definitions as Record<string, unknown>;
  return Object.keys(defs).length > 0 ? {...document.schema, $defs: defs} : {...document.schema};
};
