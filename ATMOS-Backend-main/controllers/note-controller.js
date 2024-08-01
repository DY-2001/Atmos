//created by Einstein
const User = require("../models/User");
const Note = require("../models/Note");
const mongoose = require("mongoose");
const client = require("./../services/redis");

const create = async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId(req.user._id);

    const note = new Note({
      NoteDescription: req.body.description,
      NoteText: req.body.text,
      NoteOwner: userId,
      NoteUpdateAt: new Date(),
    });

    const savedNote = await note.save();

    const userInfo = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          noteIdList: savedNote._id,
        },
      },
      { new: true }
    ).populate("noteIdList");

    const noteList = userInfo.noteIdList;

    await client.set(`notes-${userId}`, JSON.stringify(noteList));

    res.status(200).json({
      success: true,
      message: "Note created successfully",
      note: savedNote,
    });
  } catch (err) {
    console.log(err, "error from create->note-controller");
    res.status(500).json({
      success: false,
      message: err,
    });
  }
};

const getNoteList = async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId(req.user._id);
    const noteListFromRedisCache = await client.get(`notes-${userId}`);
    if (noteListFromRedisCache) {
      console.log("cache hit");
      return res.status(200).json({
        success: true,
        message: "Notes Loaded Successfully",
        notes: JSON.parse(noteListFromRedisCache),
      });
    }
    // console.log(userId);
    const userInfo = await User.findById(userId).populate("noteIdList");
    const noteList = userInfo.noteIdList;
    // console.log(
    //   "In my Atmos project I want to console my getNoteList ",
    //   noteList
    // );
    console.log("cache miss");
    await client.set(`notes-${userId}`, JSON.stringify(noteList));

    res.status(200).json({
      success: true,
      message: "Notes Loaded Successfully",
      notes: noteList,
    });
  } catch (err) {
    console.log(err, "Error from getNoteList");
    res.status(500).json({
      success: false,
      message: err,
    });
  }
};

const getNote = async (req, res) => {
  try {
    const noteId = req.params.id;

    const noteFromRedisCache = await client.get(`note-${noteId}`);
    if (noteFromRedisCache) {
      console.log("cache hit single note");
      return res.status(200).json({
        success: true,
        message: "Note Loaded Successfully",
        note: JSON.parse(noteFromRedisCache),
      });
    }
    const note = await Note.findById(noteId);

    console.log("cache miss single note");
    await client.set(`note-${noteId}`, JSON.stringify(note));

    res.status(200).json({
      success: true,
      message: "Note Loaded Successfully",
      note: note,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err,
    });
  }
};

const updateNote = async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId(req.user._id);
    //we don't need note id in params here we can just destructuring req.body to find note id to update that particular note
    const { NoteId, NoteDescription, NoteText, NoteOwner, NoteUpdateAt } =
      req.body;
    const NoteID = mongoose.Types.ObjectId(NoteId);

    const note = await Note.findByIdAndUpdate(
      NoteID,
      {
        NoteDescription: NoteDescription,
        NoteText: NoteText,
        NoteOwner: userId,
        NoteUpdatedAt: new Date(),
      },
      { new: false }
    );

    const updatedNote = await Note.findById(NoteId);

    await client.set(`note-${NoteId}`, JSON.stringify(updatedNote));

    res.status(200).json({
      success: true,
      message: "Note updated Successfully",
      note: updatedNote,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err,
    });
  }
};

const deleteNote = async (req, res) => {
  const noteID = mongoose.Types.ObjectId(req.params.id);
  const note = await Note.findByIdAndDelete(noteID);
  const userId = mongoose.Types.ObjectId(req.user._id);
  const notes = await Note.find({ NoteOwner: userId });
  const userInfo = await User.findById(userId).populate("noteIdList");

  await client.del(`note-${noteID}`);
  await client.set(`notes-${userId}`, JSON.stringify(userInfo.noteIdList));

  res.status(200).json({
    success: true,
    message: "Note Deleted Successfully",
    note: notes,
  });
};
module.exports = {
  create,
  getNoteList,
  updateNote,
  deleteNote,
  getNote,
};
