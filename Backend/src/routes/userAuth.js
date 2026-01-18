// [file name]: userAuth.js
// [file content begin]
const express = require('express');
const authRouter = express.Router();
const { register, login, logout, getProfile, updateProfile, adminRegister, deleteProfile, changePassword, forgotPassword, resetPassword, getAllUsers } = require("../controllers/userAuthenticate")
const userMiddleware = require("../middleware/userMiddleware")
const adminMiddleware = require("../middleware/adminMiddleware")

// register
authRouter.post('/register', register)
authRouter.post('/login', login);
authRouter.post('/logout', userMiddleware, logout);
authRouter.get('/getProfile', userMiddleware, getProfile);
authRouter.post('/admin/register', adminMiddleware, adminRegister)
authRouter.delete('/deleteProfile', userMiddleware, deleteProfile)
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


// [NEW ROUTE]: Get comprehensive user statistics
authRouter.get("/stats", userMiddleware, async (req, res) => {
  try {
    const user = req.result;
    const Submission = require("../models/submission");
    const Problem = require("../models/problem");

    // Get total solved problems
    const solvedCount = user.problemSolved.length;
    
    // Calculate total points (assuming points per problem)
    const totalPoints = user.totalPoints || solvedCount * 100;
    
    // Get submission statistics
    const totalSubmissions = await Submission.countDocuments({ userId: user._id });
    const acceptedSubmissions = await Submission.countDocuments({ 
      userId: user._id, 
      status: "accepted" 
    });
    
    // Calculate accuracy
    const accuracy = totalSubmissions > 0 
      ? Math.round((acceptedSubmissions / totalSubmissions) * 100)
      : 0;
    
    // Calculate active days from streakHistory
    const totalActiveDays = user.streakHistory.filter(day => 
      day.problemCount > 0
    ).length;
    
    // Calculate submissions in past year
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    const submissionsPastYear = await Submission.countDocuments({
      userId: user._id,
      createdAt: { $gte: oneYearAgo }
    });
    
    // Get formatted streak history
    const streakHistory = formatStreakHistoryForDashboard(user.streakHistory);
    
    res.status(200).json({
      success: true,
      stats: {
        totalProblems: solvedCount,
        totalPoints,
        currentStreak: user.currentStreak || 0,
        maxStreak: user.maxStreak || 0,
        accuracy,
        totalSubmissions,
        acceptedSubmissions,
        totalActiveDays,
        submissionsPastYear,
        streakHistory // Include formatted history
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Helper function to format streak history for dashboard
function formatStreakHistoryForDashboard(streakHistory) {
  if (!streakHistory || streakHistory.length === 0) {
    return generateEmptyCalendar();
  }

  const calendar = [];
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - 370); // Last 371 days

  // Create a map of existing dates
  const existingDates = {};
  streakHistory.forEach(day => {
    const date = new Date(day.date);
    const dateStr = date.toISOString().split('T')[0];
    existingDates[dateStr] = {
      date: dateStr,
      problemCount: day.problemCount || 0,
      problemsSolved: day.problemsSolved || [],
      activityLevel: getActivityLevel(day.problemCount || 0)
    };
  });

  // Generate calendar for 371 days
  for (let i = 0; i < 371; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateString = date.toISOString().split('T')[0];
    
    const existingEntry = existingDates[dateString];
    
    calendar.push({
      date: dateString,
      problemCount: existingEntry ? existingEntry.problemCount : 0,
      problemsSolved: existingEntry ? existingEntry.problemsSolved : [],
      activityLevel: existingEntry ? existingEntry.activityLevel : 0
    });
  }

  return calendar;
}

function getActivityLevel(problemCount) {
  if (problemCount === 0) return 0;
  if (problemCount === 1) return 1;
  if (problemCount === 2) return 2;
  if (problemCount === 3) return 3;
  return 4;
}

function generateEmptyCalendar() {
  const calendar = [];
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - 370);
  
  for (let i = 0; i < 371; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    calendar.push({
      date: date.toISOString().split('T')[0],
      problemCount: 0,
      problemsSolved: [],
      activityLevel: 0
    });
  }
  
  return calendar;
}

// [NEW ROUTE]: Get user rank
authRouter.get("/rank", userMiddleware, async (req, res) => {
  try {
    const user = req.result;
    
    // Get all users sorted by totalPoints, then by problemSolved count
    const allUsers = await User.find({}, 'totalPoints problemSolved')
      .sort({ totalPoints: -1, problemSolved: -1 });
    
    // Find user's position (1-based index)
    const userIndex = allUsers.findIndex(u => 
      u._id.toString() === user._id.toString()
    );
    
    const rank = userIndex !== -1 ? userIndex + 1 : allUsers.length + 1;
    
    res.status(200).json({
      success: true,
      rank,
      totalUsers: allUsers.length,
      percentile: Math.round(((allUsers.length - rank) / allUsers.length) * 100)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// [NEW ROUTE]: Get detailed solved problems
authRouter.get("/solved-problems", userMiddleware, async (req, res) => {
  try {
    const user = req.result;
    const Problem = require("../models/problem");
    
    // Get solved problems with details
    const solvedProblems = await Problem.find({
      _id: { $in: user.problemSolved }
    })
    .select('title difficulty tags points')
    .sort({ createdAt: -1 });
    
    // Calculate difficulty counts
    const difficultyCounts = {
      easy: solvedProblems.filter(p => p.difficulty === 'easy').length,
      medium: solvedProblems.filter(p => p.difficulty === 'medium').length,
      hard: solvedProblems.filter(p => p.difficulty === 'hard').length
    };
    
    res.status(200).json({
      success: true,
      count: solvedProblems.length,
      difficultyCounts,
      problems: solvedProblems
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = authRouter;
// [file content end]