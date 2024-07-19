const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: true,
        minlength: 0
    },
    taskDescription: {
        type: String,
        required: false,
        unique: false,
        minlength: 0
    },
    taskCompletion: {
        type: Boolean,
        required: true,
        unique: false,
        minlength: 0
    },
    taskPriority: {
        type: String,
        required: false,
        unique: false,
        minlength: 0
    },
    taskStatus: {
        type: String,
        required: false,
        unique: false,
        minlength: 0
    },
    taskAssigneeList: [
        {
            type: mongoose.Schema.Types.ObjectID,
            ref: "User",
        }
    ],
    taskSectionId: {
        type: mongoose.Schema.Types.ObjectID,
        ref: "Section",
        required: true,
        unique: false,
        minlength: 0
    },
    taskProjectId: {
        type: mongoose.Schema.Types.ObjectID,
        ref: "Project",
        required: true,
        unique: false,
        minlength: 0
    },
    taskCreator: {
        type: mongoose.Schema.Types.ObjectID,
        ref: "User",
        required: true,
        unique: false,
        minlength: 0
    },
    taskDeadline: {
        type: Date,
        required: true,
        unique: false,
        minlength: 0
    },
    taskDiscussion: {
        type: mongoose.Schema.Types.ObjectID,
        ref: "Discussion",
        required: false,
        unique: false,
        minlength: 0
    },
    taskCreatedAt: {
        type: Date,
        default: Date.now
    },
    taskUpdatedAt: {
        type: Date,
        default: Date.now
    }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
