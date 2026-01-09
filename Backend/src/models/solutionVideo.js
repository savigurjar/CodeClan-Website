const mongoose = require("mongoose");
const {Schema }= mongoose;

const videoSchema = new Schema({
  problemId: { type: Schema.Types.ObjectId, ref: 'problem', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  cloudinaryPublicId: { type: String, required: true, unique: true },
  secureUrl: { type: String, required: true },
  thumbnailUrl: { type: String },
  duration: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String },
  tags: [{ type: String }],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  isProcessed: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  format: { type: String },
  resolution: { type: String },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
}, {
  timestamps: true
});

videoSchema.index({ problemId: 1 });
videoSchema.index({ userId: 1 });

const SolutionVideo = mongoose.model("solutionVideo", videoSchema);
module.exports = SolutionVideo;
