const mongoose = require("mongoose");

const meetingMemberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
  },
  { _id: false },
);

const meetingRoomSchema = new mongoose.Schema(
  {
    roomName: {
      type: String,
      required: true,
      trim: true,
    },
    roomCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    members: {
      type: [meetingMemberSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const MeetingRoom = mongoose.model("MeetingRoom", meetingRoomSchema);

module.exports = MeetingRoom;
