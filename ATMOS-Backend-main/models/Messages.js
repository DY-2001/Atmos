const { time } = require("console");
const mongoose = require("mongoose");

// const ChatsSchema = new mongoose.Schema(
//     {
//         chatId:{
//             type: String
//         },
//         senderId: {
//             type: mongoose.Schema.Types.ObjectId,
//             required: true,
//             unique: false,
//             ref: "User"
//         },
//         receiverId:{
//             type: mongoose.Schema.Types.ObjectId,
//             required: false,
//             unique: false,
//             ref: "User"
//         },
//         projectId: {
//             type: mongoose.Schema.Types.ObjectId,
//             required: false,
//             unique: false,
//             ref: "Project"
//         },
//         text: {
//             type: String,
//             required: true,
//             unique: false,
//             minlength: 1
//         },
//     },
//     {
//         timestamps: true
//     }
// );

const messageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ChatsSchema = new mongoose.Schema(
  {
    channelId: {
      type: String,
      required: true,
    },
    channelName: {
      type: String,
      required: true,
    },
    channelType: {
      type: String,
      required: true,
    },
    channelMembers: {
      type: [
        {
          userId: mongoose.Schema.Types.ObjectId,
          userName: String,
        },
      ],
    },
    channelMessages: {
      type: [messageSchema],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Messages = mongoose.model("Messages", ChatsSchema);

module.exports = Messages;
