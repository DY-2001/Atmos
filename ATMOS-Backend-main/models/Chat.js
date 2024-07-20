const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    members: {
        type: Array,
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Project'
    }
},{
    timestamps: true,
});

const ChatModel = mongoose.model('Chat', ChatSchema);
// export default ChatModel
module.exports = ChatModel;