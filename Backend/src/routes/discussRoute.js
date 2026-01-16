const express = require("express");
const discussController = require("../controllers/discussionController");
const  authenticate = require("../middleware/userMiddleware");

const discussRouter = express.Router();

// -----------------------------
// Public Routes
// -----------------------------

discussRouter.get("/", discussController.getAllDiscussions);
discussRouter.get("/pinned", discussController.getPinnedDiscussions);
discussRouter.get("/trending", discussController.getTrendingDiscussions);
discussRouter.get("/stats", discussController.getDiscussionStats);
discussRouter.get("/:id", discussController.getDiscussionById);

// -----------------------------
// Protected Routes (Authenticated Users)
// -----------------------------

discussRouter.post("/", authenticate, discussController.createDiscussion);
discussRouter.put("/:id", authenticate, discussController.updateDiscussion);
discussRouter.delete("/:id", authenticate, discussController.deleteDiscussion);
discussRouter.post("/:id/vote", authenticate, discussController.voteDiscussion);
discussRouter.get("/user/my", authenticate, discussController.getUserDiscussions);

// -----------------------------
// Admin Routes
// -----------------------------

discussRouter.post("/:id/pin", authenticate, isAdmin, discussController.togglePinDiscussion);

discussRouter.get("/admin/all", authenticate, isAdmin, async (req, res) => {
  try {
    const Discuss = require("../models/discuss");

    const discussions = await Discuss.find()
      .populate("author", "firstName lastName emailId")
      .populate("upvotes", "firstName")
      .populate("downvotes", "firstName")
      .sort({ isPinned: -1, createdAt: -1 });

    const discussionsWithStats = discussions.map((disc) => {
      const discussionObj = disc.toObject();
      discussionObj.upvoteCount = disc.upvotes.length;
      discussionObj.downvoteCount = disc.downvotes.length;
      discussionObj.score = discussionObj.upvoteCount - discussionObj.downvoteCount;
      return discussionObj;
    });

    res.status(200).json({
      success: true,
      discussions: discussionsWithStats,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = discussRouter;
