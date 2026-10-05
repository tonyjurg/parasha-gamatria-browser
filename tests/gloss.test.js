import test from 'node:test';
import assert from 'node:assert/strict';
import {buildModel} from '../site/core.js';

test('whole-word glosses follow constituent order and tolerate missing glosses', () => {
  const word = (id, gloss) => ({id, verse:1, gloss, lexeme:'x',
    forms:{ketiv:{start:1,end:3,text:'x',plain:'x',after:''}},
    values:{full_ketiv:[1],word_ketiv:[1]}});
  const data = {methods:['hechrechi'],words:[word(1,'in'),word(2,null),word(3,'beginning')]};
  assert.equal(buildModel(data).tokens[0].gloss, 'in + beginning');
  assert.deepEqual(buildModel(data,{representation:'word'}).tokens.map(t=>t.gloss), ['in','','beginning']);
});
