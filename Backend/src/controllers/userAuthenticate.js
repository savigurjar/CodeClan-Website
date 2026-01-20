// [file name]: userAuthenticate.js
const validUser = require("../utils/validator")
const User = require("../models/users")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const redisClient = require("../config/redis")
const crypto = require("crypto");
const Submission = require("../models/submission");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const register = async (req, res) => {
    try {
        await validUser(req.body);

        req.body.password = await bcrypt.hash(req.body.password, 10);
        req.body.role = "user";
        req.body.totalPoints = 0;
        req.body.currentStreak = 0;
        req.body.maxStreak = 0;
        req.body.totalActiveDays = 0;
        req.body.streakHistory = [];

        const people = await User.create(req.body);
        const reply = {
            firstName: people.firstName,
            emailId: people.emailId,
            _id: people._id
        }

        const token = jwt.sign(
            { _id: people._id, role: people.role, emailId: people.emailId },
            process.env.JWT_KEY,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            user: reply,
            message: "User created successfully"
        });
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const people = await User.findOne({ emailId });
        if (!people) throw new Error("Invalid Credentials");

        const Isallowed = await bcrypt.compare(password, people.password);
        if (!Isallowed) throw new Error("Invalid Credentials")

        const reply = {
            firstName: people.firstName,
            emailId: people.emailId,
            _id: people._id
        }

        const token = jwt.sign({ _id: people._id, role: people.role, emailId: people.emailId }, process.env.JWT_KEY, { expiresIn: "1d" })

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            user: reply,
            message: "User Login Successfully"
        })
    } catch (err) {
        res.status(401).send("Error " + err)
    }
};

const getProfile = async (req, res) => {
    try {
        const user = req.result;
        const reply = {
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age,
            emailId: user.emailId,
            role: user.role,
            socialProfiles: user.socialProfiles,
            currentStreak: user.currentStreak || 0,
            maxStreak: user.maxStreak || 0,
            totalPoints: user.totalPoints || 0,
            problemSolved: user.problemSolved || [],
            streakHistory: user.streakHistory || [],
            _id: user._id
        };
        
        res.status(200).json(reply);
    } catch (err) {
        res.status(400).send("Error " + err)
    }
};

const logout = async (req, res) => {
    try {
        const { token } = req.cookies;
        if (!token) throw new Error("Token is missing");

        const payload = jwt.verify(token, process.env.JWT_KEY);

        await redisClient.set(`token:${token}`, "Blocked");
        await redisClient.expireAt(`token:${token}`, payload.exp);

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        });

        res.status(200).send("Logout Successfully")
    } catch (err) {
        res.status(401).send("Error " + err.message);
    }
};

const adminRegister = async (req, res) => {
    try {
        await validUser(req.body);
        req.body.password = await bcrypt.hash(req.body.password, 10);
        req.body.totalPoints = 0;
        req.body.currentStreak = 0;
        req.body.maxStreak = 0;
        req.body.totalActiveDays = 0;
        req.body.streakHistory = [];

        const people = await User.create(req.body);

        const token = jwt.sign({ _id: people._id, role: people.role, emailId: people.emailId }, process.env.JWT_KEY, { expiresIn: "1d" })

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000
        });
        res.status(201).send("Admin created successfully")
    } catch (err) {
        res.status(401).send("Error " + err)
    }
};

const deleteProfile = async (req, res) => {
    try {
        const userId = req.result._id;
        await User.findByIdAndDelete(userId);
        await Submission.deleteMany({ userId })
        res.status(200).send("Profile Deleted Successfully")
    } catch (err) {
        res.status(400).send("Error " + err)
    }
};

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const people = await User.findById(req.result._id);
        if (!people) throw new Error("user not found");

        const isAllowed = await bcrypt.compare(oldPassword, people.password);
        if (!isAllowed) throw new Error("Old password is incorrect");

        people.password = await bcrypt.hash(newPassword, 10);
        await people.save();

        res.status(200).send("Password changed successfully");
    } catch (err) {
        res.status(400).send("Error " + err)
    }
};

const forgotPassword = async (req, res) => {
  try {
    const { emailId } = req.body;

    const user = await User.findOne({ emailId });

    if (!user) {
      return res.status(200).json({ message: "If email exists, reset link sent" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resToken)
      .digest("hex");
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const resetURL = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"CodeClan" <${process.env.EMAIL_USER}>`,
      to: emailId,
      subject: "Password Reset Request",
      html: `
        <p>You requested a password reset</p>
        <p>Click below to reset your password:</p>
        <a href="${resetURL}">Reset Password</a>
        <p>This link will expire in 10 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Reset link sent to your email" });

  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(400).json({ message: err.message });
  }
};

const resetPassword = async (req, res) => {
    try {
        console.log("INCOMING TOKEN:", req.params.token);

        const resetToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        console.log("HASHED INCOMING TOKEN:", resetToken);

        const people = await User.findOne({
            resetPasswordToken: resetToken,
            resetPasswordExpire: { $gt: new Date() }
        });

        if (!people) throw new Error("Invalid or expired token");

        people.password = await bcrypt.hash(req.body.password, 10);
        people.resetPasswordToken = undefined;
        people.resetPasswordExpire = undefined;

        await people.save();

        res.status(200).send("Password reset successfully");
    } catch (err) {
        res.status(400).send("Error " + err.message);
    }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.result._id;

    const allowedFields = ["firstName", "lastName", "age", "socialProfiles"];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.socialProfiles) {
      const allowedSocials = ["linkedin", "x", "leetcode", "github"];
      const filtered = {};

      for (const key of allowedSocials) {
        if (updates.socialProfiles[key] !== undefined) {
          filtered[key] = updates.socialProfiles[key];
        }
      }
      updates.socialProfiles = filtered;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      {
        new: true,
        runValidators: true,
        select: "-password -resetPasswordToken -resetPasswordExpire",
      }
    );

    res.status(200).json({
      success: true,
      user,
      message: "Profile updated successfully",
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const users = await User.find({}, '-password -resetPasswordToken -resetPasswordExpire')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalUsers = await User.countDocuments();

        res.status(200).json({
            success: true,
            page,
            limit,
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            users
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Helper function to update user streak when solving a problem
const updateUserStreak = async (userId, problemId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if user was active yesterday
    const wasActiveYesterday = user.streakHistory.some(day => {
      const dayDate = new Date(day.date);
      dayDate.setHours(0, 0, 0, 0);
      return dayDate.getTime() === yesterday.getTime();
    });
    
    // Find today's streak entry
    let todayStreak = user.streakHistory.find(day => {
      const dayDate = new Date(day.date);
      dayDate.setHours(0, 0, 0, 0);
      return dayDate.getTime() === today.getTime();
    });
    
    if (!todayStreak) {
      // Create new streak entry for today
      todayStreak = {
        date: today,
        problemCount: 0,
        problemsSolved: []
      };
      user.streakHistory.push(todayStreak);
    }
    
    // Update today's streak
    todayStreak.problemCount += 1;
    if (problemId) {
      todayStreak.problemsSolved.push(problemId);
    }
    
    // Update current streak
    if (wasActiveYesterday) {
      user.currentStreak += 1;
    } else {
      user.currentStreak = 1;
    }
    
    // Update max streak if needed
    if (user.currentStreak > user.maxStreak) {
      user.maxStreak = user.currentStreak;
    }
    
    // Update total active days
    user.totalActiveDays = user.streakHistory.length;
    
    // Update last active date
    user.lastActiveDate = today;
    
    await user.save();
  } catch (err) {
    console.error("Error updating user streak:", err);
  }
};

// Update user points when solving a problem
const updateUserPoints = async (userId, points = 100) => {
  try {
    await User.findByIdAndUpdate(userId, {
      $inc: { totalPoints: points }
    });
  } catch (err) {
    console.error("Error updating user points:", err);
  }
};
// Add this function to get solved problems by user
const getSolvedProblems = async (req, res) => {
  try {
    const userId = req.result._id;
    
    const user = await User.findById(userId)
      .populate({
        path: 'problemSolved',
        select: 'title difficulty tags _id'
      })
      .select('problemSolved');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    res.status(200).json({
      success: true,
      solvedProblems: user.problemSolved || []
    });
  } catch (err) {
    console.error("Error fetching solved problems:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching solved problems"
    });
  }
};

// Add this function to userAuthenticate.js after getSolvedProblems
const getUserStats = async (req, res) => {
  try {
    const user = req.result;
    
    // Get solved problems count
    const solvedCount = user.problemSolved ? user.problemSolved.length : 0;
    
    // Calculate total points
    const totalPoints = solvedCount * 100;
    
    // Get submissions for accuracy calculation
    const totalSubmissions = await Submission.countDocuments({ userId: user._id });
    const acceptedSubmissions = await Submission.countDocuments({ 
      userId: user._id, 
      status: "accepted" 
    });
    
    const accuracy = totalSubmissions > 0 
      ? Math.round((acceptedSubmissions / totalSubmissions) * 100)
      : 0;
    
    // Calculate total active days from streakHistory
    const totalActiveDays = user.streakHistory ? user.streakHistory.length : 0;
    
    // Calculate submissions in past year
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    const submissionsPastYear = await Submission.countDocuments({
      userId: user._id,
      createdAt: { $gte: oneYearAgo }
    });
    
    // Get total users for ranking
    const totalUsers = await User.countDocuments();
    
    // Calculate rank based on total points
    const usersWithMorePoints = await User.countDocuments({
      totalPoints: { $gt: user.totalPoints || 0 }
    });
    
    const rank = usersWithMorePoints + 1;
    const percentile = totalUsers > 0 ? Math.round((rank / totalUsers) * 100) : 0;
    
    res.status(200).json({
      success: true,
      stats: {
        totalProblems: solvedCount,
        totalPoints: user.totalPoints || totalPoints,
        currentStreak: user.currentStreak || 0,
        maxStreak: user.maxStreak || 0,
        accuracy,
        totalSubmissions,
        acceptedSubmissions,
        totalActiveDays,
        submissionsPastYear,
        rank,
        totalUsers,
        percentile,
        streakHistory: user.streakHistory || []
      }
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};

// Add this function for rank endpoint
const getUserRank = async (req, res) => {
  try {
    const user = req.result;
    
    // Get total users count
    const totalUsers = await User.countDocuments();
    
    // Calculate rank based on total points
    const usersWithMorePoints = await User.countDocuments({
      totalPoints: { $gt: user.totalPoints || 0 }
    });
    
    const rank = usersWithMorePoints + 1;
    const percentile = totalUsers > 0 ? Math.round((rank / totalUsers) * 100) : 0;
    
    res.status(200).json({
      success: true,
      rank,
      totalUsers,
      percentile
    });
  } catch (err) {
    console.error("Rank error:", err);
    res.status(500).json({ 
      success: false, 
      message: err.message
    });
  }
};

module.exports = { 
  register, 
  login, 
  getProfile, 
  logout, 
  adminRegister, 
  updateProfile, 
  deleteProfile, 
  changePassword, 
  forgotPassword, 
  resetPassword, 
  getAllUsers,
  updateUserStreak,
  updateUserPoints,
  getSolvedProblems,
  getUserStats,      // Add this
  getUserRank        // Add this
};