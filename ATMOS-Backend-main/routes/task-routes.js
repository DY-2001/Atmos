const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { updateTask, deleteTask, getTaskList, getDiscussionThread, createDiscussionThread, deleteDiscussionThread } = require('../controllers/task-controller');

router.use(auth);

router.post('/updateTask', updateTask);
router.delete('/deleteTask/:id', deleteTask);
router.get('/getDiscussionThread/:id', getDiscussionThread);
router.post('/createDiscussionThread/:id', createDiscussionThread);
router.delete('/deleteDiscussionThread/:id/:threadId', deleteDiscussionThread);
router.get('/getTaskList/', getTaskList); //created by Einstein


module.exports = router;