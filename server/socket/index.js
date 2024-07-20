const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
const UserModel = require("../models/UserModel");
const { ConversationModel } = require("../models/ConversationModel");
const { MessageModel } = require("../models/ConversationModel");
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
  socket.join(user?._id?.toString());
  onlineUser.add(user?._id?.toString());

  //io to send all online User
  io.emit("onlineUser", Array.from(onlineUser));
  socket.on("message-page", async (userID) => {
    console.log("userID", userID);
    const userDetails = await UserModel.findById(userID).select("-password");

    const payload = {
      _id: userDetails?._id,
      name: userDetails?.name,
      email: userDetails?.email,
      profile_pic: userDetails?.profile_pic,
      online: onlineUser.has(userID),
    };

    socket.emit("message-user", payload);

    //previous Message
    const getConversationMessage = await ConversationModel.findOne({
      $or: [
        { sender: user?._id, receiver: userID },
        { sender: userID, receiver: user?._id },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });

    socket.emit("message", getConversationMessage?.messages);
  });

  //new-message
  socket.on("new-message", async (data) => {
    //Check conversation is available both user

    let conversation = await ConversationModel.findOne({
      $or: [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender },
      ],
    });
    // If Conversation is available, create a new conversation and save in DB
    if (!conversation) {
      const createConversation = new ConversationModel({
        sender: data?.sender,
        receiver: data?.receiver,
      });
      conversation = await createConversation.save();
    }
    const message = new MessageModel({
      text: data?.text,
      imageUrl: data?.imageUrl,
      videoUrl: data?.videoUrl,
      msgByUserID: data?.msgByUserID,
    });

    const saveMessage = await message.save();

    const updateConversation = await ConversationModel.updateOne(
      { _id: conversation?._id },
      {
        $push: { messages: saveMessage?._id },
      }
    );

    const getConversationMessage = await ConversationModel.findOne({
      $or: [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });

    io.to(data?.sender).emit("message", getConversationMessage.messages);
    io.to(data?.receiver).emit("message", getConversationMessage.messages);
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
