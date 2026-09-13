import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import {createApp} from '../server/app.mjs';

test('browser reads and native suggestion decisions enforce credential and reviewer roles',async()=>{
 const dir=mkdtempSync(path.join(os.tmpdir(),'academy-browser-auth-'));
 const forwarded=[];
 const upstream=http.createServer((req,res)=>{forwarded.push(req.url);req.resume();res.setHeader('content-type','application/json');res.end('{"ok":true}');});
 await new Promise(r=>upstream.listen(0,'127.0.0.1',r));
 const instance=createApp({dir,hostKey:'test-host',proofBase:`http://127.0.0.1:${upstream.address().port}`,root:process.cwd()});
 await new Promise(r=>instance.server.listen(0,'127.0.0.1',r));
 const base=`http://127.0.0.1:${instance.server.address().port}`;
 const request=(route,token,method='GET',asCookie=false)=>fetch(base+route,{method,headers:asCookie?{cookie:`academy=${token}`}:{authorization:`Bearer ${token}`}});
 const jsonRequest=(route,body)=>fetch(base+route,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
 try{
  const host=instance.store.create('Auth room',{slug:'auth-room',editor:'proof-test-token'});
  for(const [route,body] of [['/game/facilitator/overview',{hostKey:'wrong'}],['/game/facilitator/attach',{hostKey:'wrong',roomId:host.roomId}]]){const response=await jsonRequest(route,body);assert.equal(response.status,403);assert.deepEqual(await response.json(),{error:'Ongeldige facilitator-startsleutel.'});}
  const overview=await jsonRequest('/game/facilitator/overview',{hostKey:'test-host'});assert.equal(overview.status,200);assert.ok(Array.isArray(await overview.json()));
  const driver=instance.store.join(host.code,'Driver');
  const navigator=instance.store.join(host.code,'Navigator');
  instance.store.join(host.code,'Third');
  instance.store.join(host.code,'Fourth');
  const {r,p}=instance.store.auth(navigator.token);
  const mcp=instance.store.session(r.id,p.id,'mcp');
  instance.proof.state=async()=>({markdown:'# Document',marks:{}});
  for(const route of ['/game/knowledge','/game/document','/game/starter/README.md']){
   assert.equal((await request(route,mcp)).status,401,route);
   assert.equal((await request(route,navigator.token)).status,200,route);
  }
  for(const decision of ['accept','reject']){
   const route=`/api/agent/auth-room/marks/${decision}`;
   assert.equal((await request(route,navigator.token,'POST',true)).status,403);
   assert.equal((await request(route,mcp,'POST',true)).status,401);
   assert.equal((await request(route,driver.token,'POST',true)).status,200);
   assert.equal((await request(route,host.token,'POST',true)).status,200);
  }
  for(const route of ['/documents/auth-room/ops','/api/agent/auth-room/ops'])assert.equal((await request(route,navigator.token,'POST',true)).status,403);
  assert.equal((await request('/api/documents/auth-room',navigator.token,'PUT',true)).status,200);
  assert.equal((await request('/api/agent/auth-room/marks/comment',navigator.token,'POST',true)).status,200);
  instance.store.control(r,'next');
  assert.equal((await request('/api/agent/auth-room/marks/accept',driver.token,'POST',true)).status,403);
  assert.equal((await request('/api/agent/auth-room/marks/accept',navigator.token,'POST',true)).status,200);
  assert.equal(forwarded.length,7);
 }finally{await new Promise(r=>instance.server.close(r));await new Promise(r=>upstream.close(r));rmSync(dir,{recursive:true,force:true});}
});
