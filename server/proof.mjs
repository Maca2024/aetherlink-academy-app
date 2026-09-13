import {fail} from './store.mjs';
export class Proof {
 constructor(base){this.base=base;}
 async request(route,token,body,key){const res=await fetch(this.base+route,{method:body?'POST':'GET',headers:{'content-type':'application/json','x-proof-client-version':'0.30.0','x-proof-client-build':'academy-proof-fb257875','x-proof-client-protocol':'3',...(token?{authorization:`Bearer ${token}`} :{}),...(key?{'Idempotency-Key':key}:{})},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(18000)});const text=await res.text();let data;try{data=JSON.parse(text);}catch{fail(502,`Proof gaf geen JSON (${res.status}).`);}if(!res.ok)fail(res.status,`Proof: ${JSON.stringify(data).slice(0,700)}`);return data;}
 async create(markdown,title){markdown=markdown.replace(/^(#{1,6} .+)\n(?=\S)/gm,'$1\n\n');const d=await this.request('/documents',null,{markdown,title,role:'editor'});const c=await this.request(`/documents/${d.slug}/access-links`,d.ownerSecret,{role:'commenter'});return {slug:d.slug,owner:d.ownerSecret,editor:d.accessToken,commenter:c.accessToken};}
 state(r){return this.request(`/documents/${r.proof.slug}/state`,r.proof.editor);}
 async comment(r,by,text,quote,key){if(!quote){const state=await this.state(r);quote=state.markdown.split('\n').find(line=>line.trim()).replace(/^#+\s*/,'').trim();}return this.request(`/documents/${r.proof.slug}/bridge/comments`,r.proof.commenter,{by,text,quote},key);}
 suggest(r,by,quote,content,key){return this.request(`/documents/${r.proof.slug}/bridge/suggestions`,r.proof.commenter,{by,kind:'replace',quote,content},key);}
}
