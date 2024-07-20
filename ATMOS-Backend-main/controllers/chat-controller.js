const User = require("../models/User");
const Project = require("../models/Project");
const Messages = require("../models/Messages");
const Chat = require("../models/Chat");
const mongoose = require("mongoose");

const createChat = async(req,res) => {
    const newChat = new Chat({
        members: [req.body.senderId, req.body.receiverId],
    })

    try {
        const chat = await Chat.findOne({
            members: { $all: [req.body.senderId, req.body.receiverId] },
        });
        console.log("similar found", chat)
        if(chat === null){
            const result = await newChat.save();
            res.status(200).json(result);
        }
      } catch (error) {
        res.status(500).json(error);
      }
}

const userChats = async (req, res) => {
    try {
      const chat = await Chat.find({
        members: { $in: [req.params.userId] },
      });
      res.status(200).json(chat);
    } catch (error) {
      res.status(500).json(error);
    }
  };
  
  const findChat = async (req, res) => {
    try {
      const chat = await Chat.findOne({
        members: { $all: [req.params.firstId, req.params.secondId] },
      });
      res.status(200).json(chat)
    } catch (error) {
      res.status(500).json(error)
    }
  };



  
const getChatsProject = async (req, res) => {
    try {
        const projectId = mongoose.Types.ObjectId(req.params.id);
        console.log(projectId);
        const projectInfo = await Project.findById(projectId).populate("projectMessages");
        // const projectChats = projectInfo.projectChatList;
        // const chats = await Chats.find({ projectid: projectId}).populate("senderid")
        // .populate("receiverid")
        // .populate("projectid")
        // .populate("message")
        // .populate("createdAt")
        res.status(200).json({
            success: true,
            chats: projectInfo.projectMessages,
          });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        });
    }
}
const getChatsUser = async (req, res) => {
    try {
        const userId = mongoose.Types.ObjectId(req.user._id);
        const userInfo = await User.findById(userId);
        const userChats = userInfo.personalChatList;
        const chats = await Chats.find({ _id: {
            $in: userChats
        }}).populate("senderid")
        .populate("receiverid")
        .populate("projectid")
        .populate("message")
        .populate("createdAt")
        res.status(200).json({
            success: true,
            chats: chats,
          });
    } catch (error) {
        
    }
}


const createProjectChat = async(req,res) => {
  const newChat = new Chat({
      projectId: req.body.projectId,
  })

  try {
      const chat = await Chat.findOne({
        projectId: { $all: [req.body.projectId] },
      });
      console.log("similar found", chat)
      if(chat === null){
          const result = await newChat.save();
          res.status(200).json(result);
      }
    } catch (error) {
      res.status(500).json(error);
    }
}

const projectChats = async (req, res) => {
  try {
    const chat = await Chat.find({
      projectId: { $in: [req.params.projectId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};


const projectsChats = async (req, res) => {
  try {
    const projectIds =  mongoose.Types.ObjectId(req.body.allProjects);
    let chats = []
    projectIds.map(async(projectId)=>{
      const chat = await Chat.find({
        projectId: { $in: [projectId] },
      });
      chats.push(chat)
  })
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json(error);
  }
};






const sendProjectMessage = async (req,res) => {
    try {
        const projectId = mongoose.Types.ObjectId(req.params.id);
        const sender = mongoose.Types.ObjectId(req.body.user);
        const message = new Chats({
            senderid : mongoose.Types.ObjectId(req.body.user),
            projectid: mongoose.Types.ObjectId(req.params.id),
            message: req.body.chat,
            createdAt : new Date()
        })
        const savedChat = await message.save();
        const projectChats = await Project.findByIdAndUpdate(projectId,{
                $push:{
                    projectMessages: savedChat._id
                },
        },
        {new: true}
        );
        res.status(200).json({
          success: true,
          message: 'chats fetched successfully',
          chats : savedChat,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        })
        
    }
}

const sendPersonalMessage = async (req,res) => {
    try {
        const receiverid = mongoose.Types.ObjectId(req.params.id);
        const sender = mongoose.Types.ObjectId(req.body.user);
        const message = new Chats({
            senderid : mongoose.Types.ObjectId(req.body.user),
            receiverid: mongoose.Types.ObjectId(req.params.id),
            message: req.body.chat,
            createdAt : Date.now()
        })
        const savedChat = await message.save();
        const userInfo = await User.findByIdAndUpdate(
            sender,
            {
              $push: {
                projectChatList: savedChat._id,
              },
            },
            { new: true }
          );
        res.status(200).json({
          success: true,
          chats : savedChat,
        });
    } catch (error) {
        
    }
}

module.exports = {
    getChatsUser,
    getChatsProject,
    sendProjectMessage,
    createChat,
    userChats,
    findChat,
    createProjectChat,
    projectChats,
    projectsChats
};
