const User = require('../models/User');
const Project = require('../models/Project');
const Section = require('../models/Section');
const Task = require('../models/Task');
const mongoose = require('mongoose');

const createSection = async (req, res) => {
    try {
        projectId = req.body.projectId;
        projectId = mongoose.Types.ObjectId(projectId);
        sectionName = req.body.sectionName;

        const section = new Section({
            sectionName: sectionName,
            projectId: projectId,
            taskIdList: [],
        });

        const savedSection = await section.save();

        const project = await Project.findByIdAndUpdate(
            projectId,
            {
                $push: {
                    projectSectionIdList: savedSection._id,
                },
            },
            { new: true }
        );

        const projectInfo = await Project.findById(projectId).populate("projectOwner").populate("projectHighAccessMembers").populate("projectMediumAccessMembers").populate("projectLowAccessMembers").populate("projectSectionIdList").populate("projectTaskIdList").populate("projectSectionIdList.taskIdList");

        // console.log(projectInfo, "projectInfo from section controller -> createSection");

        res.status(200).json({
            success: true,
            message: "Create section successfully",
            section: savedSection,
            project: projectInfo,
        });
    } catch (err) {
        console.log(err, "Error from section controller -> createSection");
        res.status(500).json({
            success: false,
            message: err,
        });


    }


};

const updateSectionName = async (req, res) => {

    try {
        const sectionId = mongoose.Types.ObjectId(req.params.id);
        const sectionName = req.body.sectionName;
        // console.log(sectionId, sectionName, "sectionId, sectionName from section controller -> updateSectionName");

        const section = await Section.findByIdAndUpdate(
            sectionId,
            {
                $set: {
                    sectionName: sectionName,
                },
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Update section name successfully",
            section: section,
        });

    }
    catch (err) {
        console.log(err, "Error from section controller -> updateSectionName");
        res.status(500).json({
            success: false,
            message: err,
        });
    }

};

const deleteSection = async (req, res) => {
    try {
        const sectionID = mongoose.Types.ObjectId(req.params.id);

        const section = await Section.findByIdAndDelete(sectionID);

        //delete all task in section
        const taskList = section.taskIdList;
        for (let i = 0; i < taskList.length; i++) {
            const taskID = mongoose.Types.ObjectId(taskList[i]);
            const task = await Task.findByIdAndDelete(taskID);
        }

        //delete section from project
        const projectID = mongoose.Types.ObjectId(section.projectId);
        const project = await Project.findByIdAndUpdate(
            projectID,
            {
                $pull: {
                    projectSectionIdList: sectionID,
                },
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Delete section successfully",
            section: section,
            project: project,
        });
    }
    catch (err) {
        console.log(err, "Error from section controller -> deleteSection");
        res.status(500).json({
            success: false,
            message: err,
        });
    }

};

const getSectionDetail = async (req, res) => {

};

module.exports = {
    createSection,
    updateSectionName,
    deleteSection,
    getSectionDetail
};





