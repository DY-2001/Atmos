//created by Einstein
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  create,
  updateNote,
  deleteNote,
  getNoteList,
  getNote,
} = require("../controllers/note-controller");

router.use(auth);

router.post("/create", create);
router.put("/updateNote/:id", updateNote);
router.delete("/deleteNote/:id", deleteNote);
router.get("/getNoteList", getNoteList);
router.get("/getNote/:id", getNote)

module.exports = router;
