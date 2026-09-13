import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {createRequire} from 'node:module';
const require=createRequire(new URL('../vendor/proof-sdk/package.json',import.meta.url));const {HocuspocusProvider,HocuspocusProviderWebsocket}=require('@hocuspocus/provider');const Y=require('yjs');const WS=require('ws');
const base=process.env.ACADEMY_URL||'http://127.0.0.1:4317';
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function until(fn){for(let i=0;i<100;i++){if(await fn())return;await delay(50);}throw Error('Collaboration did not converge within 5 seconds');}
async function call(p,body,token){const res=await fetch(base+'/game/'+p,{method:body?'POST':'GET',headers:{'content-type':'application/json',...(token?{authorization:'Bearer '+token}: {})},body:body?JSON.stringify(body):undefined});const d=await res.json();assert(res.ok,JSON.stringify(d));return d;}
async function client(token,slug){const d=await(await fetch(`${base}/api/documents/${slug}/collab-session`,{headers:{cookie:'academy='+token,'x-proof-client-version':'0.30.0','x-proof-client-build':'academy-test','x-proof-client-protocol':'3'}})).json();assert(d.session);const s=d.session;const url=new URL(s.collabWsUrl);url.search='';class AuthedWS extends WS{constructor(u){super(u,{headers:{cookie:'academy='+token}});}}const socket=new HocuspocusProviderWebsocket({url:url.toString(),parameters:{token:s.token,role:s.role,slug},WebSocketPolyfill:AuthedWS});const doc=new Y.Doc();const provider=new HocuspocusProvider({websocketProvider:socket,name:slug,document:doc,token:s.token});await until(()=>provider.isSynced);return {doc,provider,socket,close(){provider.destroy();socket.destroy();doc.destroy();}};}
test('two independent Proof Yjs clients merge concurrent document edits and reconnect', {timeout:20000},async()=>{
 const host=await call('create',{name:'Concurrency '+Date.now(),hostKey:process.env.ACADEMY_HOST_KEY||readFileSync('.data/host-key','utf8')});const p1=await call('join',{code:host.code,name:'Editor A'});const p2=await call('join',{code:host.code,name:'Editor B'});const {documentSlug:slug}=await call('state',null,p1.token);
 const a=await client(p1.token,slug);const b=await client(p2.token,slug);let c;
 try{const key='prosemirror';assert(a.doc.getXmlFragment(key).length,'Actual Proof ProseMirror fragment must exist');const f1=a.doc.getXmlFragment(key);const f2=b.doc.getXmlFragment(key);
 const text1=f1.toArray()[0].toArray()[0],text2=f2.toArray()[0].toArray()[0];assert(text1 instanceof Y.XmlText);assert(text2 instanceof Y.XmlText);
 a.doc.transact(()=>text1.insert(text1.length,' ALPHA'),'human:test-a');b.doc.transact(()=>text2.insert(text2.length,' BETA'),'human:test-b');await until(()=>f1.toString()===f2.toString()&&f1.toString().includes('ALPHA')&&f1.toString().includes('BETA'));
 await until(async()=>{const d=await call('document',null,p1.token);return d.markdown.includes('ALPHA')&&d.markdown.includes('BETA');});
 b.close();c=await client(p2.token,slug);assert.equal(c.doc.getXmlFragment(key).toString(),f1.toString());
 const other=await call('create',{name:'Foreign',hostKey:process.env.ACADEMY_HOST_KEY||readFileSync('.data/host-key','utf8')});const foreign=(await call('state',null,other.token)).documentSlug;
 const rejected=await new Promise(resolve=>{const ws=new WS(base.replace('http','ws')+'/ws?slug='+foreign,{headers:{cookie:'academy='+p1.token}});ws.on('unexpected-response',(_req,r)=>{resolve(r.statusCode);ws.terminate();});ws.on('error',()=>{});});assert.equal(rejected,403);
 }finally{a.close();if(c)c.close();else b.close();}
});
