const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");

const app = express();

//***Socket connection */

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});
//online user
const onlineUser = new Set();

//*****Socket running at http://localhost:8080 */
io.on("connection", async (socket) => {
  console.log("connect user ", socket.id);

  const token = socket.handshake.auth.token;

  //current user details
  const user = await getUserDetailsFromToken(token);

  //create a room
  socket.join(user?.id);
  onlineUser.add(user?.id);

  io.emit("onlineUser", Array.from(onlineUser));

  //****disconnect */
  io.on("disconnect", () => {
    console.log("disconnect user ", socket.id);
  });
});

module.exports = {
  app,
  server,
};
