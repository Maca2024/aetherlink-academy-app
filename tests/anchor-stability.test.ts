import {test} from 'node:test';
import assert from 'node:assert/strict';
import {resolveAnchorTarget,stabilizeAnchorTarget} from '../vendor/proof-sdk/server/anchor-resolver.ts';
test('stabilized duplicate anchor survives unrelated earlier insertion and rejects new ambiguity',()=>{
 const source='Title\nRepeat\nContext target\nRepeat';
 const requested={anchor:'Repeat',occurrence:1};
 const selected=resolveAnchorTarget(source,requested,{failClosedDuplicates:true});
 assert.ok(selected.ok);
 const stable=stabilizeAnchorTarget(source,requested,selected);
 assert.equal(stable.occurrence,undefined);
 const moved='Title\nRepeat\nRepeat\nContext target\nRepeat';
 const resolved=resolveAnchorTarget(moved,stable,{failClosedDuplicates:true});
 assert.ok(resolved.ok);
 assert.equal(resolved.selection.logicalStart,moved.lastIndexOf('Repeat'));
 const ambiguous=resolveAnchorTarget(moved+'\nContext target\nRepeat',stable,{failClosedDuplicates:true});
 assert.equal(ambiguous.ok,false);
 if(!ambiguous.ok)assert.equal(ambiguous.code,'ANCHOR_AMBIGUOUS');
});
