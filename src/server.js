const { createServer } = require('http');
const { readFileSync, existsSync } = require('fs');
const { join, extname } = require('path');

const publicDir = join(__dirname, '..', 'public');

function sendFile(res, filePath, contentType) {
  try {
    const data = readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  } catch (err) {
    res.writeHead(500);
    res.end('Server Error');
  }
}

createServer((req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost');
  const filePath = join(publicDir, pathname === '/' ? 'index.html' : pathname);
  if (!existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not Found');
    return;
  }
  const ext = extname(filePath);
  const contentTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css'
  };
  sendFile(res, filePath, contentTypes[ext] || 'text/plain');
}).listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
