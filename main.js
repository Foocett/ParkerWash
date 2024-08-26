//Create server
// This section was sourced from the official Socket.IO documentation (https://socket.io/docs/v4/server-api/)
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require("fs");

const states = require("./states.json");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/Public/index.html");
});

app.use(express.static("Public"));

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

function getWasher(id) {
  return states.washers[id - 1];
}
function getDryer(id) {
  return states.dryers[id - 1];
}

// Start the server and listen on the specified port
const port = 3000; // The port number that the web server will listen on, this can be any number between 0 and 65535, but some numbers are reserved for specific purposes, see https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers for more information
server.listen(port, () => {
  console.log(`Web server running at http://localhost:${port}`);
});
