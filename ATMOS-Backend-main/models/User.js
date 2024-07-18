const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    password: {
        type: String,
        required: true,
        unique: false,
        minlength: 5
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5
    },
    avatar: {
        type: String,
        default: 'https://discuss.ens.domains/uploads/db9688/original/2X/5/54f5ecfea7e9abb70f0ff5ac56c8bd1a160f000d.jpeg'
    },
    projectIdList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'Project'
        }
    ],
    noteIdList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required:false, 
            ref: 'Note'
        }
    ],
    taskAssignedIdList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'Task'
        }
    ],
    favProjectIdList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'Project'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;

