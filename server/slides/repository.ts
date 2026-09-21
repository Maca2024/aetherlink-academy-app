// DeckRepository: the persistence boundary. Upstream stores the full deck JSON
// in one `decks` row and serialises writes with a deck lock plus a revision
// column; both layers here keep that shape (row = id, room_id, revision, data).
import {existsSync,mkdirSync,readFileSync,renameSync,writeFileSync} from 'node:fs';
import path from 'node:path';
import {Context,Effect,Exit,Layer,Ref,Schema,pipe} from 'effect';
import type {Pool,PoolClient} from 'pg';
import {DeckNotFound,StorageFailure} from './errors.ts';
import {Deck,decodeDeck,encodeDeck} from './schema.ts';

export interface DeckRepositoryService{
 readonly get:(deckId:string)=>Effect.Effect<Deck,DeckNotFound|StorageFailure>;
 readonly list:(roomId:string)=>Effect.Effect<readonly Deck[],StorageFailure>;
 readonly insert:(deck:Deck)=>Effect.Effect<Deck,StorageFailure>;
 /** Locked read-modify-write. The repository bumps `revision` and `updatedAt`. */
 readonly modify:<E>(deckId:string,change:(deck:Deck)=>Effect.Effect<Deck,E>)=>Effect.Effect<Deck,DeckNotFound|StorageFailure|E>;
 readonly remove:(deckId:string)=>Effect.Effect<void,DeckNotFound|StorageFailure>;
}
export class DeckRepository extends Context.Tag('academy/slides/DeckRepository')<DeckRepository,DeckRepositoryService>(){}

const storage=(cause:unknown)=>new StorageFailure({cause});
const decode=(raw:unknown)=>pipe(decodeDeck(raw),Effect.mapError(storage));
const bump=(deck:Deck)=>new Deck({...deck,revision:deck.revision+1,updatedAt:new Date().toISOString()});

// ---- In-memory layer (LocalStore mode), optionally mirrored to a JSON file ---

export const makeMemoryRepository=(file?:string)=>Effect.gen(function*(){
 const initial=new Map<string,Deck>();
 if(file&&existsSync(file)){
  const raw=JSON.parse(readFileSync(file,'utf8')) as unknown[];
  for(const entry of raw){initial.set((entry as {id:string}).id,yield* decode(entry));}
 }
 const decks=yield* Ref.make(initial);
 const lock=yield* Effect.makeSemaphore(1);
 const persist=Effect.flatMap(Ref.get(decks),map=>Effect.try({try:()=>{if(!file)return;mkdirSync(path.dirname(file),{recursive:true,mode:0o700});writeFileSync(file+'.tmp',JSON.stringify([...map.values()].map(encodeDeck)),{mode:0o600});renameSync(file+'.tmp',file);},catch:storage}));
 const get=(deckId:string)=>Effect.flatMap(Ref.get(decks),map=>{const deck=map.get(deckId);return deck?Effect.succeed(deck):Effect.fail(new DeckNotFound({deckId}));});
 const service:DeckRepositoryService={
  get,
  list:roomId=>Effect.map(Ref.get(decks),map=>[...map.values()].filter(deck=>deck.roomId===roomId).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt))),
  insert:deck=>lock.withPermits(1)(Effect.zipRight(Ref.update(decks,map=>new Map(map).set(deck.id,deck)),Effect.as(persist,deck))),
  modify:(deckId,change)=>lock.withPermits(1)(Effect.gen(function*(){
   const next=bump(yield* change(yield* get(deckId)));
   yield* Ref.update(decks,map=>new Map(map).set(deckId,next));
   yield* persist;
   return next;
  })),
  remove:deckId=>lock.withPermits(1)(Effect.zipRight(get(deckId),Effect.zipRight(Ref.update(decks,map=>{const copy=new Map(map);copy.delete(deckId);return copy;}),persist))),
 };
 return service;
});
export const MemoryDeckRepository=(file?:string)=>Layer.effect(DeckRepository,makeMemoryRepository(file));

// ---- Postgres layer (shares the academy schema and pool) ---------------------

const DeckRow=Schema.Struct({data:Schema.Unknown});
export const makePostgresRepository=(pool:Pool,schema:string)=>{
 if(!/^[a-z][a-z0-9_]{0,62}$/.test(schema))throw new Error('Invalid Academy schema');
 const query=(client:Pool|PoolClient,sql:string,values:unknown[]=[])=>Effect.tryPromise({try:()=>client.query(sql,values),catch:storage});
 const searchPath=`SET LOCAL search_path TO "${schema}"`;
 const transaction=<A,E>(work:(client:PoolClient)=>Effect.Effect<A,E>)=>Effect.acquireUseRelease(
  Effect.tryPromise({try:()=>pool.connect(),catch:storage}),
  client=>Effect.gen(function*(){yield* query(client,'BEGIN');yield* query(client,searchPath);return yield* work(client);}),
  (client,exit)=>Effect.promise(()=>client.query(Exit.isSuccess(exit)?'COMMIT':'ROLLBACK').catch(()=>{}).finally(()=>client.release())),
 );
 const rows=(result:{rows:unknown[]})=>Effect.forEach(result.rows,row=>Effect.flatMap(Schema.decodeUnknown(DeckRow)(row).pipe(Effect.mapError(storage)),r=>decode(r.data)));
 const service:DeckRepositoryService={
  get:deckId=>transaction(client=>Effect.gen(function*(){const found=yield* rows(yield* query(client,'SELECT data FROM decks WHERE id=$1',[deckId]));return found[0]??(yield* Effect.fail(new DeckNotFound({deckId})));})),
  list:roomId=>transaction(client=>Effect.flatMap(query(client,'SELECT data FROM decks WHERE room_id=$1 ORDER BY updated_at DESC',[roomId]),rows)),
  insert:deck=>transaction(client=>Effect.as(query(client,'INSERT INTO decks(id,room_id,revision,data,updated_at) VALUES ($1,$2,$3,$4,$5)',[deck.id,deck.roomId,deck.revision,JSON.stringify(encodeDeck(deck)),deck.updatedAt]),deck)),
  modify:(deckId,change)=>transaction(client=>Effect.gen(function*(){
   const found=yield* rows(yield* query(client,'SELECT data FROM decks WHERE id=$1 FOR UPDATE',[deckId]));
   const current=found[0]??(yield* Effect.fail(new DeckNotFound({deckId})));
   const next=bump(yield* change(current));
   yield* query(client,'UPDATE decks SET revision=$2,data=$3,updated_at=$4 WHERE id=$1',[deckId,next.revision,JSON.stringify(encodeDeck(next)),next.updatedAt]);
   return next;
  })),
  remove:deckId=>transaction(client=>Effect.flatMap(query(client,'DELETE FROM decks WHERE id=$1',[deckId]),result=>result.rowCount?Effect.void:Effect.fail(new DeckNotFound({deckId})))),
 };
 return service;
};
export const PostgresDeckRepository=(pool:Pool,schema:string)=>Layer.succeed(DeckRepository,makePostgresRepository(pool,schema));
