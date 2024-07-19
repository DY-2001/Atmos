const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true,
        unique: false,
        minlength: 3,
    },
    projectOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: false,
        minlength: 0,
    },
    projectHighAccessMembers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
            unique: false,
            minlength: 0,
        },
    ],
    projectMediumAccessMembers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
            unique: false,
            minlength: 0,
        },
    ],
    projectLowAccessMembers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
            unique: false,
            minlength: 0,
        },
    ],
    projectSectionIdList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section",
            required: false,
            unique: false,
            minlength: 0,
        },
    ],
    projectTaskIdList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
        },
    ],
    projectType: {
        type: String,
        required: true,
        unique: false,
        minlength: 0,
    },
    projectStatement: {
        type: String,
        required: false,
        unique: false,
        minlength: 0,
    },
    projectMission: {
        type: String,
        required: false,
        unique: false,
        minlength: 0,
    },
    projectDescription: {
        type: String,
        required: false,
        unique: false,
        minlength: 0,
    },
    projectGuidelines: {
        type: String,
        required: false,
        unique: false,
        minlength: 0,
    },
    projectStatus: {
        type: String,
        required: false,
        unique: false,
        minlength: 0,
    },
    projectStartDate: {
        type: Date,
        required: false,
        unique: false,
        minlength: 0,
    },
    projectEndDate: {
        type: Date,
        required: false,
        unique: false,
        minlength: 0,
    },
    projectCreatedAt: {
        type: Date,
        default: Date.now,
    },
    projectLastUsed: [
        {
            userid: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            lastUsed: {
                type: Date,
                default: Date()
            },
        },
    ]
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
