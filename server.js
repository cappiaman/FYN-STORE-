// FYN Production Server for Hostinger & Node.js environments
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.txt': 'text/plain; charset=UTF-8',
  '.xml': 'application/xml; charset=UTF-8',
  '.md': 'text/markdown; charset=UTF-8'
};

const server = http.createServer((req, res) => {
  // Parse URL & query string
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let safePath = path.normalize(decodeURIComponent(parsedUrl.pathname));

  // If AI agent requests markdown or accepts markdown on root
  const acceptHeader = (req.headers['accept'] || '').toLowerCase();
  if ((safePath === '/' || safePath === '/index.html') && acceptHeader.includes('text/markdown')) {
    safePath = '/llms.txt';
  } else if (safePath === '/' || safePath === '') {
    safePath = '/index.html';
  } else if (safePath === '/.well-known/mcp' || safePath === '/.well-known/mcp.json') {
    safePath = '/.well-known/mcp/server-card.json';
  }

  let filePath = path.join(ROOT, safePath);

  // Security check to avoid path traversal
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Check if .html fallback exists (e.g. /admin -> /admin.html)
      const htmlFallback = filePath + '.html';
      if (fs.existsSync(htmlFallback)) {
        filePath = htmlFallback;
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
      'Link': '<https://fynstore.in/llms.txt>; rel="alternate"; type="text/markdown", <https://fynstore.in/sitemap.xml>; rel="sitemap"; type="application/xml"'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`FYN Store server running on port ${PORT}`);
});
