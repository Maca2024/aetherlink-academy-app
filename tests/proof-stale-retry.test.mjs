import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {Proof} from '../server/proof.mjs';

const listen=server=>new Promise(resolve=>server.listen(0,'127.0.0.1',()=>resolve(`http://127.0.0.1:${server.address().port}`)));
const close=server=>new Promise(resolve=>server.close(resolve));

test('Proof retries projection-stale mutations with the same idempotency key',async()=>{
 let requests=0;const keys=[];
 const server=http.createServer((req,res)=>{
  if(req.url==='/documents/x/bridge/comments'&&req.method==='POST'){requests++;keys.push(req.headers['idempotency-key']);}
  res.setHeader('content-type','application/json');
  if(requests<3){res.statusCode=409;res.end(JSON.stringify({success:false,code:'PROJECTION_STALE',error:'stale'}));return;}
  res.end(JSON.stringify({ok:true}));
 });
 try{
  const baseUrl=await listen(server);
  const proof=new Proof(baseUrl,{staleRetryDelays:[1,1,1]});
  const result=await proof.request('/documents/x/bridge/comments','tok',{by:'t',text:'t',quote:'q'},'idem-1');
  assert.deepEqual(result,{ok:true});
  assert.equal(requests,3);
  assert.deepEqual(keys,['idem-1','idem-1','idem-1']);
 }finally{await close(server);}
});

test('Proof does not retry a different 409 code',async()=>{
 let requests=0;
 const server=http.createServer((req,res)=>{requests++;res.statusCode=409;res.setHeader('content-type','application/json');res.end(JSON.stringify({success:false,code:'STALE_BASE',error:'stale'}));});
 try{
  const baseUrl=await listen(server);
  await assert.rejects(()=>new Proof(baseUrl,{staleRetryDelays:[1,1,1]}).request('/documents/x/bridge/comments','tok',{by:'t',text:'t',quote:'q'},'idem-1'),error=>error.status===409);
  assert.equal(requests,1);
 }finally{await close(server);}
});
