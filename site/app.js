import catalogue from './data/catalogue.js';
import {expandDocument} from './data-codec.js';
import {buildModel, findMatches, findRepeated, reference, structureRuns, shebanqUrl, parseSearchValue} from './core.js';
const $ = id => document.getElementById(id);
const PAGE_SIZE = 12, RESULT_PAGE = 25;
const notes = {
  hechrechi:'Standard values: letters count from 1 to 400; final forms keep the ordinary letter value.',
  gadol:'Extended final letters: ך, ם, ן, ף, ץ count as 500, 600, 700, 800, 900.',
  sidduri:'Alphabet positions: letters count from 1 to 22, with final forms sharing their ordinary position.',
  katan:'Reduced letters: reduce each letter’s standard value to one digit, then add them.',
  katan_mispari:'Single digit: repeatedly reduce the standard whole total to one digit.'
};
const state = {data:null, model:null, page:0, mode:null, value:null, selected:null, results:[], shown:RESULT_PAGE, request:0};
function node(tag, text, className) { const n=document.createElement(tag); if(text!==undefined)n.textContent=text; if(className)n.className=className; return n; }
function option(value,label) { const n=node('option',label); n.value=value; return n; }
function settings() { return {method:$('method').value,representation:$('representation').value,reading:$('reading').value}; }
for (const p of catalogue.parashot) $('parasha').append(option(p.id,`${String(p.id).padStart(2,'0')} · ${p.name}`));
for (const m of catalogue.methods) $('method').append(option(m.id,m.label));
function saveSelection() { const q=new URLSearchParams({parasha:$('parasha').value,...settings()}); history.replaceState(null,'',`#${q}`); }
function restoreSelection() {
  const q=new URLSearchParams(location.hash.slice(1));
  for (const id of ['parasha','method','representation','reading']) if ([...$(id).options].some(o=>o.value===q.get(id))) $(id).value=q.get(id);
}
function labelForUnit(unit) {
  const refs = [...new Set(unit.words.map(id=>state.model.words.get(id).verse))].map(id=>state.data.verses.find(v=>v.id===id).ref);
  const first=refs[0],last=refs.at(-1);
  return reference(first)+(refs.length>1?` – ${last[1]}:${last[2]}`:'');
}
function renderText(container, wordIds, hits = new Set(), levels = ['clause','phrase'].filter(kind => $(`show-${kind}s`).checked)) {
  container.replaceChildren();
  if (levels.length) {
    const [kind, ...remaining] = levels;
    for (const run of structureRuns(state.data, wordIds, kind)) {
      const box=node('span',undefined,run.id === null ? '' : `structure-box ${kind}-box`);
      if (run.id !== null) { box.title=`${kind === 'clause' ? 'Clause' : 'Phrase'} ${run.id}`; box.dataset.unit=run.id; }
      renderText(box,run.words,hits,remaining);
      container.append(box,document.createTextNode(' '));
    }
    return;
  }
  const members = new Set(wordIds), emitted=new Set();
  for (const id of wordIds) {
    const word=state.model.words.get(id), token=state.model.wordToken.get(id);
    const complete=token.words.every(w=>members.has(w));
    const form=word.forms[state.model.reading];
    const text=complete ? token.text : form.text;
    if (complete && emitted.has(token.id)) continue;
    if (complete) emitted.add(token.id);
    if (text) {
      const button=node('button',undefined,'word'); button.type='button'; button.dataset.token=token.id;
      button.append(node('span',text));
      button.setAttribute('aria-label',`${token.plain || token.text}, gematria ${token.value ?? 'unavailable'}`);
      button.title=`${token.plain || token.text} = ${token.value ?? 'unavailable'}`;
      if(hits.has(token.id))button.classList.add('match');
      if(state.selected!==null && token.words.includes(state.selected))button.classList.add('selected');
      if(state.model.reading==='qere'&&token.hasQere)button.classList.add('qere');
      if($('show-values').checked)button.append(node('small',token.value??'—'));
      if($('show-glosses').checked && token.gloss) {
        const gloss=node('small',token.gloss,'gloss'); gloss.lang='en'; gloss.dir='ltr'; button.append(gloss);
      }
      container.append(button);
    }
    container.append(document.createTextNode((complete ? token.after : form.after) || ''));
  }
}
function renderReader() {
  const vs=state.data.verses, from=state.page*PAGE_SIZE;
  const fragment=document.createDocumentFragment();
  const highlights=new Set(state.mode==='match'?state.model.tokens.filter(t=>t.value===state.value).map(t=>t.id):[]);
  for(const verse of vs.slice(from,from+PAGE_SIZE)) {
    const article=node('article',undefined,'verse'); article.id=`verse-${verse.id}`;
    const heading=node('div',undefined,'verse-heading');
    const link=node('a','SHEBANQ','shebanq-link');
    link.href=shebanqUrl(verse.ref); link.target='_blank'; link.rel='noopener noreferrer';
    link.setAttribute('aria-label',`Open ${reference(verse.ref)} on SHEBANQ (new tab)`);
    heading.append(node('span',reference(verse.ref),'verse-ref'),link); article.append(heading);
    const line=node('div',undefined,'hebrew'); line.lang='he'; line.dir='rtl'; renderText(line,verse.words,highlights); article.append(line);fragment.append(article);
  }
  $('verses').replaceChildren(fragment);
  $('previous').disabled=state.page===0;$('next').disabled=from+PAGE_SIZE>=vs.length;
  $('page-label').textContent=`Verses ${from+1}–${Math.min(from+PAGE_SIZE,vs.length)} of ${vs.length}`;
  $('verse-jump').value=String(from);
}
function renderSelection(token) {
  $('selection').replaceChildren();
  if(token) {
    const line=node('p'); const hebrew=node('span',token.text,'chosen-word'); hebrew.lang='he'; hebrew.dir='rtl';line.append(hebrew,node('span',token.value??'—','chosen-value'));$('selection').append(line);
    const extra=state.model.representation==='lexeme'?`Dictionary spelling: ${token.plain}. `:'';
    $('selection').append(node('span',extra+`${catalogue.methods.find(m=>m.id===state.model.method).label}. Matching within ${state.data.name}.`,'selection-hint'));
  } else if(state.mode==='repeat') {
    $('selection').append(node('p','Shared values in one passage'),node('span','At least two words with the same value, counted once per word.','selection-hint'));
  } else if(state.mode==='match') $('selection').append(node('p',`Looking for value ${state.value}`));
  else $('selection').append(node('p','Select any word in the text.'),node('span','Its value and matching passages will appear here.','selection-hint'));
}
function renderResults() {
  const fragment=document.createDocumentFragment();
  for(const result of state.results.slice(0,state.shown)) {
    const card=node('article',undefined,'result-card'),top=node('div',undefined,'result-top');
    top.append(node('strong',labelForUnit(result.unit)));
    const jump=node('button','Show in text','quiet');jump.dataset.verse=state.model.words.get(result.unit.words[0]).verse;top.append(jump);card.append(top);
    card.append(node('p',`Value${result.values.length===1?'':'s'}: ${result.values.join(', ')} · ${result.hits.length} matching word${result.hits.length===1?'':'s'}`,'values'));
    const line=node('div',undefined,'hebrew');line.lang='he';line.dir='rtl';renderText(line,result.unit.words,new Set(result.hits.map(t=>t.id)));card.append(line);
    if(result.unit.clipped)card.append(node('p','This unit continues outside the selected parasha; only its text here is searched.','clipped'));
    fragment.append(card);
  }
  $('results').replaceChildren(fragment);$('more').hidden=state.shown>=state.results.length;
  const kind=state.results.length===1?$('unit').value:$('unit').selectedOptions[0].textContent.toLowerCase();
  $('results-title').textContent=state.mode==='repeat'?'Passages with shared values':'Matching passages';
  $('result-summary').textContent=state.mode?`${state.results.length} ${kind} found in ${state.data.name}.${state.results.length>state.shown?` Showing ${state.shown}.`:''}`:'Choose a word or run a search.';
  if(state.mode && !state.results.length)$('results').append(node('p','No matches with these settings. Try another value, method, or passage size.','muted'));
}
function search() {
  state.results=state.mode==='repeat'?findRepeated(state.model,$('unit').value,$('different').checked):state.mode==='match'?findMatches(state.model,state.value,$('unit').value):[];
  state.shown=RESULT_PAGE;renderResults();renderReader();
}
function selectToken(id) {
  const token=state.model.tokens.find(t=>t.id===Number(id));if(!token)return;
  state.selected=token.words[0];state.value=token.value;state.mode='match';$('value').value=token.value??'';
  renderSelection(token);search();
  if(window.innerWidth<761)$('search-title').scrollIntoView({behavior:'smooth',block:'start'});
}
function recalculate() {
  if(!state.data)return;
  state.model=buildModel(state.data,settings());$('method-note').textContent=notes[state.model.method];
  const token=state.selected===null?null:state.model.wordToken.get(state.selected);
  if(token) {state.value=token.value;$('value').value=token.value??'';}
  renderSelection(token);search();saveSelection();
}
async function loadPortion() {
  const request=++state.request, p=catalogue.parashot.find(p=>p.id===Number($('parasha').value));
  $('status').textContent=`Loading ${p.name}…`;$('workspace').hidden=true;$('error').hidden=true;
  try {
    const response=await fetch(new URL(`./data/${p.file}`,import.meta.url));
    if(!response.ok)throw Error(`Data request returned ${response.status}`);
    const raw=await response.json();if(request!==state.request)return;
    const data=expandDocument(raw);
    if(data.schemaVersion!==1||data.id!==p.id)throw Error('Unexpected dataset format');
    Object.assign(state,{data,page:0,mode:null,selected:null,value:null,results:[]});$('value').value='';
    $('portion-title').textContent=p.name;$('portion-hebrew').textContent=p.hebrew;
    $('portion-range').textContent=`${reference(p.range[0])} – ${reference(p.range[1])}`;
    $('portion-stats').textContent=`Portion ${p.id} of 54 · ${p.verses} verses · ${p.words.toLocaleString()} BHSA word units`;
    $('verse-jump').replaceChildren(...data.verses.map((v,i)=>option(i,reference(v.ref))));
    recalculate();$('workspace').hidden=false;$('status').textContent='';
  } catch(error) {
    if(request!==state.request)return;
    $('status').textContent='';$('error').hidden=false;$('error-message').textContent=`Could not load ${p.name}. ${error.message}. Serve the site through a local or static web server; opening index.html as a file is not supported.`;
  }
}
$('parasha').addEventListener('change',loadPortion);$('retry').addEventListener('click',loadPortion);
for(const id of ['method','representation','reading'])$(id).addEventListener('change',recalculate);
for(const id of ['unit','different'])$(id).addEventListener('change',()=>state.model&&search());
$('show-values').addEventListener('change',()=>{if(state.model){renderReader();renderResults();}});
$('show-glosses').addEventListener('change',()=>{if(state.model){renderReader();renderResults();}});
for (const kind of ['phrases','clauses']) $(`show-${kind}`).addEventListener('change',()=>{if(state.model){renderReader();renderResults();}});
$('repeated').addEventListener('click',()=>{state.mode='repeat';state.selected=null;renderSelection();search();});
$('clear').addEventListener('click',()=>{state.mode=null;state.selected=null;state.value=null;$('value').value='';renderSelection();search();});
$('value-form').addEventListener('submit',e=>{e.preventDefault();const v=parseSearchValue($('value').value);if(v===null)return;state.mode='match';state.value=v;state.selected=null;renderSelection();search();});
function turnPage(page){state.page=page;renderReader();$('reader').scrollIntoView({behavior:'smooth',block:'start'});}
$('previous').addEventListener('click',()=>turnPage(Math.max(0,state.page-1)));
$('next').addEventListener('click',()=>turnPage(Math.min(Math.ceil(state.data.verses.length/PAGE_SIZE)-1,state.page+1)));
$('verse-jump').addEventListener('change',()=>{const index=Number($('verse-jump').value);state.page=Math.floor(index/PAGE_SIZE);renderReader();$(`verse-${state.data.verses[index].id}`).scrollIntoView({behavior:'smooth',block:'center'});});
$('more').addEventListener('click',()=>{state.shown+=RESULT_PAGE;renderResults();});
$('workspace').addEventListener('click',e=>{const word=e.target.closest('button[data-token]');if(word){selectToken(word.dataset.token);return;}const jump=e.target.closest('button[data-verse]');if(jump){const i=state.data.verses.findIndex(v=>v.id===Number(jump.dataset.verse));state.page=Math.floor(i/PAGE_SIZE);renderReader();$(`verse-${jump.dataset.verse}`).scrollIntoView({behavior:'smooth',block:'center'});}});
restoreSelection();loadPortion();
