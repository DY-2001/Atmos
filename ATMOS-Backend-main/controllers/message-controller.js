const Messages = require("../models/Messages");
const User = require("../models/User");
const Project = require("../models/Project");
const mongoose = require("mongoose");

// const addMessage = async (req, res) => {
  //   const { chatId, senderId, text } = req.body;
//   const message = new Messages({
//     chatId,
//     senderId,
//     text,
//   });
//   try {
//     const result = await message.save();
//     res.status(200).json(result);
  //   } catch (error) {
    //     res.status(500).json(error);
  //   }
// };

const addMessageInChat = async (req, res) => {
  const { chatId } = req.params;
  const { newMessage } = req.body;
  try {
    const updateChat = await Messages.findOneAndUpdate(
      { channelId: chatId },
      {
        $push: {
          channelMessages: newMessage,
        },
      },
      { new: true }
    );
    res.status(200).json(updateChat);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const result = await Messages.find({ channelId: chatId });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getDirectMessages = async (req, res) => {
  const userId = mongoose.Types.ObjectId(req.user._id);
  try {
    const projectAggregation = await Project.aggregate([
      {
        $match: {
          $or: [
            { projectOwner: mongoose.Types.ObjectId(userId) },
            { projectHighAccessMembers: mongoose.Types.ObjectId(userId) },
            { projectMediumAccessMembers: mongoose.Types.ObjectId(userId) },
            { projectLowAccessMembers: mongoose.Types.ObjectId(userId) },
          ],
        },
      },
      {
        $project: {
          highAccessMembers: "$projectHighAccessMembers",
          mediumAccessMembers: "$projectMediumAccessMembers",
          lowAccessMembers: "$projectLowAccessMembers",
        },
      },
      {
        $project: {
          allMembers: {
            $setUnion: [
              "$highAccessMembers",
              "$mediumAccessMembers",
              "$lowAccessMembers",
            ],
          },
        },
      },
      {
        $unwind: "$allMembers",
      },
      {
        $group: {
          _id: null,
          userIds: { $addToSet: "$allMembers" },
        },
      },
    ]).exec();

    const userIds =
      projectAggregation.length > 0 ? projectAggregation[0].userIds : [];

    const users = await User.find({
      _id: { $in: userIds },
    }).exec();

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users connected to projects:", error);
    throw error;
  }
};

module.exports = {
  // addMessage,
  addMessageInChat,
  getMessages,
  getDirectMessages,
};
