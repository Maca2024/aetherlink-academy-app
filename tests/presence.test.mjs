import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {Presence} from '../server/presence.mjs';
test('Redis presence is shared and expires without persistent roster writes',{skip:process.env.ACADEMY_POSTGRES_TEST!=='1'},async()=>{
 const prefix='academy_test_'+randomUUID().replaceAll('-','');
 const one=new Presence(process.env.REDIS_URL,{prefix,ttl:1}),two=new Presence(process.env.REDIS_URL,{prefix,ttl:1});
 try{await Promise.all([one.connect(),two.connect()]);await one.touch('room','person');assert.deepEqual([...await two.members('room',['person','absent'])],['person']);assert.deepEqual([...await two.members('foreign',['person'])],[]);await new Promise(r=>setTimeout(r,1150));assert.deepEqual([...await two.members('room',['person'])],[]);}finally{one.close();two.close();}
});
