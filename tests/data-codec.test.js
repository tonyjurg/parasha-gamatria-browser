import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {expandDocument} from '../site/data-codec.js';

test('all 54 compact files decode to exactly the original export, including all text and values', () => {
  const report=JSON.parse(readFileSync(new URL('../docs/compaction-report.json',import.meta.url)));
  assert.equal(report.length,54);
  for (const entry of report) {
    const raw=JSON.parse(readFileSync(new URL(`../site/data/${entry.file}`,import.meta.url)));
    assert.equal(raw.schemaVersion,2);
    const decoded=expandDocument(raw);
    const hash=createHash('sha256').update(JSON.stringify(decoded)+'\n').digest('hex');
    assert.equal(hash,entry.originalSha256,entry.file);
  }
});

test('shared forms and values are independent after decoding; old schemas remain supported', () => {
  const raw=JSON.parse(readFileSync(new URL('../site/data/01.json',import.meta.url)));
  const decoded=expandDocument(raw), w=decoded.words.find(w=>!w.hasQere);
  assert.notEqual(w.forms.ketiv,w.forms.qere);
  assert.notEqual(w.values.word_ketiv,w.values.word_qere);
  assert.equal(expandDocument(decoded),decoded);
  assert.throws(()=>expandDocument({schemaVersion:99}),/Unsupported/);
});
