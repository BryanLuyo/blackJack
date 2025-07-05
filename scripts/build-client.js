const { compile } = require('svelte/compiler');
const fs = require('fs');
const path = require('path');

const components = ['Setup', 'Player', 'Table'];

for (const name of components) {
  const srcPath = path.join(__dirname, '..', 'src', 'client', `${name}.svelte`);
  const destPath = path.join(__dirname, '..', 'public', `${name}.js`);
  const source = fs.readFileSync(srcPath, 'utf-8');
  const { js } = compile(source, { format: 'esm' });
  fs.writeFileSync(destPath, js.code);
}
