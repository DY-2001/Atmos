const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    sectionName: {
        type: String,
        unique: false,
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },
    taskIdList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task"
        }
    ]
});

const Section = mongoose.model('Section', sectionSchema);

module.exports = Section;

