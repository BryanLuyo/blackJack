const { compile } = require('svelte/compiler');
const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '..', 'src', 'client', 'App.svelte');
const destPath = path.join(__dirname, '..', 'public', 'App.js');

const source = fs.readFileSync(srcPath, 'utf-8');
const { js } = compile(source, { format: 'esm' });
fs.writeFileSync(destPath, js.code);

