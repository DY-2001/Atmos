const User = require("../models/User");
const Project = require("../models/Project");
const Messages = require("../models/Messages"); // Added missing import
const AskAgentModel = require("../models/agent"); // Import the AI History model
const mongoose = require("mongoose");

const askAgent = async (req, res) => {
  try {
    const question = req.body.question;
    const userId = mongoose.Types.ObjectId(req.user._id);

    // Fetch deep context: projects, tasks, and notes
    const user = await User.findById(userId)
      .populate("projectIdList")
      .populate("taskAssignedIdList")
      .populate("noteIdList")
      .populate("favProjectIdList")
      .select("-password");

    // console.log("what is notes : ", user.noteIdList)

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Fetch all chats where the user is a member
    const userChats = await Messages.find({
      "channelMembers.userId": userId,
    }).lean();

    // Construct a clean, JSON-like representation of the user data
    const contextData = {
      name: user.userName,
      email: user.email,
      projects: user.projectIdList.map((p) => ({
        id: p._id,
        name: p.projectName,
        type: p.projectType,
        statement: p.projectStatement,
        mission: p.projectMission,
        desc: p.projectDescription,
        guidelines: p.projectGuidelines,
        status: p.projectStatus,
        startDate: p.projectStartDate,
        endDate: p.projectEndDate,
        createdAt: p.projectCreatedAt,
      })),
      favoriteProjects: user.favProjectIdList.map((p) => p._id),
      tasks: user.taskAssignedIdList.map((t) => ({
        id: t._id,
        name: t.taskName,
        desc: t.taskDescription,
        completed: t.taskCompletion,
        priority: t.taskPriority,
        status: t.taskStatus,
        // Normalize assignees: return array of ids (or objects' _id if populated)
        assignees: Array.isArray(t.taskAssigneeList)
          ? t.taskAssigneeList.map((a) => (a && a._id ? a._id : a))
          : [],
        sectionId:
          t.taskSectionId && t.taskSectionId._id
            ? t.taskSectionId._id
            : t.taskSectionId,
        projectId:
          t.taskProjectId && t.taskProjectId._id
            ? t.taskProjectId._id
            : t.taskProjectId,
        creatorId:
          t.taskCreator && t.taskCreator._id
            ? t.taskCreator._id
            : t.taskCreator,
        deadline: t.taskDeadline,
        discussion:
          t.taskDiscussion && t.taskDiscussion._id
            ? t.taskDiscussion._id
            : t.taskDiscussion,
        createdAt: t.taskCreatedAt,
        updatedAt: t.taskUpdatedAt,
      })),
      notes: user.noteIdList.map((n) => ({
        id: n._id,
        descriptionHtml: n.NoteDescription,
        textPlaintext: n.NoteText,
        updatedAt: n.NoteUpdatedAt,
      })),
      chats: userChats.map((c) => ({
        channelName: c.channelName,
        channelType: c.channelType,
        // Provide explicit channel member info (ids + names)
        channelMembers: Array.isArray(c.channelMembers)
          ? c.channelMembers.map((cm) => ({
              userId: cm.userId,
              userName: cm.userName,
            }))
          : [],
        // Only return the last 15 messages per chat to save token bandwidth
        recentMessages: Array.isArray(c.channelMessages)
          ? c.channelMessages.slice(-15).map((m) => ({
              senderId: m.userId,
              senderName: m.userName,
              content: m.content,
              time: m.createdAt,
            }))
          : [],
      })),
    };

    // Fetch existing history to provide conversation context to the LLM
    const existingHistoryDoc = await AskAgentModel.findOne({
      userId: userId,
    }).lean();
    const previousConversations = existingHistoryDoc
      ? existingHistoryDoc.conversations.slice(-10)
      : [];

    // Format the history for the LLM
    const historyText = previousConversations
      .map((turn) => `User: ${turn.question}\nAI: ${turn.answer}`)
      .join("\n\n");

    console.log("context data is goig : ", contextData);

    // Create the prompt
    const prompt = `
You are a helpful Atmos AI assistant built directly into the app for the user ${contextData.name}.
Use the user data to answer their question accurately. Be concise, friendly, and helpful. 
Do not output raw JSON, write a conversational and human-readable response. 

### ATMOS SYSTEM ARCHITECTURE CONTEXT:
1. **Projects vs Tasks**: Projects act as the main workspace containers. Tasks are specific actionable items that exist inside those Projects.
2. **Chats vs Projects**: The Chat Channels are often directly mapped to a specific Project workspace or are direct peer-to-peer messages. If a user asks about discussions in a workspace, look at the Chats array.
3. Users are assigned to Tasks, which flow up into Projects.

### PREVIOUS CONVERSATION HISTORY:
This is the history of your chat with the user. Use this to understand follow-up questions!
${historyText || "No previous history."}

### USER'S AGGREGATED ACCOUNT DATA:
${JSON.stringify(contextData, null, 2)}

User's Latest Question: "${question}"
        `;

    // Request a response from the Gemini model using the globally initialized SDK
    const model = global.ai.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    // Save the conversation history in MongoDB using upsert
    const updatedHistory = await AskAgentModel.findOneAndUpdate(
      { userId: userId },
      {
        $push: {
          conversations: {
            question: question,
            answer: reply,
          },
        },
      },
      { upsert: true, new: true }, // Create the document if the user hasn't talked to AI yet
    );

    // Get the last 10 interactions from history
    const last10Interactions = updatedHistory.conversations.slice(-10);

    res.status(200).json({
      success: true,
      reply: reply,
      history: last10Interactions,
    });
  } catch (error) {
    console.error("AI Agent Error:", error);
    res.status(500).json({
      success: false,
    });
  }
};

const getAIAgentQuestions = async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId(req.user._id);

    const existingHistoryDoc = await AskAgentModel.findOne({
      userId: userId,
    }).lean();

    let history = [];
    if (existingHistoryDoc && existingHistoryDoc.conversations) {
      // Send back the last 10 interactions just like askAgent
      history = existingHistoryDoc.conversations;
    }

    res.status(200).json({
      success: true,
      history: history,
    });
  } catch (error) {
    console.error("AI Agent History Fetch Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch AI history",
    });
  }
};

module.exports = {
  askAgent,
  getAIAgentQuestions,
};
