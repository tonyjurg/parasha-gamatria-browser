# Parasha JSON format: schema 2

Files use compact rows and shared lookup tables. No gloss, numerical value,
qere distinction, or boundary is discarded. `schemaVersion` is `2`; top-level
`id`, `name`, `hebrew`, `range`, and `methods` retain their original meaning.
All lookup indexes are zero-based and local to each portion.

| Table | Row layout |
|---|---|
| `strings` | Shared strings, including distinct `null` and empty-string entries |
| `forms` | `[textIndex, afterIndex, plainIndex, startWordId, endWordId]` |
| `values` | Five numbers in `methods` order; missing values remain `null` |
| `words` | `[id, verseId, lexemeIndex, glossIndex, hasQere, errorIndex, ketivFormIndex, qereFormIndex, valueIndexes]` |
| `verses` | `[id, [book, chapter, verse], wordIds, sourceParashaVerse]` |
| `units.sentence`, `units.clause`, `units.phrase` | `[id, wordIds, clipped]` |

`hasQere` and `clipped` are `0`/`1`. String indexes refer to `strings`; form
indexes refer to `forms`. `valueIndexes` contains five indexes into `values`,
ordered as `lexeme`, `word_ketiv`, `word_qere`, `full_ketiv`, `full_qere`.
Equal forms and values share table rows. Identical ketiv/qere forms can use the
same index; explicit empty readings remain distinct from absent qere.

## Decode to readable records

```python
import json
from data_codec import expand_document
document = expand_document(json.loads(path.read_text(encoding='utf-8')))
print(document['words'][0]['gloss'])
```

The browser uses `expandDocument` from `site/data-codec.js`. Both helpers accept
schema 1 and schema 2, returning the readable schema-1 model below. Expansion is
idempotent: an already-readable schema-1 document is returned unchanged (the
same object), not decoded again. Decoded forms and value arrays are independent
objects, even when stored once.

The lifecycle is **readable schema 1 -> compact schema 2 -> readable schema 1**.
The exporter builds schema 1 internally; all 54 committed JSON files and the
catalogue use schema 2. These version numbers describe different representations,
not conflicting dataset revisions. Tests verify this contract for every file.

## Readable Model (Schema 1)

Every file describes one BHSaddons portion. Node IDs remain BHSA 2021 IDs; they are not array offsets.

| Field | Meaning |
|---|---|
| `id`, `name`, `hebrew` | BHSaddons portion number and names |
| `range` | First and last verse, as `[book, chapter, verse]` |
| `methods` | Order of all five values in every numerical array |
| `verses` | Verse nodes, references and ordered word IDs; `sourceParashaVerse` preserves the source counter or `null` |
| `words` | Ordered BHSA word-unit records |
| `units` | Sentence, clause and phrase nodes with explicit word-ID membership and a `clipped` flag |

Each word has an `id`, parent `verse`, normalized `lexeme`, `hasQere`, optional source `error`, `forms`, and `values`.

Each word also carries `gloss`, the BHSA English lexical gloss from the pinned `gloss.tf` feature (or `null` when absent). It is a dictionary gloss, not a contextual translation. The optional Show glosses checkbox displays it in the reader and results; whole words join constituent glosses in text order with ` + `.

`forms.ketiv` and `forms.qere` contain the pointed display `text`, `after` trailer, normalized `plain` consonants, and the `start`/`end` word IDs of the full form. An explicit empty qere remains empty; absent qere uses ketiv. Display text and normalized input are separate.

`values` has five arrays: `lexeme`, `word_ketiv`, `word_qere`, `full_ketiv`, `full_qere`. Each array follows `methods`: Hechrechi, Gadol, Sidduri, Katan, Katan Mispari. Values come directly from the corresponding `gem_<method>_<representation>[_<reading>]_ident` TF feature. Missing values are JSON `null`, never fabricated zeroes.

Whole forms are repeated on constituent word units in the source data. A consumer must group by `forms[reading].start` before counting whole words. Structural units contain explicit memberships rather than first/last ranges because some BHSA annotations are discontinuous. Match whole words only if every constituent is inside the chosen unit. For clipped units, the membership contains only words in this parasha; the `clipped` flag reports the truncation.

The catalogue in `site/data/catalogue.js` has checksums for the JSON files and the complete pinned-source metadata. It includes `sourceVerseCounterAudit` for incomplete/nonsequential BHSaddons counters; the exporter uses ordered BHSA verse membership for navigation.

## Compaction Verification

The exporter checks each compact document expands to its original before writing
it. `compact_dataset.py` converts an existing export without loading Text-Fabric,
validating all files before replacing them and updating catalogue sizes/hashes.
`docs/compaction-report.json` records before/after sizes and readable-export
hashes. JavaScript tests compare all 54 expanded files against these hashes,
including every string, value and structural membership.

`validate_document` accepts either representation and validates the readable
model. Invalid word ordering, verse membership, glosses, numerical arrays,
full-form bounds or unit membership raise `ValueError` with parasha and, where
applicable, word/reading/unit context. Validation and compaction guards remain
active under `python -O`; they do not rely on Python assertions. Regression
tests exercise these rejection paths without loading source TF data.
