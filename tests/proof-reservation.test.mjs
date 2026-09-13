import {test} from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';

test('durable mutation reservations fence concurrent owners and retain replay status',{skip:process.env.ACADEMY_POSTGRES_TEST!=='1'},async()=>{
 const schema=`proof_reservation_${randomUUID().replaceAll('-','')}`;
 process.env.PROOF_DATABASE_SCHEMA=schema;
 const db=await import('../vendor/proof-sdk/server/db-postgres.ts');
 const api=await import('../vendor/proof-sdk/server/mutation-idempotency.ts');
 try{
  await db.initializeDatabase();
  await db.getDb().query("INSERT INTO documents(slug,markdown,created_at,updated_at) VALUES ('doc','hello','2026-09-13','2026-09-13')");
  const args={documentSlug:'doc',slug:'doc',route:'test',mutationRoute:'test',subsystem:'test',idempotencyKey:'race',requestHash:'same'};
  const results=await Promise.all(Array.from({length:8},()=>api.beginMutationReservation(args)));
  assert.equal(results.filter(r=>r.kind==='execute').length,1);
  assert.equal(results.filter(r=>r.kind==='in_progress').length,7);
  const owner=results.find(r=>r.kind==='execute').reservation;
  assert.equal((await api.beginMutationReservation({...args,requestHash:'other'})).kind,'mismatch');
  await assert.rejects(api.completeMutationReservation({...owner,ownerToken:'wrong'},{ok:true},201),/ownership/);
  await api.completeMutationReservation(owner,{ok:true},201);
  assert.deepEqual(await api.beginMutationReservation(args),{kind:'replay',statusCode:201,response:{ok:true}});
  const expired={...args,idempotencyKey:'expired',leaseMs:-1};
  const pending=await api.beginMutationReservation(expired);assert.equal(pending.kind,'execute');
  assert.equal((await api.beginMutationReservation(expired)).kind,'result_unknown');
  await api.completeMutationReservation(pending.reservation,{late:true},202);
  assert.deepEqual(await api.beginMutationReservation(expired),{kind:'replay',statusCode:202,response:{late:true}});
  const releasedArgs={...args,idempotencyKey:'released'};
  const released=await api.beginMutationReservation(releasedArgs);
  await api.releaseMutationReservation(released.reservation);
  assert.equal((await api.beginMutationReservation(releasedArgs)).kind,'execute');
 }finally{
  await db.getDb().query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await db.closeDatabase();
 }
});
