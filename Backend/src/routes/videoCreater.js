const express = require('express');
const adminMiddleware = require("../middleware/adminMiddleware");
const videoRouter =  express.Router();
const {generateUploadSignature,saveVideoMetadata,deleteVideo,getVideoStatus} = require("../controllers/videoSection")

videoRouter.get("/status",adminMiddleware, getVideoStatus);
videoRouter.get("/create/:problemId",adminMiddleware,generateUploadSignature);
videoRouter.post("/save",adminMiddleware,saveVideoMetadata);
videoRouter.delete("/delete/:problemId",adminMiddleware,deleteVideo);


module.exports = videoRouter;