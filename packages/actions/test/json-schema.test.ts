import {Schema} from 'effect';
import {describe, expect, test} from 'vitest';
import {toFullJsonSchema} from '../src/json-schema.ts';

interface NodeType {
  readonly label: string;
  readonly child: NodeType | null;
}

const Node: Schema.Codec<NodeType> = Schema.Struct({
  label: Schema.String,
  child: Schema.suspend((): Schema.Codec<NodeType | null> => Schema.NullOr(Node)).annotate({identifier: 'Node'}),
}).annotate({identifier: 'Node'});

describe('toFullJsonSchema', () => {
  test('a named recursive schema resolves through $defs, with the referenced property reachable', () => {
    const full = toFullJsonSchema(Node);

    expect(full.$ref).toBe('#/$defs/Node');
    const defs = full.$defs as Record<string, {properties?: Record<string, unknown>}>;
    expect(defs).toBeDefined();
    expect(defs.Node).toBeDefined();
    expect(defs.Node!.properties).toHaveProperty('label');
    expect(defs.Node!.properties).toHaveProperty('child');
  });

  test('a schema with no nested definitions has no $defs key', () => {
    const full = toFullJsonSchema(Schema.Struct({message: Schema.String}));
    expect(full.$defs).toBeUndefined();
    expect(full.type).toBe('object');
  });
});
