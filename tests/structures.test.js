import test from 'node:test';
import assert from 'node:assert/strict';
import {structureRuns} from '../site/core.js';

test('discontinuous structures and clipped text preserve exact membership and order', () => {
  const data={units:{clause:[{id:10,words:[1,2,5]},{id:11,words:[3,4]}]}};
  assert.deepEqual(structureRuns(data,[1,2,3,4,5,6],'clause'),[
    {id:10,words:[1,2]},{id:11,words:[3,4]},{id:10,words:[5]},{id:null,words:[6]}
  ]);
  assert.deepEqual(structureRuns(data,[2,3],'clause'),[{id:10,words:[2]},{id:11,words:[3]}]);
});
