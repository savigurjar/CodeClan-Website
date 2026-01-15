const mongoose = require("mongoose");
const { Schema } = mongoose;

const contestSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100
    },
    description: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    duration: {
        type: Number, // in minutes
        required: true
    },
    rules: {
        type: [String],
        default: []
    },
    prizes: {
        type: [{
            position: Number,
            prize: String
        }],
        default: []
    },
    tags: {
        type: [String],
        default: []
    },
    problems: [{
        type: Schema.Types.ObjectId,
        ref: "problem"
    }],
    participants: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        joinedAt: {
            type: Date,
            default: Date.now
        },
        score: {
            type: Number,
            default: 0
        },
        problemsSolved: [{
            problemId: {
                type: Schema.Types.ObjectId,
                ref: "problem"
            },
            solvedAt: Date,
            submissionId: {
                type: Schema.Types.ObjectId,
                ref: "submission"
            },
            points: Number
        }],
        rank: Number,
        timeTaken: Number // in minutes
    }],
    maxParticipants: {
        type: Number,
        default: 1000
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    registrationOpen: {
        type: Boolean,
        default: true
    },
    contestCreator: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    leaderboard: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: "user"
        },
        score: Number,
        problemsSolved: Number,
        timeTaken: Number,
        rank: Number
    }],
    status: {
        type: String,
        enum: ["upcoming", "live", "ended"],
        default: "upcoming"
    }
}, {
    timestamps: true
});

const Contest = mongoose.model("contest", contestSchema);
module.exports = Contest;