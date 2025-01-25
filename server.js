const express = require('express');
const app = express
const http = require('http')


//create a server
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});

  //server response
  res.write('<h3> Hello, I am live</h3>');
  res.end();
  
});
//defined dedicated port
const port = 3000;

//start the server
server.listen(port, () => {
  console.log(`Node.js HTTP server is running on port ${port}`)
})
