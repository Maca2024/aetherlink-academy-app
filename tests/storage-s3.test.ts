import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {Effect} from 'effect';
import {isStorageConfigured, readStorageConfig} from '../server/storage/config.ts';
import {ObjectStore, S3ObjectStore} from '../server/storage/object-store.ts';

const config=readStorageConfig();

test('the S3 layer round-trips bytes against a real endpoint',{skip:!isStorageConfigured(config)},async()=>{
 const key=`rooms/${randomUUID()}/${randomUUID()}.txt`;
 const bytes=new TextEncoder().encode('AetherLink Academy — round trip\n');
 const program=Effect.gen(function*(){
  const store=yield* ObjectStore;
  yield* store.put(key,bytes,'text/plain');
  const object=yield* store.get(key);
  assert.deepEqual([...object.bytes],[...bytes]);
  assert.match(object.contentType,/^text\/plain/);
  yield* store.remove(key);
  const after=yield* Effect.either(store.get(key));
  assert.equal(after._tag,'Left','a removed object must not be readable');
 });
 await Effect.runPromise(Effect.provide(program,S3ObjectStore(config)) as Effect.Effect<void>);
});
