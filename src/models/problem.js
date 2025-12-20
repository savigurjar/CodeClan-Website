const mongoose = require("mongoose");
const { Schema } = mongoose;

const problemSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard", "superHard"],
            required: true
        },
        tags: [
            {
                type: String,
                enum: [
                    "array",
                    "string",
                    "linkedList",
                    "stack",
                    "queue",
                    "hashing",
                    "twoPointers",
                    "slidingWindow",
                    "binarySearch",
                    "recursion",
                    "backtracking",
                    "greedy",
                    "dynamicProgramming",
                    "tree",
                    "binaryTree",
                    "bst",
                    "graph",
                    "heap",
                    "trie",
                    "bitManipulation",
                    "math",
                    "sorting"
                ],
                required: true
            }
        ]
        ,
        visibleTestCases: [{
            input: {
                type: String,
                required: true
            },
            output: {
                type: String,
                required: true
            },
            explanation: {
                type: String,
                required: true
            }
        }],
        hiddenTestCases: [{
            input: {
                type: String,
                required: true
            },
            output: {
                type: String,
                required: true
            },

        }],
        startCode: [{
            language: {
                type: String,
                required: true
            },
            initialCode: {
                type: String,
                required: true
            }
        }],
        referenceSolution: [
            {
                language: {
                    type: String,
                    required: true
                },
                completeCode: {
                    type: String,
                    required: true
                }
            }
        ],

        constraints: {
            type: [String],
            required: true
        },
        examples: [
            {
                input: String,
                output: String,
                explanation: String
            }
        ],
        complexity: {
            time: {
                type: String,
                required: true
            },
            space: {
                type: String,
                required: true
            }
        },
        likes: {
            type: Number,
            default: 0,
            min: 0
        },
        dislikes: {
            type: Number,
            default: 0,
            min: 0
        }
        ,
        companies: {
            type: [String],
            default: []
        },
        isPremium: {
            type: Boolean,
            default: false
        },
        points: {
            type: Number,
            default: 100
        },
        problemCreator: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true
        },

    },
    {
        timestamps: true
    }
);

const Problem = mongoose.model("problem", problemSchema);
module.exports = Problem;
