const fs = require('fs');
const path = require('path');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const process = require('process');


const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// eslint-disable-next-line no-undef
const jsonDataPath = path.join(__dirname, 'states.json'); // Path to your JSON file

app.get('/', (req, res) => {
  // eslint-disable-next-line no-undef
  res.sendFile(__dirname+'/Public/index.html');
});
app.use(express.static('Public'));

// Read JSON data
let jsonData;
fs.readFile(jsonDataPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading JSON data:', err);
    return;
  }
  jsonData = JSON.parse(data);
});

io.on('connection', (socket) => {
  console.log('New client connected');

  // Handle get-states event
  socket.on('get-states', (callback) => {
    callback(jsonData);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});