import {Schema} from 'effect';
import {describe, expect, test} from 'vitest';
import {startTimer} from '../src/actions/start-timer.ts';
import {toFullJsonSchema} from '../src/json-schema.ts';
import {EmptyInput} from '../src/schemas.ts';

describe('public input schemas', () => {
  test('no-argument actions accept only an empty object', () => {
    const decode = Schema.decodeUnknownSync(EmptyInput, {onExcessProperty: 'error'});
    expect(decode({})).toEqual({});
    for (const value of [[], 1, true, '', null, {role: 'facilitator'}, {confirmed: true}]) {
      expect(() => decode(value)).toThrow();
    }
    expect(toFullJsonSchema(EmptyInput)).toMatchObject({type: 'object', additionalProperties: false});
  });

  test('timer wire schema describes its runtime integer bounds', () => {
    expect(toFullJsonSchema(startTimer.input)).toMatchObject({
      type: 'object', properties: {seconds: {type: 'integer', minimum: 1, maximum: 3600}},
    });
    const decode = Schema.decodeUnknownSync(startTimer.input);
    for (const seconds of [0, 1.5, 3601]) expect(() => decode({seconds})).toThrow();
    expect(decode({seconds: 3600})).toEqual({seconds: 3600});
  });
});
