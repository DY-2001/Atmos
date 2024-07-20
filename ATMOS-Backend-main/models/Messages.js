const mongoose = require('mongoose');

const ChatsSchema = new mongoose.Schema(
    {
        chatId:{
            type: String
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            unique: false,
            ref: "User"
        },
        receiverId:{
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            unique: false,
            ref: "User"
        },
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            unique: false,
            ref: "Project"
        },
        text: {
            type: String,
            required: true,
            unique: false,
            minlength: 1
        },
    },
    {
        timestamps: true
    }
);

const Messages = mongoose.model('Messages',  ChatsSchema);

module.exports = Messages;