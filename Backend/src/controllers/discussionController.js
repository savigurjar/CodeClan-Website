const Discuss = require("../models/discuss");
const { validateDiscussion } = require("../utils/validateDiscussion");

// Create a new discussion
const createDiscussion = async (req, res) => {
  try {
    await validateDiscussion(req.body);
    
    const discussion = new Discuss({
      ...req.body,
      author: req.result._id,
      isPublished: true,
      upvotes: [],
      downvotes: [],
      isPinned: false
    });

    await discussion.save();
    
    // Populate author info
    await discussion.populate("author", "firstName lastName emailId");
    
    // Calculate score
    const discussionObj = discussion.toObject();
    discussionObj.score = discussion.upvotes.length - discussion.downvotes.length;

    res.status(201).json({
      success: true,
      discussion: discussionObj,
      message: "Discussion created successfully"
    });
  } catch (err) {
    console.error("Create Discussion Error:", err);
    res.status(400).json({ success: false, error: err.message });
  }
};

// Get all discussions with pagination and filters
const getAllDiscussions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search = "",
      sortBy = "newest",
      tag = "",
      author = "",
      pinned = "true"
    } = req.query;

    const query = { isPublished: true };

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } }
      ];
    }

    // Tag filter
    if (tag) {
      query.tags = { $in: [tag] };
    }

    // Author filter
    if (author) {
      query.author = author;
    }

    // Sort options
    let sort = {};
    if (pinned === "true") {
      sort.isPinned = -1;
    }
    
    switch (sortBy) {
      case "top":
        // We'll sort after fetching based on score
        break;
      case "most_upvoted":
        // Sort by upvotes count
        break;
      case "controversial":
        // Sort by controversial score
        break;
      case "oldest":
        sort.createdAt = 1;
        break;
      default: // newest
        sort.createdAt = -1;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitInt = parseInt(limit);

    // Get discussions
    let discussions = await Discuss.find(query)
      .populate("author", "firstName lastName emailId")
      .skip(skip)
      .limit(limitInt)
      .lean();

    // Add calculated fields
    discussions = discussions.map(disc => ({
      ...disc,
      upvoteCount: disc.upvotes ? disc.upvotes.length : 0,
      downvoteCount: disc.downvotes ? disc.downvotes.length : 0,
      score: (disc.upvotes ? disc.upvotes.length : 0) - (disc.downvotes ? disc.downvotes.length : 0)
    }));

    // Apply custom sorting
    if (sortBy === "top") {
      discussions.sort((a, b) => b.score - a.score);
    } else if (sortBy === "most_upvoted") {
      discussions.sort((a, b) => b.upvoteCount - a.upvoteCount);
    } else if (sortBy === "controversial") {
      // Controversial = high upvotes AND high downvotes
      discussions.sort((a, b) => {
        const aControversy = Math.min(a.upvoteCount, a.downvoteCount);
        const bControversy = Math.min(b.upvoteCount, b.downvoteCount);
        return bControversy - aControversy;
      });
    }

    // Get total count for pagination
    const total = await Discuss.countDocuments(query);
    const totalPages = Math.ceil(total / limitInt);

    res.status(200).json({
      success: true,
      discussions,
      pagination: {
        page: parseInt(page),
        limit: limitInt,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    console.error("Get Discussions Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get single discussion by ID
const getDiscussionById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const discussion = await Discuss.findById(id)
      .populate("author", "firstName lastName emailId socialProfiles")
      .populate("upvotes", "firstName lastName")
      .populate("downvotes", "firstName lastName");
    
    if (!discussion) {
      return res.status(404).json({
        success: false,
        error: "Discussion not found"
      });
    }

    // Calculate score
    const discussionObj = discussion.toObject();
    discussionObj.upvoteCount = discussion.upvotes.length;
    discussionObj.downvoteCount = discussion.downvotes.length;
    discussionObj.score = discussionObj.upvoteCount - discussionObj.downvoteCount;

    res.status(200).json({
      success: true,
      discussion: discussionObj
    });
  } catch (err) {
    console.error("Get Discussion Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update discussion
const updateDiscussion = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingDiscussion = await Discuss.findById(id);
    if (!existingDiscussion) {
      return res.status(404).json({
        success: false,
        error: "Discussion not found"
      });
    }

    // Check if user is the author or admin
    if (existingDiscussion.author.toString() !== req.result._id.toString() && 
        req.result.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Unauthorized to update this discussion"
      });
    }

    await validateDiscussion(req.body);

    const updatedDiscussion = await Discuss.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    ).populate("author", "firstName lastName emailId");

    // Add calculated fields
    const discussionObj = updatedDiscussion.toObject();
    discussionObj.upvoteCount = updatedDiscussion.upvotes.length;
    discussionObj.downvoteCount = updatedDiscussion.downvotes.length;
    discussionObj.score = discussionObj.upvoteCount - discussionObj.downvoteCount;

    res.status(200).json({
      success: true,
      discussion: discussionObj,
      message: "Discussion updated successfully"
    });
  } catch (err) {
    console.error("Update Discussion Error:", err);
    res.status(400).json({ success: false, error: err.message });
  }
};

// Delete discussion
const deleteDiscussion = async (req, res) => {
  try {
    const { id } = req.params;
    
    const discussion = await Discuss.findById(id);
    
    if (!discussion) {
      return res.status(404).json({
        success: false,
        error: "Discussion not found"
      });
    }

    // Check if user is the author or admin
    if (discussion.author.toString() !== req.result._id.toString() && 
        req.result.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Unauthorized to delete this discussion"
      });
    }

    // Soft delete for users, hard delete for admin
    if (req.result.role === "admin") {
      await Discuss.findByIdAndDelete(id);
    } else {
      discussion.isPublished = false;
      await discussion.save();
    }

    res.status(200).json({
      success: true,
      message: "Discussion deleted successfully"
    });
  } catch (err) {
    console.error("Delete Discussion Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Vote on discussion
const voteDiscussion = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body; // 'upvote' or 'downvote'
    const userId = req.result._id;
    
    const discussion = await Discuss.findById(id);
    
    if (!discussion) {
      return res.status(404).json({
        success: false,
        error: "Discussion not found"
      });
    }

    // Check if user is the author (can't vote on own post)
    if (discussion.author.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        error: "You cannot vote on your own discussion"
      });
    }

    const hasUpvoted = discussion.upvotes.some(uid => uid.toString() === userId.toString());
    const hasDownvoted = discussion.downvotes.some(uid => uid.toString() === userId.toString());

    if (type === "upvote") {
      if (hasUpvoted) {
        // Remove upvote
        discussion.upvotes = discussion.upvotes.filter(uid => uid.toString() !== userId.toString());
      } else {
        // Add upvote, remove downvote if exists
        discussion.upvotes.push(userId);
        discussion.downvotes = discussion.downvotes.filter(uid => uid.toString() !== userId.toString());
      }
    } else if (type === "downvote") {
      if (hasDownvoted) {
        // Remove downvote
        discussion.downvotes = discussion.downvotes.filter(uid => uid.toString() !== userId.toString());
      } else {
        // Add downvote, remove upvote if exists
        discussion.downvotes.push(userId);
        discussion.upvotes = discussion.upvotes.filter(uid => uid.toString() !== userId.toString());
      }
    } else {
      return res.status(400).json({
        success: false,
        error: "Invalid vote type"
      });
    }

    await discussion.save();

    // Get updated counts
    const upvoteCount = discussion.upvotes.length;
    const downvoteCount = discussion.downvotes.length;
    const score = upvoteCount - downvoteCount;

    res.status(200).json({
      success: true,
      upvoteCount,
      downvoteCount,
      score,
      userVote: hasUpvoted ? "upvote" : hasDownvoted ? "downvote" : "none",
      message: "Vote recorded successfully"
    });
  } catch (err) {
    console.error("Vote Discussion Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Toggle pin status (admin only)
const togglePinDiscussion = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (req.result.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Admin access required"
      });
    }

    const discussion = await Discuss.findById(id);
    
    if (!discussion) {
      return res.status(404).json({
        success: false,
        error: "Discussion not found"
      });
    }

    discussion.isPinned = !discussion.isPinned;
    await discussion.save();

    res.status(200).json({
      success: true,
      isPinned: discussion.isPinned,
      message: discussion.isPinned ? "Discussion pinned" : "Discussion unpinned"
    });
  } catch (err) {
    console.error("Toggle Pin Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get user's discussions
const getUserDiscussions = async (req, res) => {
  try {
    const userId = req.result._id;
    
    const discussions = await Discuss.find({ 
      author: userId,
      isPublished: true 
    })
    .populate("author", "firstName lastName emailId")
    .sort({ createdAt: -1 });

    // Add calculated fields
    const discussionsWithStats = discussions.map(disc => {
      const discussionObj = disc.toObject();
      discussionObj.upvoteCount = disc.upvotes.length;
      discussionObj.downvoteCount = disc.downvotes.length;
      discussionObj.score = discussionObj.upvoteCount - discussionObj.downvoteCount;
      return discussionObj;
    });

    res.status(200).json({
      success: true,
      discussions: discussionsWithStats,
      count: discussions.length
    });
  } catch (err) {
    console.error("Get User Discussions Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get trending discussions (based on score and recency)
const getTrendingDiscussions = async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const discussions = await Discuss.find({ 
      isPublished: true,
      createdAt: { $gte: oneWeekAgo }
    })
    .populate("author", "firstName lastName")
    .limit(10)
    .lean();

    // Calculate trending score (score * time decay)
    const discussionsWithTrending = discussions.map(disc => {
      const upvoteCount = disc.upvotes ? disc.upvotes.length : 0;
      const downvoteCount = disc.downvotes ? disc.downvotes.length : 0;
      const score = upvoteCount - downvoteCount;
      
      // Time decay: newer posts get higher weight
      const hoursOld = (new Date() - new Date(disc.createdAt)) / (1000 * 60 * 60);
      const timeWeight = Math.max(0.1, 1 - (hoursOld / 168)); // 1 week = 168 hours
      
      const trendingScore = score * timeWeight;
      
      return {
        ...disc,
        upvoteCount,
        downvoteCount,
        score,
        trendingScore
      };
    });

    // Sort by trending score
    discussionsWithTrending.sort((a, b) => b.trendingScore - a.trendingScore);

    res.status(200).json({
      success: true,
      discussions: discussionsWithTrending.slice(0, 5) // Top 5 trending
    });
  } catch (err) {
    console.error("Get Trending Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get pinned discussions
const getPinnedDiscussions = async (req, res) => {
  try {
    const discussions = await Discuss.find({ 
      isPublished: true,
      isPinned: true 
    })
    .populate("author", "firstName lastName")
    .sort({ createdAt: -1 })
    .lean();

    // Add calculated fields
    const discussionsWithStats = discussions.map(disc => ({
      ...disc,
      upvoteCount: disc.upvotes ? disc.upvotes.length : 0,
      downvoteCount: disc.downvotes ? disc.downvotes.length : 0,
      score: (disc.upvotes ? disc.upvotes.length : 0) - (disc.downvotes ? disc.downvotes.length : 0)
    }));

    res.status(200).json({
      success: true,
      discussions: discussionsWithStats
    });
  } catch (err) {
    console.error("Get Pinned Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get discussion statistics
const getDiscussionStats = async (req, res) => {
  try {
    const totalDiscussions = await Discuss.countDocuments({ isPublished: true });
    const totalUsers = await Discuss.distinct("author");
    
    // Get most upvoted discussions
    const discussions = await Discuss.find({ isPublished: true })
      .populate("author", "firstName lastName")
      .limit(10)
      .lean();

    const discussionsWithScore = discussions.map(disc => ({
      ...disc,
      upvoteCount: disc.upvotes ? disc.upvotes.length : 0,
      downvoteCount: disc.downvotes ? disc.downvotes.length : 0,
      score: (disc.upvotes ? disc.upvotes.length : 0) - (disc.downvotes ? disc.downvotes.length : 0)
    }));

    const mostUpvoted = [...discussionsWithScore]
      .sort((a, b) => b.upvoteCount - a.upvoteCount)
      .slice(0, 5);

    const highestScore = [...discussionsWithScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    res.status(200).json({
      success: true,
      stats: {
        totalDiscussions,
        uniqueAuthors: totalUsers.length,
        mostUpvoted,
        highestScore,
        pinnedCount: await Discuss.countDocuments({ isPublished: true, isPinned: true })
      }
    });
  } catch (err) {
    console.error("Get Stats Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  createDiscussion,
  getAllDiscussions,
  getDiscussionById,
  updateDiscussion,
  deleteDiscussion,
  voteDiscussion,
  togglePinDiscussion,
  getUserDiscussions,
  getTrendingDiscussions,
  getPinnedDiscussions,
  getDiscussionStats
};