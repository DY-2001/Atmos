// Created by Einstein
const mongoose = require('mongoose')

const NoteSchema = new mongoose.Schema({
    NoteDescription: {
        type: String,
        required: false,
        unique: false,
        minlength: 0
    },
    NoteText: {
        type: String,
        required: false,
        unique: false,
        minlength: 0
    },
    NoteOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: false,
        minlength: 0,
    },
    NoteUpdatedAt: {
        type: Date,
        default: new Date()
    }
})

const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;