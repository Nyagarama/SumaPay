const express = require('express');
const http = require('http')
 
// Import the routers
const apiRouter = require('./src/routes/api');
const authRouter = require('./src/routes/auth');
const groupRouter = require('./src/routes/groups');
const membersRouter = require('./src/routes/members');
 
const app = express()
 
// Bind the routers to the express app
app.use('/api', apiRouter);
app.use('/auth', authRouter.router);
app.use('/group', groupRouter.router);
app.use('/members', membersRouter);
 
// bind the http server to the express app
const server = http.createServer(app);
 
//defined dedicated port
const port = 3000;
 
//start the server
server.listen(port, () => {
  console.log(`Node.js HTTP server is running on port ${port}`)
})
 
// const fs = require('fs')
 
// --- old code //
/*
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
*/