import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createApp} from '../server/app.mjs';

async function invoke(app,method,route,{body={},query={},params={},cookies={},bearer}={}){
 const layer=app.router.stack.find(candidate=>candidate.route?.path===route&&candidate.route.methods[method]);assert.ok(layer,`Missing ${method} ${route}`);
 const response={statusCode:200,headers:{},body:null,text:null};
 const req={method:method.toUpperCase(),body,query,params,headers:{cookie:Object.entries(cookies).map(([k,v])=>`${k}=${v}`).join('; '),...(bearer?{authorization:`Bearer ${bearer}`}:{})}};
 const res={status(s){response.statusCode=s;return this;},json(v){response.body=v;return this;},type(){return this;},set(k,v){response.headers[k.toLowerCase()]=v;return this;},send(v){response.text=v;return this;},end(){return this;}};
 await layer.route.stack[0].handle(req,res,error=>{response.statusCode=error.status||500;response.body={error:error.status?error.message:'Onverwachte serverfout.'};});
 return response;
}
function fixture(){
 const instance=createApp({dir:mkdtempSync(path.join(os.tmpdir(),'academy-slides-')),hostKey:'test-host',publicBaseUrl:'http://127.0.0.1:4317'});
 const host=instance.store.create('Slides',{slug:'slides'});
 const participant=instance.store.join(host.code,'Deelnemer');
 return {instance,host,participant};
}

test('deck routes create, add, patch, export and delete within the squad session',async()=>{
 const {instance,host,participant}=fixture();
 const app=instance.app,cookies={academy:participant.token};
 const created=await invoke(app,'post','/game/decks',{body:{title:'Route deck'},cookies});
 assert.equal(created.statusCode,201);
 const deckId=created.body.id;
 const added=await invoke(app,'post','/game/decks/:deckId/slides',{body:{heading:'Eén',body:['a']},params:{deckId},cookies});
 assert.equal(added.statusCode,201);
 const listed=await invoke(app,'get','/game/decks',{cookies:{academy:host.token}});
 assert.equal(listed.body.decks[0].slideCount,1);
 const edited=await invoke(app,'patch','/game/decks/:deckId/slides/:slideId',{body:{edits:[{find:'Eén',replace:'Twee',expectedMatches:1}]},params:{deckId,slideId:added.body.slide.id},cookies});
 assert.equal(edited.statusCode,200);assert.equal(edited.body.changed,true);
 const bad=await invoke(app,'patch','/game/decks/:deckId',{body:{operations:[{op:'reorder-slides',slideIds:['nope']}]},params:{deckId},cookies});
 assert.equal(bad.statusCode,400);
 const exported=await invoke(app,'get','/game/decks/:deckId/export.html',{params:{deckId},cookies:{academy:host.token}});
 assert.equal(exported.statusCode,200);assert.match(exported.text,/Twee/);assert.match(exported.headers['content-disposition'],/route-deck\.html/);
 const forbidden=await invoke(app,'delete','/game/decks/:deckId',{params:{deckId},cookies:{academy:instance.store.join(host.code,'Ander').token}});
 assert.equal(forbidden.statusCode,403);
 const deleted=await invoke(app,'delete','/game/decks/:deckId',{params:{deckId},cookies:{academy:host.token}});
 assert.equal(deleted.statusCode,200);
 const gone=await invoke(app,'get','/game/decks/:deckId',{params:{deckId},cookies});
 assert.equal(gone.statusCode,404);
 const anonymous=await invoke(app,'get','/game/decks',{});
 assert.equal(anonymous.statusCode,401);
});

test('MCP deck tools run as the participant and register lastMcp',async()=>{
 const {instance,participant}=fixture();
 const app=instance.app;
 const mcp=await instance.store.rotateMcpToken(participant.token);
 const created=await invoke(app,'post','/game/mcp/:tool',{params:{tool:'create_deck'},body:{title:'Via MCP'},bearer:mcp.token});
 assert.equal(created.statusCode,200,JSON.stringify(created.body));
 const added=await invoke(app,'post','/game/mcp/:tool',{params:{tool:'add_slide'},body:{deckId:created.body.id,heading:'Agent',body:['x']},bearer:mcp.token});
 assert.equal(added.body.slide.textPreview,'Agent x');
 const listed=await invoke(app,'post','/game/mcp/:tool',{params:{tool:'list_decks'},body:{},bearer:mcp.token});
 assert.equal(listed.body.decks[0].createdBy.name,'Deelnemer');
 const html=await invoke(app,'post','/game/mcp/:tool',{params:{tool:'export_deck_html'},body:{deckId:created.body.id},bearer:mcp.token});
 assert.match(html.body.html,/<!DOCTYPE html>/);
 const {p}=instance.store.auth(mcp.token,'mcp');assert.ok(p.lastMcp);
 const browserToken=await invoke(app,'post','/game/mcp/:tool',{params:{tool:'list_decks'},body:{},bearer:participant.token});
 assert.equal(browserToken.statusCode,401);
});
