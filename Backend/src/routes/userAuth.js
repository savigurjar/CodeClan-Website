// [file name]: userAuth.js
const express = require('express');
const authRouter = express.Router();
const { register, login, logout, getProfile, updateProfile,getSolvedProblems, adminRegister,getUserRank,getUserStats, deleteProfile, changePassword, forgotPassword, resetPassword, getAllUsers } = require("../controllers/userAuthenticate")
const userMiddleware = require("../middleware/userMiddleware")
const adminMiddleware = require("../middleware/adminMiddleware")

// register
authRouter.post('/register', register)
authRouter.post('/login', login);
authRouter.post('/logout', userMiddleware, logout);
authRouter.get('/getProfile', userMiddleware, getProfile);
authRouter.post('/admin/register', adminMiddleware, adminRegister)

// login
// logout
// getprofile
// change password
authRouter.post('/changePassword', userMiddleware, changePassword);
// forgot password
authRouter.post('/forgot-password', forgotPassword);
// reset password
authRouter.post('/reset-password/:token', resetPassword);  // kebab-case
authRouter.get('/admin/users', adminMiddleware, getAllUsers);
// delete profile
authRouter.delete('/deleteProfile', userMiddleware, deleteProfile)
authRouter.put("/updateProfile", userMiddleware, updateProfile);
authRouter.get("/solved-problems", userMiddleware, getSolvedProblems);

/// Replace the entire authRouter.get("/stats", userMiddleware, async (req, res) => { ... }) section with:
authRouter.get("/stats", userMiddleware, getUserStats);
authRouter.get("/rank", userMiddleware, getUserRank);

// Keep the check endpoint but simplify it:
authRouter.get("/check", userMiddleware, (req, res) => {
  try {
    const user = req.result;
    const reply = {
      firstName: user.firstName,
      // lastName: user.lastName,
      // age: user.age,
      emailId: user.emailId,
      role: user.role,
      // _id: user._id,
      // socialProfiles: user.socialProfiles,
      // currentStreak: user.currentStreak || 0,
      // maxStreak: user.maxStreak || 0,
      // totalPoints: user.totalPoints || 0,
      // problemSolved: user.problemSolved || [],
      // streakHistory: user.streakHistory || []
    }
    res.status(200).json({
      user: reply,
      message: "Valid User"
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});
module.exports = authRouter;