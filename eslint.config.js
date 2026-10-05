import js from '@eslint/js';
import globals from 'globals';

export default [
  {ignores: ['site/data/**']},
  js.configs.recommended,
  {files: ['site/*.js'], languageOptions: {globals: globals.browser}},
  {files: ['tests/*.js', 'eslint.config.js'], languageOptions: {globals: globals.node}}
];
