const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  // addMessage,
  getMessages,
  getDirectMessages,
} = require("../controllers/message-controller");
router.use(auth);

router.get("/getAllDMs", getDirectMessages);
// router.post("/sendmessage", addMessage);
router.get("/:chatId", getMessages);

module.exports = router;
