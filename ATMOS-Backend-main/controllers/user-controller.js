const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../config/validation");
const { default: mongoose } = require("mongoose");
// const { clearHash } = require("../services/redis");
const transporter = require("../config/transporter");
// require("../services/redis");
const sharp = require("sharp");
const { populate } = require("../models/User");

const register = async (req, res) => {
  try {
    // clearHash("default");
    // Validate the data before we make a user
    // console.log(req.body);
    const error = registerValidation(req.body);
    if (error) return res.status(500).json({ success: false, message: error });

    // Check if the user is already in the database
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists)
      return res
        .status(500)
        .json({ success: false, message: "Email already exists" });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    const user = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: hashedPassword,
    });
    const savedUser = await user.save();
    res.status(200).json({
      success: true,
      user: user._id,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err,
    });
  }
};

const login = async (req, res) => {
  try {
    // clearHash("default");
    // Validate the data before we make a user
    const error = loginValidation(req.body);
    // console.log(error);
    if (error) return res.status(500).json({ success: false, message: error });

    // Check if the email exists
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(500)
        .json({ success: false, message: "Email is not found" });

    // Check if the password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass)
      return res
        .status(500)
        .json({
          success: false,
          message: "Invalid Password! Password do not match!",
        });

    // Create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: "8h",
    });
    res.status(200).header("Authorization", token).send({
      success: true,
      message: "Login Success",
      token: token,
      user: user,
    });
  } catch (err) {
    // console.log(err, "Error from user controller -> login");
    console.log(err);
    res.status(500).send({
      success: false,
      message: err,
    });
  }
};

//get userInfo from token
const getUserInfo = async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId(req.user._id);
    const user = await User.findById(userId)
      .populate({
        path: "projectIdList",
        model: "Project",
        populate: [
          {
            path: "projectHighAccessMembers",
            model: "User",
          },
          {
            path: "projectMediumAccessMembers",
            model: "User",
          },
          {
            path: "projectLowAccessMembers",
            model: "User",
          },
        ],
      })
      .populate("taskAssignedIdList")
      .populate("favProjectIdList")
      .select({ password: 0 })
      // .cache()

    res.status(200).json({
      success: true,
      message: "User Info",
      user: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err,
    });
  }
};

const getUserList = async (req, res) => {
  try {
    const userList = await User.find({}).select({
      userName: 1,
      email: 1,
      _id: 1,
    });

    res.status(200).json({
      success: true,
      message: "User List fetched successfully",
      userList: userList,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err,
    });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    // clearHash("default");
    console.log(req.file);
    const userId = mongoose.Types.ObjectId(req.user._id);
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    console.log(buffer);
    const avatarSrc = `data:image/png;base64,${buffer.toString("base64")}`;
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarSrc },
      { new: true, runValidators: true }
    );
    res.status(200).json({
      success: true,
      message: "Avatar uploaded successfully",
      user: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: err,
    });
  }
};

const addProjectToFavorite = async (req, res) => {
  try {
    // clearHash("default");
    const userId = mongoose.Types.ObjectId(req.user._id);
    const projectId = mongoose.Types.ObjectId(req.body.projectId);
    // console.log('addProjectToFav');
    // console.log(userId, projectId);
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favProjectIdList: projectId } },
      { new: true }
    );
    // console.log(user, "userInfo from addProjectToFavorite");
    res.status(200).json({
      success: true,
      message: "Project added to favorite list",
    });
  } catch (err) {
    console.log(err, "Error from user controller -> addProjectToFavorite");
    res.status(500).json({
      success: false,
      message: err,
    });
  }
};

const removeProjectFromFavorite = async (req, res) => {
  try {
    // clearHash("default");
    const userId = mongoose.Types.ObjectId(req.user._id);
    const projectId = mongoose.Types.ObjectId(req.body.projectId);
    // console.log(userId, projectId);
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { favProjectIdList: projectId } },
      { new: true }
    );
    // console.log(user, "userInfo from addProjectToFavorite");
    res.status(200).json({
      success: true,
      message: "Project removed from favorite list",
    });
  } catch (err) {
    console.log(err, "Error from user controller -> addProjectToFavorite");
    res.status(500).json({
      success: false,
      message: err,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    // clearHash("default");
    const userId = mongoose.Types.ObjectId(req.user._id);
    const user = await User.findByIdAndUpdate(userId, req.body, { new: true });
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: err,
    });
  }
};

const contact = async (req, res) => {
  try {
    console.log(req.body);
    // const { name, email, message } = req.body;
    // const mailOptions = {
    //     from: email,
    //     to: process.env.EMAIL,
    //     subject: `Message from ${name}`,
    //     text: message
    // };
    // await transporter.sendMail(mailOptions);
    // res.status(200).json({
    //     success: true,
    //     message: "Message sent successfully"
    // });
    res.status(200).json({ message: "Sending Email is out of Service!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: err,
    });
  }
};

module.exports = {
  contact,
  register,
  login,
  getUserInfo,
  getUserList,
  addProjectToFavorite,
  removeProjectFromFavorite,
  uploadAvatar,
  updateUser,
};
