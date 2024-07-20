const User = require("../models/User");
const Project = require("../models/Project");
const Section = require("../models/Section");
const Task = require("../models/Task");
const Discussion = require("../models/Discussion");
const mongoose = require("mongoose");

const updateTask = async (req, res) => {
  try {
    const {
      taskId,
      taskName,
      taskDescription,
      taskCompletion,
      taskPriority,
      taskStatus,
      taskAssigneeList,
      taskSectionId,
      taskProjectId,
      taskCreator,
      taskDeadline,
    } = req.body;

    console.log(taskId, taskName, taskDescription, taskCompletion, taskPriority, taskStatus, taskAssigneeList, taskSectionId, taskProjectId, taskCreator, taskDeadline, "taskId, taskName, taskDescription, taskCompletion, taskPriority, taskStatus, taskAssigneeList, taskSectionId, taskProjectId, taskCreator, taskDeadline, taskComments from task controller -> updateTask");

    if (taskId == null) {

      //create new discussion thread
      const discussion = new Discussion({
        discussionThread: [],
      });

      const savedDiscussion = await discussion.save();

      //create New Task
      const task = new Task({
        taskName: taskName,
        taskDescription: taskDescription,
        taskCompletion: taskCompletion,
        taskPriority: taskPriority,
        taskStatus: taskStatus,
        taskAssigneeList: taskAssigneeList,
        taskSectionId: mongoose.Types.ObjectId(taskSectionId),
        taskProjectId: mongoose.Types.ObjectId(taskProjectId),
        taskCreator: mongoose.Types.ObjectId(taskCreator),
        taskDeadline: new Date(taskDeadline),
        taskDiscussion: mongoose.Types.ObjectId(savedDiscussion._id),
      });

      const savedTask = await task.save();


      // //update the task with the discussion thread id
      // const taskID = mongoose.Types.ObjectId(savedTask._id);
      // const updatedTask = await Task.findByIdAndUpdate(
      //   taskID,
      //   {
      //     $set: {
      //       taskDiscussion: savedDiscussion._id,
      //     },
      //   },
      //   { new: true }
      // );

      const section = await Section.findByIdAndUpdate(
        taskSectionId,
        {
          $push: {
            taskIdList: savedTask._id,
          },
        },
        { new: true }
      );

      const project = await Project.findByIdAndUpdate(
        taskProjectId,
        {
          $push: {
            projectTaskIdList: savedTask._id,
          },
        },
        { new: true }
      );

      //assign the task to the assignee

      const assigneeList = taskAssigneeList;

      for (let i = 0; i < assigneeList.length; i++) {
        const assigneeId = mongoose.Types.ObjectId(assigneeList[i]);
        const assignee = await User.findByIdAndUpdate(
          assigneeId,
          {
            $push: {
              taskAssignedIdList: savedTask._id,
            },
          },
          { new: true }
        );
      }

      //send back the response

      res.status(200).json({
        success: true,
        message: "Task Created Successfully",
        task: savedTask,
        section: section,
        project: project,
      });
    } else {
      //update existing task
      const taskID = mongoose.Types.ObjectId(taskId);
      const task = await Task.findByIdAndUpdate(
        taskID,
        {
          taskName: taskName,
          taskDescription: taskDescription,
          taskCompletion: taskCompletion,
          taskPriority: taskPriority,
          taskStatus: taskStatus,
          taskAssigneeList: taskAssigneeList,
          taskDeadline: new Date(taskDeadline),
          taskUpdatedAt: Date.now(),
        },
        { new: false }
      );

      //check if the task is assigned to user has changed or not if changed them remove the task from the old assignee and add it to the new assignee

      const oldAssigneeList = task.taskAssigneeList;
      const newAssigneeList = taskAssigneeList;

      //check if the old assignee list is empty or not

      if (oldAssigneeList.length > 0) {
        //check if the new assignee list is empty or not
        if (newAssigneeList.length > 0) {
          //check if the old assignee list and new assignee list are same or not
          if (oldAssigneeList.length == newAssigneeList.length) {
            //check if the old assignee list and new assignee list are same or not
            let isSame = true;
            for (let i = 0; i < oldAssigneeList.length; i++) {
              if (oldAssigneeList[i] != newAssigneeList[i]) {
                isSame = false;
                break;
              }
            }
            if (isSame) {
              //do nothing
            } else {
              //remove the task from the old assignee and add it to the new assignee
              for (let i = 0; i < oldAssigneeList.length; i++) {
                const oldAssigneeId = mongoose.Types.ObjectId(
                  oldAssigneeList[i]
                );
                const oldAssignee = await User.findByIdAndUpdate(
                  oldAssigneeId,
                  {
                    $pull: {
                      taskAssignedIdList: taskId,
                    },
                  },
                  { new: true }
                );
              }
              for (let i = 0; i < newAssigneeList.length; i++) {
                const newAssigneeId = mongoose.Types.ObjectId(
                  newAssigneeList[i]
                );
                const newAssignee = await User.findByIdAndUpdate(
                  newAssigneeId,
                  {
                    $push: {
                      taskAssignedIdList: taskId,
                    },
                  },
                  { new: true }
                );
              }
            }
          } else {
            //remove the task from the old assignee and add it to the new assignee
            for (let i = 0; i < oldAssigneeList.length; i++) {
              const oldAssigneeId = mongoose.Types.ObjectId(oldAssigneeList[i]);
              const oldAssignee = await User.findByIdAndUpdate(
                oldAssigneeId,
                {
                  $pull: {
                    taskAssignedIdList: taskId,
                  },
                },
                { new: true }
              );
            }
            for (let i = 0; i < newAssigneeList.length; i++) {
              const newAssigneeId = mongoose.Types.ObjectId(newAssigneeList[i]);
              const newAssignee = await User.findByIdAndUpdate(
                newAssigneeId,
                {
                  $push: {
                    taskAssignedIdList: taskId,
                  },
                },
                { new: true }
              );
            }
          }
        } else {
          //remove the task from the old assignee
          for (let i = 0; i < oldAssigneeList.length; i++) {
            const oldAssigneeId = mongoose.Types.ObjectId(oldAssigneeList[i]);
            const oldAssignee = await User.findByIdAndUpdate(
              oldAssigneeId,
              {
                $pull: {
                  taskAssignedIdList: taskId,
                },
              },
              { new: true }
            );
          }
        }
      } else {
        //check if the new assignee list is empty or not
        if (newAssigneeList.length > 0) {
          //add the task to the new assignee
          for (let i = 0; i < newAssigneeList.length; i++) {
            const newAssigneeId = mongoose.Types.ObjectId(newAssigneeList[i]);
            const newAssignee = await User.findByIdAndUpdate(
              newAssigneeId,
              {
                $push: {
                  taskAssignedIdList: taskId,
                },
              },
              { new: true }
            );
          }
        } else {
          //do nothing
        }
      }

      //get the new task and send it back

      const updatedTask = await Task.findById(taskId);

      //send back the response

      res.status(200).json({
        success: true,
        message: "Task updated successfully",
        task: updatedTask,
        // section: section,
        // project: project,
      });
    }
  } catch (err) {
    console.log(err, "Error from task controller -> updateTask");
    res.status(500).json({
      success: false,
      message: err,
    });
  }
};

//created by Einstein
const getTaskList = async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId(req.user._id);
    const userInfo = await User.findById(userId);
    const taskList = userInfo.taskAssignedIdList;
    const Tasks = await Task.find({ _id: { $in: taskList } });

    res.status(200).json({
      success: true,
      message: "Task list fetched successfully",
      Tasks: Tasks,
    });
  } catch (err) {
    console.log(err, "Error from project controller -> getUserProjects");
    res.status(500).json({
      success: false,
      message: err,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const taskID = mongoose.Types.ObjectId(req.params.id);

    const task = await Task.findByIdAndDelete(taskID);

    // console.log(task, "task");

    //remove the task from the assignee list

    const assigneeList = task.taskAssigneeList;

    for (let i = 0; i < assigneeList.length; i++) {
      const assigneeId = mongoose.Types.ObjectId(assigneeList[i]);
      const assignee = await User.findByIdAndUpdate(
        assigneeId,
        {
          $pull: {
            taskAssignedIdList: taskID,
          },
        },
        { new: true }
      );
    }

    //remove the task from the section list

    const sectionId = mongoose.Types.ObjectId(task.taskSectionId);
    const section = await Section.findByIdAndUpdate(
      sectionId,
      {
        $pull: {
          taskIdList: taskID,
        },
      },
      { new: true }
    );

    //remove the task from the project list

    const projectId = mongoose.Types.ObjectId(task.taskProjectId);
    const project = await Project.findByIdAndUpdate(
      projectId,
      {
        $pull: {
          projectTaskIdList: taskID,
        },
      },
      { new: true }
    );

    //send back the response

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      task: task,
    });
  } catch (err) {
    console.log(err, "Error from task controller -> deleteTask");
    res.status(500).json({
      success: false,
      message: err,
    });
  }
};


const getDiscussionThread = async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId(req.user._id);
    const discussionId = mongoose.Types.ObjectId(req.params.id);
    // console.log(discussionId, "discussionId");

    const discussionThread = await Discussion.find({ _id: discussionId }).populate({
      path: "discussionThread",
      populate: {
        path: "userId",
        select: "userName avatar email _id ",
      },
    });

    // console.log(discussionThread, "discussionThread");

    res.status(200).json({
      success: true,
      message: "Discussion list fetched successfully",
      discussion: discussionThread,
    });

  } catch (err) {
    console.log(err, "Error from discussion controller -> getDiscussionList");
    res.status(500).json({
      success: false,
      message: err,
    });
  }
};


const createDiscussionThread = async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId(req.user._id);
    const discussionId = mongoose.Types.ObjectId(req.params.id);

    const { discussion } = req.body;
    // console.log(discussion, "discussion");

    // update the discussion thread list and add the new discusssion

    const updatedDiscussion = await Discussion.findByIdAndUpdate(discussionId, {
      $push: {
        discussionThread: {
          userId,
          message: discussion,
        },
      },
    }, { new: true }).populate({
      path: "discussionThread",
      populate: {
        path: "userId",
        select: "userName avatar email _id ",
      },
    });

    res.status(200).json({
      success: true,
      message: "Discussion created successfully",
      discussion: updatedDiscussion,
    });
  } catch (err) {
    console.log(err, "Error from discussion controller -> createDiscussion");
    res.status(500).json({
      success: false,
      message: err,
    });
  }
};


const deleteDiscussionThread = async (req, res) => {
  try {
    const discussionId = mongoose.Types.ObjectId(req.params.id);
    const discussionThreadId = mongoose.Types.ObjectId(req.params.threadId);


    const updatedDiscussion = await Discussion.findByIdAndUpdate(discussionId, {
      $pull: {
        discussionThread: {
          _id: discussionThreadId
        }
      }
    }, { new: true }).populate({
      path: "discussionThread",
      populate: {
        path: "userId",
        select: "userName avatar email _id ",
      },
    });

    res.status(200).json({
      success: true,
      message: "Discussion deleted successfully",
      discussion: updatedDiscussion,
    });
  } catch (err) {
    console.log(err, "Error from discussion controller -> deleteDiscussion");
    res.status(500).json({
      success: false,
      message: err,

    });
  }
};










module.exports = {
  updateTask,
  deleteTask,
  getTaskList,
  getDiscussionThread,
  createDiscussionThread,
  deleteDiscussionThread
};
