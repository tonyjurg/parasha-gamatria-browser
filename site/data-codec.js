const REPRESENTATIONS = ['lexeme','word_ketiv','word_qere','full_ketiv','full_qere'];

export function expandDocument(doc) {
  if (doc.schemaVersion === 1) return doc;
  if (doc.schemaVersion !== 2) throw Error('Unsupported dataset schema');
  const strings=doc.strings;
  const forms=doc.forms.map(f=>({text:strings[f[0]],after:strings[f[1]],plain:strings[f[2]],start:f[3],end:f[4]}));
  return {schemaVersion:1,id:doc.id,name:doc.name,hebrew:doc.hebrew,methods:doc.methods,range:doc.range,
    words:doc.words.map(w=>({id:w[0],verse:w[1],lexeme:strings[w[2]],gloss:strings[w[3]],
      hasQere:Boolean(w[4]),error:strings[w[5]],forms:{ketiv:{...forms[w[6]]},qere:{...forms[w[7]]}},
      values:Object.fromEntries(REPRESENTATIONS.map((rep,i)=>[rep,[...doc.values[w[8][i]]]]))})),
    verses:doc.verses.map(v=>({id:v[0],ref:v[1],words:v[2],sourceParashaVerse:v[3]})),
    units:Object.fromEntries(Object.entries(doc.units).map(([kind,units])=>[kind,units.map(u=>({id:u[0],words:u[1],clipped:Boolean(u[2])}))]))
  };
}
