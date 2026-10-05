// Pure search functions shared by the browser and Node's built-in test runner.
export function parseSearchValue(input) {
  if (typeof input !== 'string' || !/^[0-9]+$/.test(input.trim())) return null;
  const value = Number(input.trim());
  return Number.isSafeInteger(value) ? value : null;
}

export function buildModel(data, {method = 'hechrechi', representation = 'full', reading = 'ketiv'} = {}) {
  const index = data.methods.indexOf(method);
  if (index < 0 || !['full','word','lexeme'].includes(representation) || !['ketiv','qere'].includes(reading)) throw Error('Unsupported selection');
  const key = representation === 'lexeme' ? 'lexeme' : `${representation}_${reading}`;
  const words = new Map(data.words.map(w => [w.id,w]));
  const grouped = new Map();
  for (const word of data.words) {
    const group = representation === 'full' ? word.forms[reading].start : word.id;
    if (!grouped.has(group)) grouped.set(group,[]);
    grouped.get(group).push(word);
  }
  const tokens = [], wordToken = new Map();
  for (const [id, members] of grouped) {
    const forms = members.map(w => w.forms[reading]);
    const text = forms.map((f,i) => (f.text ?? '') + (i < forms.length-1 ? f.after : '')).join('');
    const plain = representation === 'lexeme' ? members[0].lexeme : forms.map(f => f.plain ?? '').join('');
    const token = {id, words:members.map(w => w.id), verse:members[0].verse, text, plain,
      gloss:members.map(w => w.gloss).filter(g => typeof g === 'string' && g.trim()).join(' + '),
      after:forms.at(-1).after, value:members[0].values[key][index], hasQere:members.some(w=>w.hasQere)};
    tokens.push(token);
    members.forEach(w => wordToken.set(w.id,token));
  }
  return {data,words,tokens,wordToken,reading,representation,method};
}

export function unitsFor(model, kind = 'verse') {
  const units = kind === 'verse' ? model.data.verses : model.data.units[kind];
  if (!units) throw Error('Unknown unit type');
  return units.map(unit => {
    const members = new Set(unit.words);
    // A whole word spanning two phrases cannot count as a complete word in either.
    const tokens = [...new Set(unit.words.map(w => model.wordToken.get(w)))].filter(t => t && t.words.every(w => members.has(w)));
    return {...unit, tokens};
  });
}

function usable(token) { return Number.isInteger(token.value) && token.value >= 0 && token.plain && token.text; }

export function findMatches(model, value, kind = 'verse') {
  if (!Number.isSafeInteger(value) || value < 0) return [];
  return unitsFor(model,kind).flatMap(unit => {
    const hits = unit.tokens.filter(t => usable(t) && t.value === value);
    return hits.length ? [{unit, hits, values:[value]}] : [];
  });
}

export function findRepeated(model, kind = 'verse', differentOnly = false) {
  return unitsFor(model,kind).flatMap(unit => {
    const groups = new Map();
    for (const token of unit.tokens.filter(usable)) {
      if (!groups.has(token.value)) groups.set(token.value,[]);
      groups.get(token.value).push(token);
    }
    const repeated = [...groups].filter(([,ts]) => ts.length >= 2 && (!differentOnly || new Set(ts.map(t=>t.plain)).size >= 2));
    return repeated.length ? [{unit, hits:repeated.flatMap(([,ts])=>ts), values:repeated.map(([v])=>v).sort((a,b)=>a-b)}] : [];
  });
}

export function reference(ref) { return `${ref[0]} ${ref[1]}:${ref[2]}`; }

export function shebanqUrl([book, chapter, verse]) {
  const params = new URLSearchParams({version:'2021', book, chapter:String(chapter), verse:String(verse), mr:'m', tr:'hb', tp:'txt_p'});
  return `https://shebanq.ancient-data.org/hebrew/text?${params}`;
}

// Split discontinuous annotations into separate visible runs without enclosing intervening words.
export function structureRuns(data, wordIds, kind) {
  const membership = new Map();
  for (const unit of data.units[kind] || []) for (const id of unit.words) membership.set(id, unit.id);
  const runs = [];
  for (const id of wordIds) {
    const unit = membership.get(id) ?? null;
    if (!runs.length || runs.at(-1).id !== unit) runs.push({id:unit, words:[]});
    runs.at(-1).words.push(id);
  }
  return runs;
}
