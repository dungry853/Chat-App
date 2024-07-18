const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
const UserModel = require("../models/UserModel");

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
  socket.join(user?._id);
  onlineUser.add(user?._id?.toString());

  //io to send all online User
  io.emit("onlineUser", Array.from(onlineUser));
  socket.on("message-page", async (userID) => {
    console.log("userID", userID);
    const userDetails = await UserModel.findById(userID);

    const payload = {
      _id: userDetails?._id,
      name: userDetails?.name,
      email: userDetails?.email,
      profile_pic: userDetails?.profile_pic,
      online: onlineUser.has(userID),
    };

    socket.emit("message-user", payload);
  });
  //****disconnect */
  socket.on("disconnect", () => {
    onlineUser.delete();
    console.log("disconnect user ", socket.id);
  });
});

module.exports = {
  app,
  server,
};
