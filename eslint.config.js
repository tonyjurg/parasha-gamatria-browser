import js from '@eslint/js';
import globals from 'globals';

export default [
  {ignores: ['site/data/**']},
  js.configs.recommended,
  {
    files: ['site/*.js'],
    languageOptions: {globals: globals.browser},
    rules: {
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-restricted-properties': ['error',
        {property: 'innerHTML', message: 'Render text with textContent and DOM nodes.'},
        {property: 'outerHTML', message: 'Render text with textContent and DOM nodes.'},
        {property: 'insertAdjacentHTML', message: 'Render text with textContent and DOM nodes.'},
        {property: 'createContextualFragment', message: 'Do not parse untrusted HTML.'},
        {object: 'document', property: 'write', message: 'Render text with textContent and DOM nodes.'},
        {object: 'document', property: 'writeln', message: 'Render text with textContent and DOM nodes.'}
      ]
    }
  },
  {files: ['tests/*.js', 'eslint.config.js'], languageOptions: {globals: globals.node}}
];
