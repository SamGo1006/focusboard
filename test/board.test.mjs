import {test} from 'node:test';
import assert from 'node:assert/strict';
import {addTask,moveTask,removeTask,importBoard,exportBoard,validate} from '../src/board.mjs';
test('add trims titles without mutating input',()=>{const old=[];const next=addTask(old,'  Ship it  ','high','a');assert.equal(old.length,0);assert.equal(next[0].title,'Ship it');});
test('active limit rejects fourth task but permits same-column move',()=>{
  const tasks=['a','b','c','d'].map((id,i)=>({id,title:id,status:i<3?'active':'backlog',priority:'low'}));
  assert.throws(()=>moveTask(tasks,'d','active'),/limited/);
  assert.equal(moveTask(tasks,'a','active').length,4);
  assert.equal(moveTask(tasks,'a','done')[0].status,'done');
});
test('roundtrip backup and delete',()=>{const tasks=addTask([],'Test','medium','a');assert.deepEqual(importBoard(exportBoard(tasks)),tasks);assert.deepEqual(removeTask(tasks,'a'),[]);});
test('invalid backups cannot partially replace data',()=>{
  for(const text of ['{','{}','{"version":2,"tasks":[]}','{"version":1,"tasks":[{}]}'])assert.throws(()=>importBoard(text));
});
test('reject duplicate IDs, blank and long titles',()=>{
  const t={id:'a',title:'ok',status:'backlog',priority:'medium'};
  assert.throws(()=>validate([t,t]));assert.throws(()=>addTask([],'   '));assert.throws(()=>addTask([],'x'.repeat(161)));
});
test('HTML input stays plain data',()=>{assert.equal(addTask([],'<img onerror=alert(1)>','low','x')[0].title,'<img onerror=alert(1)>');});
test('unknown task and invalid status fail',()=>{assert.throws(()=>moveTask([],'x','done'));assert.throws(()=>moveTask([],'x','other'));});
