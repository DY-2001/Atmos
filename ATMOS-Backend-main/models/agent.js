const mongoose = require('mongoose');

const askAgentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true // Each user gets exactly one history document
    },
    conversations: [
        {
            question: {
                type: String,
                required: true,
            },
            answer: {
                type: String,
                required: true,
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, {
    timestamps: true // This properly adds createdAt and updatedAt to the main document
});

const AskAgentModel = mongoose.model('AskAgent', askAgentSchema);
module.exports = AskAgentModel;