import {Store,hash,fail} from './store.mjs';
export class LocalStore extends Store {
 constructor(dir){super(dir);this.queue=Promise.resolve();}
 async locked(fn){
  const run=this.queue.then(async()=>{const before=structuredClone(this.data);try{const result=await fn();this.save();return result;}catch(error){this.data=before;throw error;}});
  this.queue=run.catch(()=>{});return run;
 }
 withSession(token,kind,fn){return this.locked(()=>fn(this.auth(token,kind)));}
 logout(token){return this.locked(()=>{this.auth(token,'browser');delete this.data.sessions[hash(token)];});}
 rotateMcpToken(token){return this.locked(()=>{const {r,p}=this.auth(token,'browser');if(!p)fail(403,'Gebruik hiervoor een deelnemerssessie.');for(const [key,s] of Object.entries(this.data.sessions))if(s.roomId===r.id&&s.personId===p.id&&s.kind==='mcp')delete this.data.sessions[key];return {token:this.session(r.id,p.id,'mcp')};});}
 reserveRequest(token,kind,requestId,payloadHash,intent,validate=()=>{}){return this.withSession(token,undefined,async context=>{const {r,s}=context;const key=JSON.stringify([s.personId,kind,requestId]);r.requests??={};const old=r.requests[key];if(old){if(old.payloadHash!==payloadHash)fail(409,'Dit verzoeknummer is al gebruikt met andere invoer.');return old;}await validate(context);return r.requests[key]={payloadHash,intent,result:null,completed:false};});}
 completeRequest(token,kind,requestId,payloadHash,apply){return this.withSession(token,undefined,async context=>{const key=JSON.stringify([context.s.personId,kind,requestId]);const request=context.r.requests?.[key];if(!request)fail(404,'Verzoek niet gevonden.');if(request.payloadHash!==payloadHash)fail(409,'Dit verzoeknummer is al gebruikt met andere invoer.');if(request.completed)return request.result;request.result=await apply(context,request.intent);request.completed=true;return request.result;});}
}
