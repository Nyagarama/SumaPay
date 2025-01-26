const express = require('express');
const app = express()
const http = require('http')
const fs = require('fs')

// Cache the file content
let cachedFile;
fs.readFile('../Public/index.html', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    cachedFile = 'Internal Server Error';
  } else {
      res.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8'});
  }
});
const path = require('path')
      res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});

const server = http.createServer((req, res) => {
  if (cachedFile === 'Internal Server Error') {
    res.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8'});
    res.write(cachedFile);
  } else {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.write(cachedFile);
  }
  res.end();
});
//defined dedicated port
const port = 3000;

//start the server
server.listen(port, () => {
  console.log(`Node.js HTTP server is running on port ${port}`)
})
