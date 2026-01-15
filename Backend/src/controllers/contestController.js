const Contest = require("../models/contest");
const Problem = require("../models/problem");
const User = require("../models/users");
const Submission = require("../models/submission");
const mongoose = require("mongoose");

// Create a new contest (Admin only)
const createContest = async (req, res) => {
    try {
        const {
            name,
            description,
            startTime,
            endTime,
            duration,
            rules,
            prizes,
            tags,
            problems,
            maxParticipants,
            isPublic,
            registrationOpen
        } = req.body;

        // Validate required fields
        if (!name || !description || !startTime || !endTime || !duration) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Validate start time is in the future
        const start = new Date(startTime);
        if (start <= new Date()) {
            return res.status(400).json({ error: "Start time must be in the future" });
        }

        // Validate end time is after start time
        const end = new Date(endTime);
        if (end <= start) {
            return res.status(400).json({ error: "End time must be after start time" });
        }

        // Validate duration matches
        const calculatedDuration = Math.floor((end - start) / (1000 * 60));
        if (calculatedDuration !== parseInt(duration)) {
            return res.status(400).json({ 
                error: `Duration (${duration} minutes) doesn't match start/end times difference (${calculatedDuration} minutes)` 
            });
        }

        // Validate problems exist
        if (problems && problems.length > 0) {
            const validProblems = await Problem.find({ _id: { $in: problems } });
            if (validProblems.length !== problems.length) {
                return res.status(400).json({ error: "One or more problems not found" });
            }
        }

        const contest = await Contest.create({
            name,
            description,
            startTime: start,
            endTime: end,
            duration,
            rules: rules || [],
            prizes: prizes || [],
            tags: tags || [],
            problems: problems || [],
            maxParticipants: maxParticipants || 1000,
            isPublic: isPublic !== undefined ? isPublic : true,
            registrationOpen: registrationOpen !== undefined ? registrationOpen : true,
            contestCreator: req.result._id,
            status: "upcoming"
        });

        res.status(201).json({
            message: "Contest created successfully",
            contest
        });

    } catch (err) {
        console.error("Create Contest Error:", err);
        res.status(500).json({ error: err.message });
    }
};

// Get all contests with filtering
const getAllContests = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const { status, search, sortBy = "startTime", sortOrder = "asc" } = req.query;

        // Build filter
        let filter = {};
        const now = new Date();

        if (status) {
            switch (status.toLowerCase()) {
                case "upcoming":
                    filter.startTime = { $gt: now };
                    break;
                case "live":
                    filter.startTime = { $lte: now };
                    filter.endTime = { $gte: now };
                    break;
                case "ended":
                    filter.endTime = { $lt: now };
                    break;
            }
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { tags: { $regex: search, $options: "i" } }
            ];
        }

        // Default: show only public contests for non-admins
        if (req.result.role !== "admin") {
            filter.isPublic = true;
        }

        // Sort
        const sort = {};
        sort[sortBy] = sortOrder === "desc" ? -1 : 1;

        const totalContests = await Contest.countDocuments(filter);
        const contests = await Contest.find(filter)
            .populate("contestCreator", "firstName lastName emailId")
            .populate("problems", "title difficulty tags points")
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean();

        // Add dynamic status based on current time
        const contestsWithStatus = contests.map(contest => {
            const start = new Date(contest.startTime);
            const end = new Date(contest.endTime);

            let dynamicStatus = "upcoming";
            if (start <= now && end >= now) {
                dynamicStatus = "live";
            } else if (end < now) {
                dynamicStatus = "ended";
            }

            // Check if user is participant
            const isParticipant = contest.participants?.some(p => 
                p.userId?.toString() === req.result._id.toString()
            ) || false;

            return {
                ...contest,
                dynamicStatus,
                isParticipant,
                participantsCount: contest.participants?.length || 0
            };
        });

        res.status(200).json({
            totalContests,
            currentPage: page,
            totalPages: Math.ceil(totalContests / limit),
            nextPage: page < Math.ceil(totalContests / limit) ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null,
            contests: contestsWithStatus
        });

    } catch (err) {
        console.error("Get All Contests Error:", err);
        res.status(500).json({ error: err.message });
    }
};

// Get contest by ID
const getContestById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid contest ID" });
        }

        const contest = await Contest.findById(id)
            .populate("contestCreator", "firstName lastName emailId")
            .populate("problems", "title description difficulty tags points constraints visibleTestCases startCode")
            .populate("participants.userId", "firstName lastName emailId")
            .lean();

        if (!contest) {
            return res.status(404).json({ error: "Contest not found" });
        }

        // Check if user is participant
        const participant = contest.participants?.find(p => 
            p.userId?._id?.toString() === req.result._id.toString()
        );

        const isParticipant = !!participant;

        // Check if user can view contest (public or participant or admin)
        if (!contest.isPublic && !isParticipant && req.result.role !== "admin") {
            return res.status(403).json({ error: "You don't have permission to view this contest" });
        }

        const now = new Date();
        const start = new Date(contest.startTime);
        const end = new Date(contest.endTime);

        let dynamicStatus = "upcoming";
        if (start <= now && end >= now) {
            dynamicStatus = "live";
        } else if (end < now) {
            dynamicStatus = "ended";
        }

        // Calculate time remaining
        let timeRemaining = null;
        let timeRemainingText = "";
        if (dynamicStatus === "upcoming") {
            timeRemaining = start - now;
            const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            timeRemainingText = `Starts in ${days}d ${hours}h ${minutes}m`;
        } else if (dynamicStatus === "live") {
            timeRemaining = end - now;
            const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            timeRemainingText = `Ends in ${hours}h ${minutes}m`;
        }

        // Get user's submissions for this contest
        let userSubmissions = [];
        if (isParticipant && contest.problems.length > 0) {
            userSubmissions = await Submission.find({
                userId: req.result._id,
                problemId: { $in: contest.problems.map(p => p._id) }
            }).sort({ createdAt: -1 }).limit(20);
        }

        // Prepare participant data
        const participantData = isParticipant ? {
            score: participant.score,
            problemsSolved: participant.problemsSolved?.length || 0,
            rank: participant.rank
        } : null;

        res.status(200).json({
            ...contest,
            dynamicStatus,
            timeRemaining,
            timeRemainingText,
            isParticipant,
            participantData,
            userSubmissions
        });

    } catch (err) {
        console.error("Get Contest By ID Error:", err);
        res.status(500).json({ error: err.message });
    }
};

// Register for a contest
const registerForContest = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.result._id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid contest ID" });
        }

        const contest = await Contest.findById(id);
        if (!contest) {
            return res.status(404).json({ error: "Contest not found" });
        }

        // Check if contest is public
        if (!contest.isPublic && req.result.role !== "admin") {
            return res.status(403).json({ error: "This contest is not public" });
        }

        // Check if registration is open
        if (!contest.registrationOpen) {
            return res.status(400).json({ error: "Registration is closed for this contest" });
        }

        // Check if contest has started
        const now = new Date();
        if (now >= new Date(contest.startTime)) {
            return res.status(400).json({ error: "Cannot register after contest has started" });
        }

        // Check if already registered
        const alreadyRegistered = contest.participants.some(p => 
            p.userId.toString() === userId.toString()
        );

        if (alreadyRegistered) {
            return res.status(400).json({ error: "Already registered for this contest" });
        }

        // Check max participants
        if (contest.participants.length >= contest.maxParticipants) {
            return res.status(400).json({ error: "Contest is full" });
        }

        // Register user
        contest.participants.push({
            userId,
            joinedAt: now,
            score: 0,
            problemsSolved: [],
            timeTaken: 0
        });

        await contest.save();

        res.status(200).json({
            message: "Successfully registered for the contest",
            contestId: contest._id
        });

    } catch (err) {
        console.error("Register Contest Error:", err);
        res.status(500).json({ error: err.message });
    }
};

// Submit problem solution during contest
const submitContestProblem = async (req, res) => {
    try {
        const { contestId, problemId } = req.params;
        const { code, language } = req.body;
        const userId = req.result._id;

        // Validate inputs
        if (!code || !language) {
            return res.status(400).json({ error: "Code and language are required" });
        }

        // Check contest exists
        const contest = await Contest.findById(contestId);
        if (!contest) {
            return res.status(404).json({ error: "Contest not found" });
        }

        // Check if user is registered
        const participantIndex = contest.participants.findIndex(p => 
            p.userId.toString() === userId.toString()
        );

        if (participantIndex === -1) {
            return res.status(403).json({ error: "You are not registered for this contest" });
        }

        // Check if contest is live
        const now = new Date();
        const start = new Date(contest.startTime);
        const end = new Date(contest.endTime);

        if (now < start) {
            return res.status(400).json({ error: "Contest hasn't started yet" });
        }

        if (now > end) {
            return res.status(400).json({ error: "Contest has ended" });
        }

        // Check if problem exists in contest
        if (!contest.problems.some(p => p.toString() === problemId)) {
            return res.status(404).json({ error: "Problem not found in contest" });
        }

        // Get problem details
        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).json({ error: "Problem not found" });
        }

        // Check if already solved
        const participant = contest.participants[participantIndex];
        const alreadySolved = participant.problemsSolved.some(p => 
            p.problemId && p.problemId.toString() === problemId
        );

        if (alreadySolved) {
            return res.status(400).json({ error: "Problem already solved" });
        }

        // Use existing submission logic from userSubmission.js
        const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility");

        // Run code against test cases
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
        let status = "failed";

        for (const test of judgeResults) {
            if (test.status_id === 3) {
                testCasesPassed++;
            }
            runtime += parseFloat(test.time || 0);
        }

        // Check if all test cases passed
        if (testCasesPassed === problem.hiddenTestCases.length) {
            status = "accepted";
            
            // Calculate points (based on time taken from contest start)
            const contestStart = new Date(contest.startTime);
            const timeTakenMinutes = Math.floor((now - contestStart) / (1000 * 60));
            
            // Base points + bonus for solving quickly
            const basePoints = problem.points || 100;
            const timeBonus = Math.max(50 - timeTakenMinutes, 0); // Bonus reduces over time
            const points = basePoints + timeBonus;

            // Update participant's score
            contest.participants[participantIndex].score += points;
            contest.participants[participantIndex].problemsSolved.push({
                problemId,
                solvedAt: now,
                points
            });
            
            // Update time taken
            if (!contest.participants[participantIndex].timeTaken) {
                contest.participants[participantIndex].timeTaken = timeTakenMinutes;
            }
            
            // Save submission
            const submission = await Submission.create({
                userId,
                problemId,
                code,
                language,
                status: "accepted",
                runtime,
                memory: 0,
                testCasesPassed,
                testCasesTotal: problem.hiddenTestCases.length
            });

            // Update submission ID
            const lastIndex = contest.participants[participantIndex].problemsSolved.length - 1;
            contest.participants[participantIndex].problemsSolved[lastIndex].submissionId = submission._id;
            
            // Update leaderboard
            await updateLeaderboard(contest);
        } else {
            // Save failed submission for record
            await Submission.create({
                userId,
                problemId,
                code,
                language,
                status: "wrong",
                runtime,
                memory: 0,
                testCasesPassed,
                testCasesTotal: problem.hiddenTestCases.length
            });
        }

        await contest.save();

        res.status(200).json({
            accepted: status === "accepted",
            testCasesPassed,
            totalTestCases: problem.hiddenTestCases.length,
            runtime,
            status,
            message: status === "accepted" ? "Problem solved successfully!" : "Some test cases failed"
        });

    } catch (err) {
        console.error("Contest Submission Error:", err);
        res.status(500).json({ error: err.message });
    }
};

// Update contest leaderboard
const updateLeaderboard = async (contest) => {
    try {
        // Calculate leaderboard based on score and time taken
        const participantsWithScore = contest.participants
            .filter(p => p.score > 0);

        // Sort by score (desc), then problems solved (desc), then time taken (asc)
        participantsWithScore.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            const bSolved = b.problemsSolved?.length || 0;
            const aSolved = a.problemsSolved?.length || 0;
            if (bSolved !== aSolved) return bSolved - aSolved;
            return (a.timeTaken || Infinity) - (b.timeTaken || Infinity);
        });

        // Assign ranks and update participants
        const leaderboard = [];
        participantsWithScore.forEach((participant, index) => {
            const rank = index + 1;
            
            // Update participant's rank
            const participantIndex = contest.participants.findIndex(
                p => p.userId.toString() === participant.userId.toString()
            );
            if (participantIndex !== -1) {
                contest.participants[participantIndex].rank = rank;
            }

            leaderboard.push({
                userId: participant.userId,
                score: participant.score,
                problemsSolved: participant.problemsSolved?.length || 0,
                timeTaken: participant.timeTaken || 0,
                rank: rank
            });
        });

        contest.leaderboard = leaderboard;
        await contest.save();

    } catch (err) {
        console.error("Update Leaderboard Error:", err);
        throw err;
    }
};

// Get contest leaderboard
const getContestLeaderboard = async (req, res) => {
    try {
        const { id } = req.params;

        const contest = await Contest.findById(id)
            .populate("leaderboard.userId", "firstName lastName emailId")
            .populate("participants.userId", "firstName lastName emailId")
            .lean();

        if (!contest) {
            return res.status(404).json({ error: "Contest not found" });
        }

        // If leaderboard is empty but we have participants with scores, calculate it
        if ((!contest.leaderboard || contest.leaderboard.length === 0) && contest.participants.length > 0) {
            const tempContest = await Contest.findById(id);
            await updateLeaderboard(tempContest);
            
            // Re-fetch with updated leaderboard
            const updatedContest = await Contest.findById(id)
                .populate("leaderboard.userId", "firstName lastName emailId");
            
            contest.leaderboard = updatedContest.leaderboard;
        }

        // Get user's position if they're a participant
        let userRank = null;
        let userScore = null;
        if (contest.participants) {
            const userParticipant = contest.participants.find(p => 
                p.userId && p.userId._id && p.userId._id.toString() === req.result._id.toString()
            );
            if (userParticipant) {
                userRank = userParticipant.rank;
                userScore = userParticipant.score;
            }
        }

        res.status(200).json({
            contestName: contest.name,
            contestStatus: contest.status,
            leaderboard: contest.leaderboard || [],
            userRank,
            userScore,
            totalParticipants: contest.participants?.length || 0
        });

    } catch (err) {
        console.error("Get Leaderboard Error:", err);
        res.status(500).json({ error: err.message });
    }
};

// Update contest (Admin only)
const updateContest = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid contest ID" });
        }

        const contest = await Contest.findById(id);
        if (!contest) {
            return res.status(404).json({ error: "Contest not found" });
        }

        // Don't allow updating if contest has started and is not superadmin
        const now = new Date();
        if (now >= contest.startTime && req.result.role !== "superadmin") {
            return res.status(400).json({ error: "Cannot update contest after it has started" });
        }

        // Don't allow changing problems if contest has participants
        if (updates.problems && contest.participants.length > 0) {
            return res.status(400).json({ error: "Cannot change problems after participants have registered" });
        }

        // Update allowed fields
        const allowedUpdates = [
            'name', 'description', 'startTime', 'endTime', 'duration',
            'rules', 'prizes', 'tags', 'problems', 'maxParticipants',
            'isPublic', 'registrationOpen'
        ];

        allowedUpdates.forEach(field => {
            if (updates[field] !== undefined) {
                contest[field] = updates[field];
            }
        });

        // Recalculate duration if times changed
        if (updates.startTime || updates.endTime) {
            const start = updates.startTime ? new Date(updates.startTime) : contest.startTime;
            const end = updates.endTime ? new Date(updates.endTime) : contest.endTime;
            contest.duration = Math.floor((end - start) / (1000 * 60));
        }

        // Update status based on new times
        const start = new Date(contest.startTime);
        const end = new Date(contest.endTime);
        
        if (now < start) {
            contest.status = "upcoming";
        } else if (now <= end) {
            contest.status = "live";
        } else {
            contest.status = "ended";
        }

        await contest.save();

        res.status(200).json({
            message: "Contest updated successfully",
            contest
        });

    } catch (err) {
        console.error("Update Contest Error:", err);
        res.status(500).json({ error: err.message });
    }
};

// Delete contest (Admin only)
const deleteContest = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid contest ID" });
        }

        const contest = await Contest.findById(id);
        if (!contest) {
            return res.status(404).json({ error: "Contest not found" });
        }

        // Don't allow deletion if contest has started
        const now = new Date();
        if (now >= contest.startTime && req.result.role !== "superadmin") {
            return res.status(400).json({ 
                error: "Cannot delete contest after it has started. Consider ending it instead." 
            });
        }

        // Delete all submissions related to contest problems
        if (contest.problems.length > 0) {
            await Submission.deleteMany({
                problemId: { $in: contest.problems }
            });
        }

        await Contest.findByIdAndDelete(id);

        res.status(200).json({
            message: "Contest deleted successfully"
        });

    } catch (err) {
        console.error("Delete Contest Error:", err);
        res.status(500).json({ error: err.message });
    }
};

// Get user's contest submissions
const getUserContestSubmissions = async (req, res) => {
    try {
        const { contestId } = req.params;
        const userId = req.result._id;

        const contest = await Contest.findById(contestId);
        if (!contest) {
            return res.status(404).json({ error: "Contest not found" });
        }

        // Check if user is participant
        const isParticipant = contest.participants.some(p => 
            p.userId.toString() === userId.toString()
        );

        if (!isParticipant && req.result.role !== "admin") {
            return res.status(403).json({ error: "You are not a participant in this contest" });
        }

        const submissions = await Submission.find({
            userId,
            problemId: { $in: contest.problems }
        })
        .populate("problemId", "title difficulty points")
        .sort({ createdAt: -1 });

        res.status(200).json({
            contestName: contest.name,
            submissions
        });

    } catch (err) {
        console.error("Get User Contest Submissions Error:", err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createContest,
    getAllContests,
    getContestById,
    registerForContest,
    submitContestProblem,
    getContestLeaderboard,
    updateContest,
    deleteContest,
    getUserContestSubmissions
};