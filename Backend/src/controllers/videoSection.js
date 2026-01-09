const cloudinary = require('cloudinary').v2;
const Problem = require("../models/problem");
const SolutionVideo = require("../models/solutionVideo");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const generateUploadSignature = async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.result._id;

    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ error: 'Problem not found' });

    const timestamp = Math.floor(Date.now() / 1000);
    const publicId = `leetcode-solutions/${problemId}/${userId}_${timestamp}`;

    const signature = cloudinary.utils.api_sign_request(
      { timestamp, public_id: publicId },
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      signature,
      timestamp,
      public_id: publicId,
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      upload_url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate upload credentials' });
  }
};

const saveVideoMetadata = async (req, res) => {
  try {
    const { problemId, cloudinaryPublicId, secureUrl, duration } = req.body;
    const userId = req.result._id;

    // Fetch problem to get its title
    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ error: "Problem not found" });

    // Check if video already exists for this user/problem
    const existingVideo = await SolutionVideo.findOne({ problemId, userId });
    if (existingVideo) {
      return res.status(409).json({ error: "Video already exists for this user/problem" });
    }

    // Fetch Cloudinary video info
    const cloudinaryResource = await cloudinary.api.resource(cloudinaryPublicId, { resource_type: "video" });
    if (!cloudinaryResource) return res.status(400).json({ error: "Video not found on Cloudinary" });

    // Generate thumbnail URL
    const thumbnailUrl = cloudinary.url(cloudinaryResource.public_id, {
      resource_type: "video",
      format: "jpg",
      transformation: [
        { width: 400, height: 225, crop: "fill" },
        { start_offset: "auto" }
      ]
    });

    const videoSolution = await SolutionVideo.create({
      problemId,
      userId,
      cloudinaryPublicId,
      secureUrl,
      duration: cloudinaryResource.duration || duration,
      thumbnailUrl,
      title: problem.title, // ✅ Use problem title
      status: 'pending',
      views: 0,
      likes: 0,
      commentsCount: 0
    });

    res.status(201).json({
      message: "Video solution saved successfully",
      videoSolution
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save video metadata" });
  }
};


const deleteVideo = async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.result._id;

    const video = await SolutionVideo.findOne({ problemId, userId });
    if (!video) return res.status(404).json({ error: "No video found" });

    await cloudinary.uploader.destroy(video.cloudinaryPublicId, { resource_type: "video", invalidate: true });
    await video.deleteOne();

    res.json({ message: "Video deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete video" });
  }
};

const getVideoStatus = async (req, res) => {
  try {
    const videos = await SolutionVideo.find({}, "problemId status duration thumbnailUrl");

    const videoMap = {};
    videos.forEach(v => {
      videoMap[v.problemId.toString()] = {
        status: v.status,
        duration: v.duration,
        thumbnailUrl: v.thumbnailUrl
      };
    });

    res.json(videoMap);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch video status" });
  }
};

module.exports = { generateUploadSignature, saveVideoMetadata, deleteVideo, getVideoStatus };
