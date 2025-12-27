const mongoose = require("mongoose");
const { Schema } = mongoose;

const submissionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user", //userSchema
        required: true
    },
    problemId: {
        type: Schema.Types.ObjectId,
        ref: 'problem'
    },
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true,
        enum: ["javascript", "c++", "java","c","python"]
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "wrong", "error"]
    },
    runtime: {
        // timecomplexity
        type: Number, //millisecond
        default: 0
    },
    memory: {
        // spacecomplexity
        type: Number, //KB
        default: 0
    },
    errorMessage: {
        type: String,
        default: " "
    },
    testCasesPassed: {
        type: Number,
        default: 0
    },
    testCasesTotal: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

const Submission = mongoose.model("submission", submissionSchema);
module.exports = Submission;