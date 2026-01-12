const Submission = require("../models/submission");
const User = require("../models/users");
const Problem = require("../models/problem");

const getDashboard = async (req, res) => {
  // try {
  //   const userId = req.result._id;

  //   /* -----------------------------
  //      1. FETCH USER PROFILE WITH SOLVED PROBLEMS
  //   -------------------------------*/
  //   const user = await User.findById(userId)
  //     .select("firstName lastName emailId age")
  //     .populate({
  //       path: "problemSolved",
  //       select: "title difficulty points tags"
  //     });

  //   if (!user) {
  //     return res.status(404).json({ error: "User not found" });
  //   }

  //   /* -----------------------------
  //      2. FETCH SUBMISSIONS
  //   -------------------------------*/
  //   const submissions = await Submission.find({ userId })
  //     .populate("problemId", "title difficulty points tags")
  //     .sort({ createdAt: -1 })
  //     .limit(1000)
  //     .lean();

  //   /* -----------------------------
  //      3. CALCULATE STATS
  //   -------------------------------*/
  //   const solvedProblems = user.problemSolved || [];
    
  //   const stats = { 
  //     solved: solvedProblems.length, 
  //     easy: 0, 
  //     medium: 0, 
  //     hard: 0,
  //     totalSubmissions: submissions.length,
  //     acceptanceRate: 0
  //   };

  //   // Count by difficulty
  //   solvedProblems.forEach(problem => {
  //     if (problem.difficulty === "easy") stats.easy++;
  //     else if (problem.difficulty === "medium") stats.medium++;
  //     else if (problem.difficulty === "hard") stats.hard++;
  //   });

  //   // Calculate acceptance rate
  //   const acceptedSubs = submissions.filter(s => s.status === "accepted");
  //   if (submissions.length > 0) {
  //     stats.acceptanceRate = Math.round((acceptedSubs.length / submissions.length) * 100);
  //   }

  //   /* -----------------------------
  //      4. HEATMAP DATA (Last 90 days)
  //   -------------------------------*/
  //   const heatmap = {};
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);
    
  //   // Initialize last 90 days with 0
  //   for (let i = 89; i >= 0; i--) {
  //     const date = new Date(today);
  //     date.setDate(date.getDate() - i);
  //     const dateStr = date.toISOString().split("T")[0];
  //     heatmap[dateStr] = 0;
  //   }

  //   // Count accepted submissions per day
  //   const ninetyDaysAgo = new Date(today);
  //   ninetyDaysAgo.setDate(today.getDate() - 89);
    
  //   acceptedSubs.forEach(s => {
  //     if (s.createdAt) {
  //       const subDate = new Date(s.createdAt);
  //       subDate.setHours(0, 0, 0, 0);
        
  //       if (subDate >= ninetyDaysAgo && subDate <= today) {
  //         const dateStr = subDate.toISOString().split("T")[0];
  //         heatmap[dateStr] = (heatmap[dateStr] || 0) + 1;
  //       }
  //     }
  //   });

  //   /* -----------------------------
  //      5. STREAK CALCULATION
  //   -------------------------------*/
  //   const streak = { current: 0, max: 0 };
    
  //   if (acceptedSubs.length > 0) {
  //     // Get unique submission dates
  //     const submissionDatesSet = new Set();
  //     acceptedSubs.forEach(s => {
  //       if (s.createdAt) {
  //         const date = new Date(s.createdAt);
  //         date.setHours(0, 0, 0, 0);
  //         submissionDatesSet.add(date.toISOString().split("T")[0]);
  //       }
  //     });
      
  //     const submissionDates = Array.from(submissionDatesSet).sort();
      
  //     let consecutive = 1;
  //     let maxStreak = 1;
      
  //     for (let i = 1; i < submissionDates.length; i++) {
  //       const prevDate = new Date(submissionDates[i - 1]);
  //       const currDate = new Date(submissionDates[i]);
  //       const diffDays = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));
        
  //       if (diffDays === 1) {
  //         consecutive++;
  //         maxStreak = Math.max(maxStreak, consecutive);
  //       } else if (diffDays > 1) {
  //         consecutive = 1;
  //       }
  //     }
      
  //     // Check current streak
  //     if (submissionDates.length > 0) {
  //       const lastSubmissionDate = new Date(submissionDates[submissionDates.length - 1]);
  //       const todayMidnight = new Date();
  //       todayMidnight.setHours(0, 0, 0, 0);
        
  //       const diffFromToday = Math.floor((todayMidnight - lastSubmissionDate) / (1000 * 60 * 60 * 24));
        
  //       if (diffFromToday === 0 || diffFromToday === 1) {
  //         streak.current = consecutive;
  //       }
  //     }
      
  //     streak.max = maxStreak;
  //   }

  //   /* -----------------------------
  //      6. POINTS CALCULATION
  //   -------------------------------*/
  //   let points = 0;
  //   solvedProblems.forEach(problem => {
  //     if (problem.difficulty === "easy") points += problem.points || 100;
  //     else if (problem.difficulty === "medium") points += problem.points || 200;
  //     else if (problem.difficulty === "hard") points += problem.points || 300;
  //   });

  //   /* -----------------------------
  //      7. TOP TAGS FROM SOLVED PROBLEMS
  //   -------------------------------*/
  //   const tagCounts = {};
  //   solvedProblems.forEach(problem => {
  //     if (problem.tags && Array.isArray(problem.tags)) {
  //       problem.tags.forEach(tag => {
  //         tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  //       });
  //     }
  //   });

  //   const topTags = Object.entries(tagCounts)
  //     .sort((a, b) => b[1] - a[1])
  //     .slice(0, 5)
  //     .map(([tag, count]) => ({ tag, count }));

  //   /* -----------------------------
  //      8. RECENT ACTIVITY
  //   -------------------------------*/
  //   const recentActivity = submissions.slice(0, 5).map(s => ({
  //     _id: s._id,
  //     problem: s.problemId?.title || "Unknown Problem",
  //     difficulty: s.problemId?.difficulty || "medium",
  //     language: s.language,
  //     status: s.status,
  //     runtime: s.runtime,
  //     memory: s.memory,
  //     createdAt: s.createdAt
  //   }));

  //   /* -----------------------------
  //      9. RESPONSE
  //   -------------------------------*/
  //   res.status(200).json({
  //     profile: {
  //       firstName: user.firstName,
  //       lastName: user.lastName || "",
  //       emailId: user.emailId,
  //       age: user.age || 0
  //     },
  //     stats,
  //     streak,
  //     points,
  //     heatmap,
  //     topTags,
  //     recentActivity,
  //     solvedProblems: solvedProblems,
  //     rank: 0// Mock rank for now
  //   });

  // } catch (err) {
  //   console.error("Dashboard Error:", err);
  //   res.status(500).json({ error: err.message });
  // }
};

module.exports = { getDashboard };