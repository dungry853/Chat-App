const { ConversationModel } = require("../models/ConversationModel");

const getConversation = async (currentUserID) => {
  if (currentUserID) {
    const currentUserConversation = await ConversationModel.find({
      $or: [{ sender: currentUserID }, { receiver: currentUserID }],
    })
      .sort({ updatedAt: -1 })
      .populate("messages")
      .populate("sender")
      .populate("receiver");

    const conversation = currentUserConversation.map((conv) => {
      const countUnseenMsg = conv.messages.reduce((preve, curr) => {
        const msgByUserID = curr?.msgByUserID.toString();
        if (msgByUserID !== currentUserID) {
          return preve + (curr.seen ? 0 : 1);
        } else {
          return preve;
        }
      }, 0);
      return {
        _id: conv?._id,
        sender: conv?.sender,
        receiver: conv?.receiver,
        unseenMsg: countUnseenMsg,
        lastMsg: conv.messages[conv?.messages?.length - 1],
      };
    });

    return conversation;
    // socket.emit("conversation", conversation || []);
  } else {
    return [];
  }
};

module.exports = getConversation;
