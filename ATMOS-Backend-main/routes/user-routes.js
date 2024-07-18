require('dotenv').config();
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { register, login, getUserInfo, getUserList, uploadAvatar, updateUser, addProjectToFavorite, contact, removeProjectFromFavorite } = require('../controllers/user-controller');
const upload = require('../middlewares/avatarUpload');


router.post('/register', register);
router.post('/login', login);
router.post('/uploadAvatar', auth, upload.single('avatar'), uploadAvatar);
router.post('/updateUser', auth, updateUser);
router.post('/contact', contact);

router.get('/getUserInfo', auth, getUserInfo);
router.get('/getUserList', auth, getUserList);
router.put('/addProjectToFavorite', auth, addProjectToFavorite);
router.put('/removeProjectFromFavorite', auth, removeProjectFromFavorite);



module.exports = router;