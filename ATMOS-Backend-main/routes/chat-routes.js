const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getChatsProject, getChatsUser, sendProjectMessage , createChat , userChats,projectChats , findChat, createProjectChat, projectsChats} = require('../controllers/chat-controller');
router.use(auth);


router.post('/send', createChat);
router.get('/:userId', userChats);
router.get('/find/:firstId/:secondId', findChat);
// router.get('/:projectId', projectChats);

router.post('/project/send', createProjectChat);
router.get('/project/:projectId', projectChats);
router.get('/project/all', projectsChats);
// router.post('/updateChat', updateChat);
// router.delete('/deleteChat/:id', deleteChat);
router.get('/getChats/user/:id', getChatsUser);
router.get('/getChats/project/:id', getChatsProject);
router.post('/sendMessage/Project/:id', sendProjectMessage);
// router.post('/sendMessage/user/:id', sendPersonalMessage);
// router.get('/getCollaborators/', getCollaborators);


module.exports = router;