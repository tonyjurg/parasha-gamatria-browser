"""Lossless schema-2 storage; consumers expand to the readable schema-1 model."""
REPRESENTATIONS = ['lexeme', 'word_ketiv', 'word_qere', 'full_ketiv', 'full_qere']


class Table:
    def __init__(self):
        self.rows = []
        self.index = {}

    def add(self, value):
        key = tuple(value) if isinstance(value, list) else value
        if key not in self.index:
            self.index[key] = len(self.rows)
            self.rows.append(value)
        return self.index[key]


def compact_document(doc):
    doc = expand_document(doc)
    strings, forms, values = Table(), Table(), Table()

    def form_index(form):
        return forms.add([strings.add(form[k]) for k in ('text', 'after', 'plain')]
                         + [form['start'], form['end']])

    words = []
    for w in doc['words']:
        words.append([w['id'], w['verse'], strings.add(w['lexeme']), strings.add(w['gloss']),
                      int(w['hasQere']), strings.add(w['error']),
                      form_index(w['forms']['ketiv']), form_index(w['forms']['qere']),
                      [values.add(w['values'][rep]) for rep in REPRESENTATIONS]])
    return {**{k: doc[k] for k in ('id', 'name', 'hebrew', 'methods', 'range')},
            'schemaVersion': 2, 'strings': strings.rows, 'forms': forms.rows, 'values': values.rows,
            'words': words,
            'verses': [[v['id'], v['ref'], v['words'], v['sourceParashaVerse']] for v in doc['verses']],
            'units': {kind: [[u['id'], u['words'], int(u['clipped'])] for u in units]
                      for kind, units in doc['units'].items()}}


def expand_document(doc):
    if doc['schemaVersion'] == 1:
        return doc
    if doc['schemaVersion'] != 2:
        raise ValueError('Unsupported dataset schema')
    strings = doc['strings']
    forms = [dict(zip(('text', 'after', 'plain', 'start', 'end'),
                     [strings[i] for i in row[:3]] + row[3:])) for row in doc['forms']]
    return {'schemaVersion': 1, **{k: doc[k] for k in ('id', 'name', 'hebrew', 'methods', 'range')},
            'words': [{'id': w[0], 'verse': w[1], 'lexeme': strings[w[2]], 'gloss': strings[w[3]],
                       'hasQere': bool(w[4]), 'error': strings[w[5]],
                       'forms': {'ketiv': dict(forms[w[6]]), 'qere': dict(forms[w[7]])},
                       'values': {rep: list(doc['values'][i]) for rep, i in zip(REPRESENTATIONS, w[8])}}
                      for w in doc['words']],
            'verses': [dict(zip(('id', 'ref', 'words', 'sourceParashaVerse'), v)) for v in doc['verses']],
            'units': {kind: [{'id': u[0], 'words': u[1], 'clipped': bool(u[2])} for u in units]
                      for kind, units in doc['units'].items()}}
