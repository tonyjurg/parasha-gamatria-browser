import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildModel,findMatches,findRepeated,unitsFor} from '../site/core.js';
import {expandDocument} from '../site/data-codec.js';
const document = expandDocument(JSON.parse(readFileSync(new URL('../site/data/01.json',import.meta.url))));

test('Genesis 1:1 contains seven whole words with known standard values',()=>{
  const model=buildModel(document);
  const verse=unitsFor(model,'verse')[0];
  assert.deepEqual(verse.tokens.map(t=>t.value),[913,203,86,401,395,407,296]);
  assert.equal(verse.tokens.reduce((s,t)=>s+t.value,0),2701);
  assert.deepEqual(verse.tokens[0].words,[1,2]);
});
test('parts and dictionary form are distinct selectable representations',()=>{
  const parts=buildModel(document,{representation:'word'});
  assert.equal(parts.tokens[0].value,2);assert.equal(parts.tokens[1].value,911);
  assert.equal(buildModel(document,{representation:'lexeme'}).tokens.length,document.words.length);
});
test('all methods use the exported TF values',()=>{
  for(const method of document.methods)for(const reading of ['ketiv','qere'])for(const representation of ['word','full','lexeme']) {
    const model=buildModel(document,{method,reading,representation});
    const key=representation==='lexeme'?'lexeme':`${representation}_${reading}`;
    for(const token of model.tokens)assert.equal(token.value,model.words.get(token.words[0]).values[key][document.methods.indexOf(method)]);
  }
});
test('click-equivalent matching finds all and only matching verses',()=>{
  const model=buildModel(document), found=findMatches(model,26);
  const expected=unitsFor(model,'verse').filter(v=>v.tokens.some(t=>t.value===26&&t.plain&&t.text));
  assert.deepEqual(found.map(r=>r.unit.id),expected.map(v=>v.id));
  assert.ok(found.length>0);assert.ok(found.every(r=>r.hits.every(t=>t.value===26)));
});
test('repeated search works at each structural level and deduplicates whole words',()=>{
  const model=buildModel(document);
  for(const kind of ['verse','sentence','clause','phrase'])for(const different of [false,true]) {
    for(const result of findRepeated(model,kind,different)) {
      assert.equal(new Set(result.hits.map(t=>t.id)).size,result.hits.length);
      for(const value of result.values) {
        const hits=result.hits.filter(t=>t.value===value);
        assert.ok(hits.length>=2);
        if(different)assert.ok(new Set(hits.map(t=>t.plain)).size>=2);
      }
    }
  }
});
test('a prefix and its parent word are not two whole-word occurrences',()=>{
  const clone=structuredClone(document);
  clone.verses=[{id:1,ref:['Genesis',1,1],words:[1,2]}];clone.words=clone.words.filter(w=>w.id<=2);
  assert.equal(findRepeated(buildModel(clone),'verse').length,0);
});
test('whole words split by a phrase boundary are not counted in either phrase',()=>{
  const clone=structuredClone(document);clone.units.phrase=[{id:1,words:[1],clipped:false},{id:2,words:[2],clipped:false}];
  assert.equal(findMatches(buildModel(clone),913,'phrase').length,0);
  assert.equal(findMatches(buildModel(clone,{representation:'word'}),2,'phrase').length,1);
});
test('same spelling repeats count unless different spellings are required',()=>{
  const clone=structuredClone(document);clone.words=clone.words.slice(0,2);
  clone.words.forEach(w=>{w.lexeme='א';w.values.lexeme=[1,1,1,1,1];});
  clone.verses=[{id:1,ref:['Genesis',1,1],words:[1,2]}];
  const model=buildModel(clone,{representation:'lexeme'});
  assert.equal(findRepeated(model,'verse').length,1);assert.equal(findRepeated(model,'verse',true).length,0);
});
test('null values and empty readings never produce false matches',()=>{
  const clone=structuredClone(document);clone.words=clone.words.slice(0,2);
  clone.words.forEach(w=>{w.values.word_qere=[null,0,0,0,0];w.forms.qere.text='';w.forms.qere.plain='';});
  clone.verses=[{id:1,ref:['Genesis',1,1],words:[1,2]}];
  const model=buildModel(clone,{representation:'word',reading:'qere'});
  assert.deepEqual(findMatches(model,null),[]);assert.deepEqual(findRepeated(model),[]);
});
test('unknown options fail explicitly',()=>{
  assert.throws(()=>buildModel(document,{method:'unknown'}));
  assert.throws(()=>unitsFor(buildModel(document),'unknown'));
});

test('the recorded qere in Genesis 8:17 changes the text and value',()=>{
  const noach=expandDocument(JSON.parse(readFileSync(new URL('../site/data/02.json',import.meta.url))));
  const ketiv=buildModel(noach), qere=buildModel(noach,{reading:'qere'});
  const verse=noach.verses.find(v=>v.ref[1]===8&&v.ref[2]===17);
  const written=unitsFor(ketiv,'verse').find(v=>v.id===verse.id).tokens.find(t=>t.plain==='הוצא');
  assert.equal(written.value,102);
  const read=qere.wordToken.get(written.words[0]);
  assert.equal(read.plain,'היצא');assert.equal(read.value,106);assert.ok(read.hasQere);
  assert.notEqual(written.text,read.text);
});
