import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';

const publicDir = join(__dirname, '..', 'public');

function sendFile(res: any, filePath: string, contentType: string) {
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
  let filePath = join(publicDir, req.url === '/' ? 'index.html' : req.url!);
  if (!existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not Found');
    return;
  }
  const ext = extname(filePath);
  const contentTypes: Record<string, string> = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css'
  };
  sendFile(res, filePath, contentTypes[ext] || 'text/plain');
}).listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
