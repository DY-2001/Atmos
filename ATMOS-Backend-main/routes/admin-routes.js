const express = require('express');
const router = express.Router();

// User routes for admin
// GET /admin/users - get all users
// GET /admin/users/:id - get user by id
// DELETE /admin/users/:id - delete user

// Project routes for admin
// GET /admin/projects - get all projects
// GET /admin/projects/:id - get project by id
// DELETE /admin/projects/:id - delete project

// Section routes for admin
// GET /admin/sections - get all sections
// GET /admin/sections/:id - get section by id
// DELETE /admin/sections/:id - delete section

// Task routes for admin
// GET /admin/tasks - get all tasks
// GET /admin/tasks/:id - get task by id
// DELETE /admin/tasks/:id - delete task

// user model
const User = require('../models/User');
// project model
const Project = require('../models/Project');
// section model
const Section = require('../models/Section');
// task model
const Task = require('../models/Task');

const { getAllUsers, getUserById, deleteUser } = require('../controllers/admin-controller');
const { getAllProjects, getProjectById, deleteProject } = require('../controllers/admin-controller');
const { getAllSections, getSectionById, deleteSection } = require('../controllers/admin-controller');
const { getAllTasks, getTaskById, deleteTask } = require('../controllers/admin-controller');

// Middleware to set headers
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Expose-Headers', 'X-Total-Count, Content-Range');
    next();
});

// User routes for admin
// GET /admin/users - get all users
router.get('/users', getAllUsers);
// GET /admin/users/:id - get user by id
router.get('/users/:id', getUserById);

// DELETE /admin/users/:id - delete user
router.delete('/users/:id', deleteUser);

// Project routes for admin
// GET /admin/projects - get all projects
router.get('/projects', getAllProjects);
// GET /admin/projects/:id - get project by id
router.get('/projects/:id', getProjectById);

// DELETE /admin/projects/:id - delete project
router.delete('/projects/:id', deleteProject);

// Section routes for admin
// GET /admin/sections - get all sections
router.get('/sections', getAllSections);
// GET /admin/sections/:id - get section by id
router.get('/sections/:id', getSectionById);
// DELETE /admin/sections/:id - delete section
router.delete('/sections/:id', deleteSection);

// Task routes for admin
// GET /admin/tasks - get all tasks
router.get('/tasks', getAllTasks);
// GET /admin/tasks/:id - get task by id
router.get('/tasks/:id', getTaskById);
// DELETE /admin/tasks/:id - delete task
router.delete('/tasks/:id', deleteTask);

module.exports = router;
