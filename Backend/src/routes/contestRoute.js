const express = require('express');
const contestRouter = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");
const userMiddleware = require("../middleware/userMiddleware");
const {
    createContest,
    getAllContests,
    getContestById,
    registerForContest,
    submitContestProblem,
    getContestLeaderboard,
    updateContest,
    deleteContest,
    getUserContestSubmissions
} = require("../controllers/contestController");

// Admin routes
contestRouter.post("/create", adminMiddleware, createContest);
contestRouter.put("/update/:id", adminMiddleware, updateContest);
contestRouter.delete("/delete/:id", adminMiddleware, deleteContest);

// User routes
contestRouter.get("/getAllContests", userMiddleware, getAllContests);
contestRouter.get("/getContest/:id", userMiddleware, getContestById);
contestRouter.post("/register/:id", userMiddleware, registerForContest);
contestRouter.post("/submit/:contestId/:problemId", userMiddleware, submitContestProblem);
contestRouter.get("/leaderboard/:id", userMiddleware, getContestLeaderboard);
contestRouter.get("/submissions/:contestId", userMiddleware, getUserContestSubmissions);

module.exports = contestRouter;