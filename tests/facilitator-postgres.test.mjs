import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {Pool} from 'pg';
import {PostgresStore} from '../server/postgres-store.mjs';

test('facilitator login persists across instances and cleans up expired sessions',{skip:!process.env.DATABASE_URL},async()=>{
 const url=new URL(process.env.DATABASE_URL);url.searchParams.delete('sslmode');url.searchParams.delete('channel_binding');
 const pool=new Pool({connectionString:url.href,ssl:{rejectUnauthorized:true},connectionTimeoutMillis:10000});
 const schema=`academy_sso_test_${randomUUID().replaceAll('-','')}`;
 const one=new PostgresStore(pool,{schema}),two=new PostgresStore(pool,{schema});
 const identity={sub:'sso-test',email:'test@example.test',name:'Test facilitator',domain:'example.test'};
 try{
  await one.init();await two.init();
  const first=await one.facilitatorLogin(identity);
  assert.deepEqual(await two.facilitator(first),identity);
  await pool.query(`UPDATE "${schema}".facilitator_sessions SET expires_at=$1`,[Date.now()-1000]);
  const second=await two.facilitatorLogin(identity);
  assert.equal(await one.facilitator(first),null);
  assert.deepEqual(await one.facilitator(second),identity);
  assert.equal((await pool.query(`SELECT count(*)::int AS n FROM "${schema}".facilitator_sessions`)).rows[0].n,1);
  await one.facilitatorLogout(second);assert.equal(await two.facilitator(second),null);
 }finally{await pool.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);await pool.end();}
});
