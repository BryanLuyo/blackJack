"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const fs_1 = require("fs");
const path_1 = require("path");
const publicDir = (0, path_1.join)(__dirname, '..', 'public');
function sendFile(res, filePath, contentType) {
    try {
        const data = (0, fs_1.readFileSync)(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    }
    catch (err) {
        res.writeHead(500);
        res.end('Server Error');
    }
}
(0, http_1.createServer)((req, res) => {
    let filePath = (0, path_1.join)(publicDir, req.url === '/' ? 'index.html' : req.url);
    if (!(0, fs_1.existsSync)(filePath)) {
        res.writeHead(404);
        res.end('Not Found');
        return;
    }
    const ext = (0, path_1.extname)(filePath);
    const contentTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css'
    };
    sendFile(res, filePath, contentTypes[ext] || 'text/plain');
}).listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
