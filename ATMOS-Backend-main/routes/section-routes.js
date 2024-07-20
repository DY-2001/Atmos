const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { createSection, updateSectionName, deleteSection, getSectionDetail } = require('../controllers/section-controller');

router.use(auth);

router.post('/create', createSection);
// router.post('/update', updateSectionName);
router.delete('/deleteSection/:id', deleteSection);
// router.get('/getSectionDetail/:id', getSectionDetail);
router.put('/renameSection/:id', updateSectionName);

module.exports = router;


