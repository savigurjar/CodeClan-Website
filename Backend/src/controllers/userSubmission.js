
const Problem = require("../models/problem");
const Submission = require("../models/submission")
const User = require("../models/users");
const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility")

const submitCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    const { code, language } = req.body;

    if (!userId || !code || !problemId || !language) {
      return res.status(400).send("Some fields are missing");
    }

    const problem = await Problem.findById(problemId);
    const user = await User.findById(userId);

    const submittedResult = await Submission.create({
      userId,
      problemId,
      code,
      language,
      testCasesTotal: problem.hiddenTestCases.length,
      status: "pending"
    });

    const languageId = getLanguageById(language);
    const submissions = problem.hiddenTestCases.map((tc) => ({
      source_code: code,
      language_id: languageId,
      stdin: tc.input,
      expected_output: tc.output
    }));

    const submitResult = await submitBatch(submissions);
    const tokens = submitResult.map((t) => t.token);
    const judgeResults = await submitToken(tokens);

    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = "accepted";

    const testResult = judgeResults.map((test, i) => {
      let tcStatus = test.status_id;
      if (tcStatus === 3) testCasesPassed++;
      runtime += parseFloat(test.time || 0);
      memory = Math.max(memory, test.memory || 0);

      if (![3].includes(tcStatus)) status = "failed";

      return {
        stdin: problem.hiddenTestCases[i].input,
        expected_output: problem.hiddenTestCases[i].output,
        stdout: test.stdout || "",
        status_id: test.status_id,
        runtime: parseFloat(test.time || 0),
        memory: test.memory || 0,
        error: test.stderr || test.compile_output || null,
        explanation: problem.hiddenTestCases[i].explanation || "",
      };
    });

    submittedResult.status = status;
    submittedResult.testCasesPassed = testCasesPassed;
    submittedResult.runtime = runtime;
    submittedResult.memory = memory;
    await submittedResult.save();

    // UPDATE USER STATS IF PROBLEM SOLVED
    if (status === "accepted" && !req.result.problemSolved.includes(problemId)) {
      // Add to solved problems
      req.result.problemSolved.push(problemId);
      
      // Add points (100 points per problem)
      // req.result.totalPoints += 100;
      
      // Update streak with today's date
      // await updateUserStreak(req.result, problemId);
      
      await req.result.save();
    }

    res.status(201).json({
      accepted: status === "accepted",
      totalTestCases: submittedResult.testCasesTotal,
      passedTestCases: testCasesPassed,
      runtime,
      memory,
      testCases: testResult
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Execution failed" });
  }
};

// // Helper function to update streak based on schema
// const updateUserStreak = async (user, problemId) => {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
  
//   const yesterday = new Date(today);
//   yesterday.setDate(yesterday.getDate() - 1);
  
//   const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
//   let shouldIncrementStreak = false;

//   // Check if last activity was yesterday
//   if (lastActive) {
//     const lastActiveDate = new Date(lastActive);
//     lastActiveDate.setHours(0, 0, 0, 0);
    
//     if (lastActiveDate.getTime() === yesterday.getTime()) {
//       // User was active yesterday, maintain streak
//       shouldIncrementStreak = true;
//     } else if (lastActiveDate.getTime() === today.getTime()) {
//       // User already active today, don't increment
//       shouldIncrementStreak = false;
//     } else {
//       // Break in streak, reset to 1
//       user.currentStreak = 1;
//       shouldIncrementStreak = false;
//     }
//   } else {
//     // First time activity
//     user.currentStreak = 1;
//     shouldIncrementStreak = false;
//   }
  
//   if (shouldIncrementStreak) {
//     user.currentStreak += 1;
//   }
  
//   // Update max streak if current is higher
//   if (user.currentStreak > user.maxStreak) {
//     user.maxStreak = user.currentStreak;
//   }
  
//   // Update streak history
//   const existingEntryIndex = user.streakHistory.findIndex(entry => {
//     const entryDate = new Date(entry.date);
//     entryDate.setHours(0, 0, 0, 0);
//     return entryDate.getTime() === today.getTime();
//   });
  
//   if (existingEntryIndex >= 0) {
//     // Update existing entry
//     user.streakHistory[existingEntryIndex].problemCount += 1;
//     if (!user.streakHistory[existingEntryIndex].problemsSolved.includes(problemId)) {
//       user.streakHistory[existingEntryIndex].problemsSolved.push(problemId);
//     }
//   } else {
//     // Add new entry
//     user.streakHistory.push({
//       date: today,
//       problemCount: 1,
//       problemsSolved: [problemId]
//     });
//   }
  
//   // Keep only last 400 days of history (13 months)
//   if (user.streakHistory.length > 400) {
//     user.streakHistory = user.streakHistory.slice(-400);
//   }
  
//   // Update last active date
//   user.lastActiveDate = today;
// };

const runCode = async (req, res) => {
  try {
    const { code, language } = req.body;
    const problem = await Problem.findById(req.params.id);

    const languageId = getLanguageById(language);
    const submissions = problem.hiddenTestCases.map(tc => ({
      source_code: code,
      language_id: languageId,
      stdin: tc.input,
      expected_output: tc.output
    }));

    const submitResult = await submitBatch(submissions);
    const tokens = submitResult.map(t => t.token);
    const judgeResults = await submitToken(tokens);

    const testCases = judgeResults.map((test, i) => ({
      stdin: problem.hiddenTestCases[i].input,
      expected_output: problem.hiddenTestCases[i].output,
      stdout: test.stdout || "",
      status_id: test.status_id,
      runtime: parseFloat(test.time || 0),
      memory: test.memory || 0,
      error: test.stderr || test.compile_output || null,
      explanation: problem.hiddenTestCases[i].explanation || ""
    }));

    res.status(201).json({
      success: testCases.every(t => t.status_id === 3),
      runtime: testCases.reduce((a,b) => a + b.runtime, 0),
      memory: Math.max(...testCases.map(t => t.memory)),
      testCases
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Execution failed" });
  }
};

module.exports = { submitCode, runCode }
