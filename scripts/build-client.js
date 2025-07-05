const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const files = ['setup.js', 'player.js', 'table.js', 'game.js'];

for (const file of files) {
  const src = path.join(__dirname, '..', 'src', 'client', file);
  const dest = path.join(__dirname, '..', 'public', file);
  fs.copyFileSync(src, dest);
}

execSync('tailwindcss -i ./src/styles/app.scss -o ./public/app.css --minify', { stdio: 'inherit' });
