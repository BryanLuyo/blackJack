const { compile } = require('svelte/compiler');
const fs = require('fs');
const path = require('path');

const components = ['Setup', 'Player', 'Table'];
const extras = ['game.js'];

for (const name of components) {
  const srcPath = path.join(__dirname, '..', 'src', 'client', `${name}.svelte`);
  const destPath = path.join(__dirname, '..', 'public', `${name}.js`);
  const source = fs.readFileSync(srcPath, 'utf-8');
  const { js } = compile(source, { format: 'esm' });
  fs.writeFileSync(destPath, js.code);
}

for (const file of extras) {
  const srcPath = path.join(__dirname, '..', 'src', 'client', file);
  const destPath = path.join(__dirname, '..', 'public', file);
  fs.copyFileSync(srcPath, destPath);
}
