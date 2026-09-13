import pg from 'pg';
import {PostgresStore} from './postgres-store.mjs';
import {Presence} from './presence.mjs';
export async function createStorage({databaseUrl,redisUrl,schema='academy',prefix='academy'}={}){
 if(!databaseUrl||!redisUrl)throw Error('DATABASE_URL and REDIS_URL are required for shared storage');
 const url=new URL(databaseUrl);
 if(!['postgres:','postgresql:'].includes(url.protocol))throw Error('Invalid PostgreSQL URL');
 url.searchParams.delete('sslmode');url.searchParams.delete('channel_binding');
 const pool=new pg.Pool({connectionString:url.href,ssl:{rejectUnauthorized:true},max:8,connectionTimeoutMillis:10000,idleTimeoutMillis:30000,statement_timeout:15000});
 pool.on('error',()=>{});
 let presence;
 try{
  const repository=await new PostgresStore(pool,{schema}).init();
  presence=await new Presence(redisUrl,{prefix}).connect();
  return {repository,presence,close:async()=>{presence.close();await pool.end();}};
 }catch(error){presence?.close();await pool.end();throw error;}
}
