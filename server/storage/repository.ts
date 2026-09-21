// FileRepository: the metadata boundary. A row is immutable once written, so
// there is no locked read-modify-write here; the object store holds the bytes
// and `object_key` is unique, which makes a re-upload a new row, never a patch.
import {Context, Effect, Exit, Layer, Ref, pipe} from 'effect';
import type {Pool, PoolClient} from 'pg';
import {FileNotFound, StorageUnavailable} from './errors.ts';
import {StoredFile, decodeStoredFile} from './schema.ts';

export interface FileRepositoryService{
 readonly insert:(file:StoredFile)=>Effect.Effect<StoredFile,StorageUnavailable>;
 readonly get:(fileId:string)=>Effect.Effect<StoredFile,FileNotFound|StorageUnavailable>;
 readonly listByRoom:(roomId:string)=>Effect.Effect<readonly StoredFile[],StorageUnavailable>;
 readonly remove:(fileId:string)=>Effect.Effect<void,FileNotFound|StorageUnavailable>;
}
export class FileRepository extends Context.Tag('academy/storage/FileRepository')<FileRepository,FileRepositoryService>(){}

const storage=(cause:unknown)=>new StorageUnavailable({cause});
const decode=(raw:unknown)=>pipe(decodeStoredFile(raw),Effect.mapError(storage));
const newest=(a:StoredFile,b:StoredFile)=>b.createdAt.localeCompare(a.createdAt);

// ---- In-memory layer (LocalStore mode, and the layer the action tests use) --

export const makeMemoryRepository=Effect.gen(function*(){
 const files=yield* Ref.make(new Map<string,StoredFile>());
 const get=(fileId:string)=>Effect.flatMap(Ref.get(files),map=>{const file=map.get(fileId);return file?Effect.succeed(file):Effect.fail(new FileNotFound({fileId}));});
 const service:FileRepositoryService={
  get,
  insert:file=>Effect.as(Ref.update(files,map=>new Map(map).set(file.id,file)),file),
  listByRoom:roomId=>Effect.map(Ref.get(files),map=>[...map.values()].filter(file=>file.roomId===roomId).sort(newest)),
  remove:fileId=>Effect.zipRight(get(fileId),Ref.update(files,map=>{const copy=new Map(map);copy.delete(fileId);return copy;})),
 };
 return service;
});
export const MemoryFileRepository=Layer.effect(FileRepository,makeMemoryRepository);

// ---- Postgres layer (shares the academy schema and pool) --------------------

const COLUMNS='id,room_id AS "roomId",object_key AS "objectKey",filename,content_type AS "contentType",size_bytes AS "sizeBytes",checksum,uploaded_by AS "uploadedBy",created_at AS "createdAt"';

export const makePostgresRepository=(pool:Pool,schema:string)=>{
 if(!/^[a-z][a-z0-9_]{0,62}$/.test(schema))throw new Error('Invalid Academy schema');
 const query=(client:Pool|PoolClient,sql:string,values:unknown[]=[])=>Effect.tryPromise({try:()=>client.query(sql,values),catch:storage});
 const searchPath=`SET LOCAL search_path TO "${schema}"`;
 const transaction=<A,E>(work:(client:PoolClient)=>Effect.Effect<A,E>)=>Effect.acquireUseRelease(
  Effect.tryPromise({try:()=>pool.connect(),catch:storage}),
  client=>Effect.gen(function*(){yield* query(client,'BEGIN');yield* query(client,searchPath);return yield* work(client);}),
  (client,exit)=>Effect.promise(()=>client.query(Exit.isSuccess(exit)?'COMMIT':'ROLLBACK').catch(()=>{}).finally(()=>client.release())),
 );
 const rows=(result:{rows:unknown[]})=>Effect.forEach(result.rows,decode);
 const service:FileRepositoryService={
  insert:file=>transaction(client=>Effect.as(query(client,'INSERT INTO room_files(id,room_id,object_key,filename,content_type,size_bytes,checksum,uploaded_by,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',[file.id,file.roomId,file.objectKey,file.filename,file.contentType,file.sizeBytes,file.checksum,JSON.stringify(file.uploadedBy),file.createdAt]),file)),
  get:fileId=>transaction(client=>Effect.gen(function*(){const found=yield* rows(yield* query(client,`SELECT ${COLUMNS} FROM room_files WHERE id=$1`,[fileId]));return found[0]??(yield* Effect.fail(new FileNotFound({fileId})));})),
  listByRoom:roomId=>transaction(client=>Effect.flatMap(query(client,`SELECT ${COLUMNS} FROM room_files WHERE room_id=$1 ORDER BY created_at DESC`,[roomId]),rows)),
  remove:fileId=>transaction(client=>Effect.flatMap(query(client,'DELETE FROM room_files WHERE id=$1',[fileId]),result=>result.rowCount?Effect.void:Effect.fail(new FileNotFound({fileId})))),
 };
 return service;
};
export const PostgresFileRepository=(pool:Pool,schema:string)=>Layer.succeed(FileRepository,makePostgresRepository(pool,schema));
