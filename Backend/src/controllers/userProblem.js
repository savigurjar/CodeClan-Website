const Problem = require('../models/problem');
const User = require("../models/users")
const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility");
const Submission = require("../models/submission")
const SolutionVideo = require("../models/solutionVideo");
const mongoose = require("mongoose")

const createProblem = async (req, res) => {
    const {
        title,
        description,
        difficulty,
        tags,
        visibleTestCases,
        hiddenTestCases,
        startCode,
        referenceSolution,
        constraints,
        examples,
        complexity,
        companies,
        isPremium,
        points,
        problemCreator
    } = req.body;

    try {
        // Validate required arrays
        if (!Array.isArray(referenceSolution) || referenceSolution.length === 0) {
            return res.status(400).json({ error: "referenceSolution must be a non-empty array" });
        }

        if (!Array.isArray(visibleTestCases) || visibleTestCases.length === 0) {
            return res.status(400).json({ error: "visibleTestCases must be a non-empty array" });
        }

        if (!Array.isArray(tags) || tags.length === 0) {
            return res.status(400).json({ error: "tags must be a non-empty array" });
        }

        // Run reference solution tests
        for (const { language, completeCode } of referenceSolution) {
            const languageId = getLanguageById(language);

            const submissions = visibleTestCases.map((testcase) => ({
                source_code: completeCode,
                language_id: languageId,
                stdin: testcase.input,
                expected_output: testcase.output
            }));

            const submitResult = await submitBatch(submissions);
            if (!submitResult || !Array.isArray(submitResult)) {
                throw new Error("Judge0 API quota exceeded or invalid response");
            }
            const resultToken = submitResult.map((value) => value.token);
            const testResult = await submitToken(resultToken);

            console.log(testResult)

            for (const test of testResult) {
                if (test.status_id === 3) {
                    console.log("Test Passed");
                } else if (test.status_id === 1 || test.status_id === 2) {
                    console.log("Please wait, still processing...");
                } else if (test.status_id === 4) {
                    return res.status(400).send("Wrong Answer in reference solution");
                } else if (test.status_id === 5) {
                    return res.status(400).send("Time Limit Exceeded");
                } else if (test.status_id === 6) {
                    return res.status(400).send("Compilation Error");
                } else {
                    return res.status(400).send("Runtime/Internal Error");
                }
            }
        }

        // Save problem
        const userProblem = await Problem.create({
            ...req.body,

            problemCreator: req.result._id
        });

        res.status(201).send("Problem Saved Successfully");

    } catch (err) {
        console.error("CREATE PROBLEM ERROR:", err);
        res.status(500).json({ error: err.message });
    }
};

// const updateProblem = async (req, res) => {

//     const { id } = req.params;
//     const {
//         title,
//         description,
//         difficulty,
//         tags,
//         visibleTestCases,
//         hiddenTestCases,
//         startCode,
//         referenceSolution,
//         constraints,
//         examples,
//         complexity,
//         companies,
//         isPremium,
//         points,
//         problemCreator
//     } = req.body;

//     try {

//         if (!id) {
//             return res.status(400).send("Missing ID ")
//         }

//         const dsaProblem = await Problem.findById(id);
//         if (!dsaProblem) {
//             return res.status(404).send("Missing Problem")
//         }

//         // Validate required arrays
//         if (!Array.isArray(referenceSolution) || referenceSolution.length === 0) {
//             return res.status(400).json({ error: "referenceSolution must be a non-empty array" });
//         }

//         if (!Array.isArray(visibleTestCases) || visibleTestCases.length === 0) {
//             return res.status(400).json({ error: "visibleTestCases must be a non-empty array" });
//         }

//         if (!Array.isArray(tags) || tags.length === 0) {
//             return res.status(400).json({ error: "tags must be a non-empty array" });
//         }

//         // Run reference solution tests
//         for (const { language, completeCode } of referenceSolution) {
//             const languageId = getLanguageById(language);

//             const submissions = visibleTestCases.map((testcase) => ({
//                 source_code: completeCode,
//                 language_id: languageId,
//                 stdin: testcase.input,
//                 expected_output: testcase.output
//             }));

//             const submitResult = await submitBatch(submissions);
//             if (!submitResult || !Array.isArray(submitResult)) {
//                 throw new Error("Judge0 API quota exceeded or invalid response");
//             }
//             const resultToken = submitResult.map((value) => value.token);
//             const testResult = await submitToken(resultToken);

//             for (const test of testResult) {
//                 if (test.status_id === 3) {
//                     console.log("Test Passed");
//                 } else if (test.status_id === 1 || test.status_id === 2) {
//                     console.log("Please wait, still processing...");
//                 } else if (test.status_id === 4) {
//                     return res.status(400).send("Wrong Answer in reference solution");
//                 } else if (test.status_id === 5) {
//                     return res.status(400).send("Time Limit Exceeded");
//                 } else if (test.status_id === 6) {
//                     return res.status(400).send("Compilation Error");
//                 } else {
//                     return res.status(400).send("Runtime/Internal Error");
//                 }
//             }
//         }

//         const newProblem = await Problem.findByIdAndUpdate(
//             id,
//             { ...req.body },
//             { runValidators: true, new: true }
//         );

//         if (!newProblem) {
//             return res.status(404).json({ message: "Problem not found" });
//         }

//         // Return the updated problem with a success message
//         res.status(200).json({
//             message: "Problem updated successfully",
//             problem: newProblem
//         });


//     } catch (err) {

//         res.status(500).json({ error: err.message });
//     }
// }



const updateProblem = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid problem ID" });
    }

    const existingProblem = await Problem.findById(id);
    if (!existingProblem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    const {
      referenceSolution,
      visibleTestCases,
      tags
    } = req.body;

    // ---- Basic validation ----
    if (!Array.isArray(referenceSolution) || referenceSolution.length === 0) {
      return res.status(400).json({ error: "referenceSolution must be a non-empty array" });
    }

    if (!Array.isArray(visibleTestCases) || visibleTestCases.length === 0) {
      return res.status(400).json({ error: "visibleTestCases must be a non-empty array" });
    }

    if (!Array.isArray(tags) || tags.length === 0) {
      return res.status(400).json({ error: "tags must be a non-empty array" });
    }

    // ---- Run Judge0 only if referenceSolution changed ----
    const referenceChanged =
      JSON.stringify(referenceSolution) !==
      JSON.stringify(existingProblem.referenceSolution);

    if (referenceChanged) {
      for (const { language, completeCode } of referenceSolution) {
        const languageId = getLanguageById(language);

        const submissions = visibleTestCases.map(tc => ({
          source_code: completeCode,
          language_id: languageId,
          stdin: tc.input,
          expected_output: tc.output
        }));

        const submitResult = await submitBatch(submissions);
        if (!Array.isArray(submitResult)) {
          return res.status(503).json({ error: "Judge0 API unavailable" });
        }

        const tokens = submitResult.map(s => s.token);
        const results = await submitToken(tokens);

        for (const test of results) {
          switch (test.status_id) {
            case 3:
              break; // Accepted
            case 4:
              return res.status(400).json({ error: "Wrong Answer in reference solution" });
            case 5:
              return res.status(400).json({ error: "Time Limit Exceeded" });
            case 6:
              return res.status(400).json({ error: "Compilation Error" });
            default:
              return res.status(400).json({ error: "Runtime / Internal Error" });
          }
        }
      }
    }

    const updatedProblem = await Problem.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Problem updated successfully",
      problem: updatedProblem
    });

  } catch (err) {
    console.error("Update Problem Error:", err);
    res.status(500).json({ error: err.message });
  }
};




const deleteProblem = async (req, res) => {
    const { id } = req.params;

    try {
        if (!id) return res.status(400).send("ID is missing");

        // problem present h ya nhi
        const DsaProblem = await Problem.findById(id);
        if (!DsaProblem) return res.status(400).send("ID is not present in server")

        const deleteProblem = await Problem.findByIdAndDelete(id)

        if (!deleteProblem) return res.status(404).send("Problem is missing");



        res.status(200).send("Problem deleted Successfully")

    } catch (err) {

        res.status(500).json({ error: err.message });
    }
}

// const getProblemById = async (req, res) => {
//     const { id } = req.params;

//     try {
//         if (!id) return res.status(400).send("Id is missing");

//         const dsaProblem = await Problem.findById(id).select(
//             '_id title description difficulty constraints tags visibleTestCases complexity likes dislikes startCode companies referenceSolution isPremium points'
//         );

//         if (!dsaProblem) return res.status(404).send("Problem not found");

//         const video = await SolutionVideo.findOne({ problemId: id });
//         // const video = await SolutionVideo.findOne({
//         //     problemId: new mongoose.Types.ObjectId(id),
//         //     isDeleted: false,
//         //     // status: "approved" // optional but recommended
//         // });

//         // res.status(200).json({
//         //     problem: {
//         //         ...dsaProblem.toObject(),


//         //         secureUrl: video.secureUrl,
//         //         thumbnailUrl: video.thumbnailUrl,
//         //         duration: video.duration,


//         //     }
//         // });

//         res.status(200).json({
//             problem: {
//                 ...dsaProblem.toObject(),
//                 secureUrl: video?.secureUrl || null,
//                 thumbnailUrl: video?.thumbnailUrl || null,
//                 duration: video?.duration || null,
//             }
//         });

//     } catch (err) {
//         // res.status(500).json({ error: err.message });

//         console.error("🔥 getProblemById failed");
//         console.error(err.name);
//         console.error(err.message);
//         console.error(err.stack);
//         res.status(500).json({ error: err.message });


//     }
// };

// const mongoose = require("mongoose");

const getProblemById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) return res.status(400).send("Id is missing");
    if (!mongoose.Types.ObjectId.isValid(id)) 
      return res.status(400).send("Invalid problem ID");

    const dsaProblem = await Problem.findById(id).select(
      '_id title description difficulty constraints tags visibleTestCases complexity likes dislikes startCode companies referenceSolution isPremium points'
    );

    if (!dsaProblem) return res.status(404).send("Problem not found");

    const video = await SolutionVideo.findOne({ problemId: id });

    res.status(200).json({
      problem: {
        ...dsaProblem.toObject(),
        secureUrl: video?.secureUrl || null,
        thumbnailUrl: video?.thumbnailUrl || null,
        duration: video?.duration || null,
      }
    });

  } catch (err) {
    console.error("🔥 getProblemById failed");
    console.error(err.name);
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};


const getAllProblem = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const {
            difficulty,
            tags,
            isPremium,
            companies,
            minPoints,
            maxPoints
        } = req.query;

        // 🔹 Build dynamic filter
        let filter = {};

        if (difficulty) {
            filter.difficulty = difficulty;
        }

        if (tags) {
            // tags=array,sorting
            filter.tags = { $in: tags.split(",") };
        }

        if (isPremium !== undefined) {
            filter.isPremium = isPremium === "true";
        }

        if (companies) {
            filter.companies = { $in: companies.split(",") };
        }

        if (minPoints || maxPoints) {
            filter.points = {};
            if (minPoints) filter.points.$gte = Number(minPoints);
            if (maxPoints) filter.points.$lte = Number(maxPoints);
        }

        const totalProblems = await Problem.countDocuments(filter);

        if (totalProblems === 0) {
            return res.status(404).send("No problems found");
        }

        const problems = await Problem.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalPages = Math.ceil(totalProblems / limit);

        res.status(200).json({
            totalProblems,
            currentPage: page,
            totalPages,
            nextPage: page < totalPages ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null,
            problems
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const solvedProblemByUser = async (req, res) => {
    try {

        // const count = req.result.problemSolved.length;
        // res.status(200).send(count);

        // kistype ki problem h sirf id h abhi to ,or hr ek problem le liye bar bar db call krna pdhega , esliye populate use krege kyu ki jo jis problem ko ref kr rha tha us problem ko fetch krke le aayega ref: se

        const userId = req.result._id;
        const user = await User.findById(userId).populate({ path: "problemSolved", select: "_id title difficulty tags" });

        res.status(200).send(user.problemSolved)



    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const submittedProblem = async (req, res) => {
    try {
        const userId = req.result._id;
        const problemId = req.params.id;

        const submissions = await Submission.find({ userId, problemId });

        // Always return an array, even if empty
        res.status(200).json(submissions);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


module.exports = { createProblem, updateProblem, deleteProblem, getProblemById, getAllProblem, solvedProblemByUser, submittedProblem };
