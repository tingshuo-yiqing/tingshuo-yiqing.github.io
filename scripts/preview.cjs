'use strict';

const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const root = path.resolve(__dirname, '../public');
const mime = new Map(Object.entries({
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml',
}));

function serve(request, response) {
  let target;
  try {
    const url = new URL(request.url, 'http://localhost');
    target = path.resolve(root, `.${decodeURIComponent(url.pathname)}`);
    if (target !== root && !target.startsWith(root + path.sep)) throw new Error('Invalid path');
    if (fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
    if (!fs.statSync(target).isFile()) throw new Error('Not a file');
  } catch {
    response.statusCode = 404;
    target = path.join(root, '404.html');
  }
  response.setHeader('Content-Type', mime.get(path.extname(target)) || 'application/octet-stream');
  if (request.method === 'HEAD') return response.end();
  const stream = fs.createReadStream(target);
  stream.on('error', () => response.end());
  stream.pipe(response);
}

const port = Number(process.env.PORT || 4000);
const server = http.createServer(serve);
server.listen(port, '127.0.0.1', () => console.log(`http://127.0.0.1:${server.address().port}/`));
