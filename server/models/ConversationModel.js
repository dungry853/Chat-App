const { default: mongoose } = require("mongoose");
const moongose = require("mongoose");

const messageSchema = moongose.Schema(
  {
    text: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      default: "",
    },
    seen: {
      type: Boolean,
      default: false,
    },
    msgByUserID: {
      type: moongose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const conversationSchema = moongose.Schema(
  {
    sender: {
      type: moongose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    receiver: {
      type: moongose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    messages: [
      {
        type: String,
        ref: "Message",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const MessageModel = moongose.model("Message", messageSchema);
const ConversationModel = mongoose.model("Conversation", conversationSchema);

module.exports = { ConversationModel, MessageModel };
