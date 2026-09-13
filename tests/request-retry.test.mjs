import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import http from 'node:http';
import {createApp} from '../server/app.mjs';
import {PostgresStore} from '../server/postgres-store.mjs';

const listen=server=>new Promise(resolve=>server.listen(0,'127.0.0.1',()=>resolve(`http://127.0.0.1:${server.address().port}`)));
const close=server=>new Promise(resolve=>{server.closeAllConnections();server.close(resolve);});
test('Proof retries retain intent across heading changes and driver rotation',{skip:process.env.ACADEMY_POSTGRES_TEST!=='1'},async()=>{
 const {Pool}=await import('pg');
 const url=new URL(process.env.DATABASE_URL);url.searchParams.delete('sslmode');url.searchParams.delete('channel_binding');
 const pool=new Pool({connectionString:url.href,ssl:{rejectUnauthorized:true},max:5,connectionTimeoutMillis:10000});
 const schema=`academy_retry_${randomUUID().replaceAll('-','')}`;
 const one=new PostgresStore(pool,{schema}),two=new PostgresStore(pool,{schema});
 const dir=await mkdtemp(path.join(tmpdir(),'academy-retry-'));
 let heading='Original heading',afterComment=async()=>{};
 const bodies=new Map();let mutations=0;
 const fake=http.createServer(async(req,res)=>{
  res.setHeader('content-type','application/json');
  if(req.method==='GET'){res.end(JSON.stringify({markdown:'# '+heading,marks:{}}));return;}
  let body='';for await(const chunk of req)body+=chunk;
  const key=req.headers['idempotency-key'];
  if(bodies.has(key)&&bodies.get(key)!==body){res.statusCode=409;res.end('{}');return;}
  if(!bodies.has(key)){bodies.set(key,body);mutations++;}
  await afterComment();res.end('{}');
 });
 const servers=[fake];
 try {
  await one.init();
  const proofBase=await listen(fake);
  const apps=[one,two].map(repository=>createApp({dir,repository,proofBase,hostKey:'test'}));servers.push(...apps.map(app=>app.server));
  const bases=await Promise.all(apps.map(app=>listen(app.server)));
  const request=async(index,route,token,body,status=200)=>{
   const response=await fetch(bases[index]+'/game/'+route,{method:'POST',headers:{authorization:`Bearer ${token}`,'content-type':'application/json'},body:JSON.stringify(body)});
   const value=await response.json();assert.equal(response.status,status,JSON.stringify(value));return value;
  };
  const host=await one.create('Retries',{slug:'test',editor:'editor',commenter:'commenter'});
  const people=[];for(let i=0;i<4;i++)people.push(await one.join(host.code,'Person '+i));
  const evidence={requestId:'evidence-1',finding:'finding',command:'test',observed:'passed',limitation:'limited'};
  const complete=one.completeRequest.bind(one);let failOnce=true;
  one.completeRequest=async(...args)=>{if(failOnce){failOnce=false;throw Error('simulated completion failure');}return complete(...args);};
  await request(0,'evidence',people[1].token,evidence,500);
  heading='Changed heading';
  const mcp=await two.rotateMcpToken(people[1].token);
  const item=await request(1,'mcp/submit_evidence',mcp.token,evidence);
  assert.equal(mutations,1);assert.equal((await one.auth(host.token)).r.evidence.length,1);
  await request(1,'evidence',people[1].token,{...evidence,finding:'different'},409);
  const review={requestId:'review-1',id:item.id,status:'accepted',note:'verified'};
  afterComment=async()=>{afterComment=async()=>{};await two.control(host.token,'next');};
  await request(0,'review',people[0].token,review);
  assert.equal((await two.auth(host.token)).r.evidence[0].status,'accepted');
  await request(1,'review',people[0].token,review);
  assert.equal(mutations,2);
  await request(1,'review',people[0].token,{...review,requestId:'unauthorized-new'},403);
  const handoff={requestId:'handoff-1',decision:'decision',checked:'checked',open:'open'};
  afterComment=async()=>{afterComment=async()=>{};await two.control(host.token,'next');};
  await request(0,'handoff',people[1].token,handoff);
  await request(1,'handoff',people[1].token,handoff);
  assert.equal(mutations,3);assert.equal((await one.auth(host.token)).r.handoffs.length,1);
  const {requestId,...missing}=handoff;await request(1,'handoff',people[2].token,missing,400);
 }finally{
  await Promise.all(servers.filter(server=>server.listening).map(close));
  await pool.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);await pool.end();await rm(dir,{recursive:true,force:true});
 }
});
