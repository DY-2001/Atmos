const { default: mongoose } = require('mongoose');
const User = require('../models/User');
const Project = require('../models/Project');
const Section = require('../models/Section');
const Task = require('../models/Task');

// User Controllers
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({
            success: true,
            message: "All users",
            users: users
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err
        });
    }
}

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json({
            success: true,
            message: "User found",
            user: user
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err
        });
    }
}

// DELETE /admin/users/:id - delete user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            user: user
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err
        });
    }
}

// Project Controllers
const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find({}).populate('projectOwner');
        res.status(200).json({
            success: true,
            message: "All projects",
            projects: projects
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err
        });
    }
}

const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('projectOwner');
        res.status(200).json({
            success: true,
            message: "Project found",
            project: project
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err
        });
    }
}

// DELETE /admin/projects/:id - delete project
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Project deleted successfully",
            project: project
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err
        });
    }
}

// Section Controllers
const getAllSections = async (req, res) => {
    try {
        const sections = await Section.find({}).populate('projectId');
        res.status(200).json({
            success: true,
            message: "All sections",
            sections: sections
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err
        });
    }
}

const getSectionById = async (req, res) => {
    try {
        const section = await Section.findById(req.params.id).populate('projectId');
        res.status(200).json({
            success: true,
            message: "Section found",
            section: section
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err
        });
    }
}

// DELETE /admin/sections/:id - delete section
const deleteSection = async (req, res) => {
    try {
        const section = await Section.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Section deleted successfully",
            section: section
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err
        });
    }
}

// Task Controllers
const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({}).populate('taskCreator');
        res.status(200).json({
            success: true,
            message: "All tasks",
            tasks: tasks
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err
        });
    }
}

const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('taskCreator');
        res.status(200).json({
            success: true,
            message: "Task found",
            task: task
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err
        });
    }
}

// DELETE /admin/tasks/:id - delete task
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Task deleted successfully",
            task: task
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err
        });
    }
}

module.exports = {getAllUsers, getUserById,  deleteUser, getAllProjects, getProjectById, deleteProject, getAllSections, getSectionById, deleteSection, getAllTasks, getTaskById, deleteTask } ;
