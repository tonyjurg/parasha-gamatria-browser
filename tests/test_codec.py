from data_codec import compact_document, expand_document


def test_null_empty_qere_discontinuous_membership_and_clipping_survive():
    methods = ['a', 'b', 'c', 'd', 'e']
    values = dict.fromkeys(['lexeme', 'word_ketiv', 'word_qere', 'full_ketiv', 'full_qere'], [None, 0, 1, 2, 3])
    written = {'text':'x', 'after':' ', 'plain':'x', 'start':1, 'end':3}
    read = {**written, 'text':'', 'plain':None}
    doc = {'schemaVersion':1, 'id':1, 'name':'sample', 'hebrew':'x', 'methods':methods, 'range':[],
           'words':[{'id':1, 'verse':10, 'lexeme':None, 'gloss':'', 'hasQere':True, 'error':None,
                     'forms':{'ketiv':written, 'qere':read}, 'values':values}],
           'verses':[{'id':10, 'ref':['Genesis', 1, 1], 'words':[1], 'sourceParashaVerse':None}],
           'units':{'phrase':[{'id':20, 'words':[1, 3], 'clipped':True}]}}
    packed = compact_document(doc)
    assert len(packed['values']) == 1
    decoded = expand_document(packed)
    assert decoded == doc
    assert decoded['words'][0]['values']['lexeme'] is not decoded['words'][0]['values']['word_ketiv']
    assert compact_document(packed) == packed
