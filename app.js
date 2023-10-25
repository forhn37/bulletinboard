const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 3000;

// 게시물을 저장할 배열
const posts = [];

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (method === 'GET' && url === '/') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else if (method === 'GET' && url === '/getPosts') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(posts));
  } else if (method === 'GET' && url === '/sub') {
    fs.readFile(path.join(__dirname, 'post.html'), (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else if (method === 'POST' && url === '/addPost') {
    let body = '';
    
    req.on('data', (chunk) => {
      body += chunk;
    });
    
    req.on('end', () => {
      const { title, text } = JSON.parse(body);
      const post = { title, text };
      posts.push(post);
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('게시물이 추가되었습니다.');
    });
  } else {
    // Serve static files (e.g., style.css)
    const extname = path.extname(url);
    const contentType = {
      '.css': 'text/css',
    }[extname] || 'text/plain';
    
    fs.readFile(path.join(__dirname, url), (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  }
});

server.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});