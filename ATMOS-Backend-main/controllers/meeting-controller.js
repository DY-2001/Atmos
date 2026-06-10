const { randomUUID } = require("crypto");
const mongoose = require("mongoose");
const MeetingRoom = require("../models/MeetingRoom");
const User = require("../models/User");

const buildRoomCode = (roomName) => {
  const baseName = roomName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

  const suffix = randomUUID().slice(0, 8);

  return `${baseName || "meeting"}-${suffix}`;
};

const normalizeMemberIds = (memberIds = []) => {
  return [
    ...new Set(
      memberIds.map((memberId) => memberId?.toString()).filter(Boolean),
    ),
  ];
};

const createMeetingRoom = async (req, res) => {
  try {
    const roomName = (req.body.roomName || "").trim();
    const memberIds = normalizeMemberIds(req.body.memberIds || []);
    const creatorId = req.user._id.toString();

    if (!roomName) {
      return res.status(400).json({
        success: false,
        message: "Room name is required",
      });
    }

    const uniqueMemberIds = [...new Set([...memberIds, creatorId])];
    const userIds = uniqueMemberIds.map((memberId) =>
      mongoose.Types.ObjectId(memberId),
    );
    const users = await User.find({ _id: { $in: userIds } }).select(
      "_id userName email avatar",
    );

    const members = users.map((user) => ({
      userId: user._id,
      userName: user.userName,
      email: user.email,
    }));

    const room = new MeetingRoom({
      roomName,
      roomCode: buildRoomCode(roomName),
      createdBy: mongoose.Types.ObjectId(creatorId),
      members,
    });

    const savedRoom = await room.save();
    await User.updateMany(
      { _id: { $in: userIds } },
      { $addToSet: { meetingRoomIdList: savedRoom._id } },
    );
    const populatedRoom = await MeetingRoom.findById(savedRoom._id)
      .populate("createdBy", "userName email avatar")
      .populate("members.userId", "userName email avatar");

    return res.status(201).json({
      success: true,
      message: "Meeting room created successfully",
      room: populatedRoom,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || error,
    });
  }
};

const getUserMeetingRooms = async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId(req.user._id);
    const rooms = await MeetingRoom.find({
      $or: [{ createdBy: userId }, { "members.userId": userId }],
    })
      .populate("createdBy", "userName email avatar")
      .populate("members.userId", "userName email avatar")
      .sort({ updatedAt: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Meeting rooms fetched successfully",
      rooms,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || error,
    });
  }
};

const getMeetingRoomByCode = async (req, res) => {
  try {
    const room = await MeetingRoom.findOne({ roomCode: req.params.roomCode })
      .populate("createdBy", "userName email avatar")
      .populate("members.userId", "userName email avatar");

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Meeting room not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Meeting room fetched successfully",
      room,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || error,
    });
  }
};

module.exports = {
  createMeetingRoom,
  getUserMeetingRooms,
  getMeetingRoomByCode,
};
