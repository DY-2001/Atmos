const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { askAgent, getAIAgentQuestions } = require('../controllers/agent-controller');
router.use(auth);


router.post('/ask', askAgent);
router.get('/get-questions', getAIAgentQuestions);

module.exports = router;