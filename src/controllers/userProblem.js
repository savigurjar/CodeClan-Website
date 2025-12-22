const Problem = require('../models/problem');
const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility");

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

const updateProblem = async (req, res) => {

    const { id } = req.params;
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

        if (!id) {
            return res.status(400).send("Missing ID ")
        }

        const dsaProblem = await Problem.findById(id);
        if (!dsaProblem) {
            return res.status(404).send("Missing Problem")
        }

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

        const newProblem = await Problem.findByIdAndUpdate(
            id,
            { ...req.body },
            { runValidators: true, new: true }
        );

        if (!newProblem) {
            return res.status(404).json({ message: "Problem not found" });
        }

        // Return the updated problem with a success message
        res.status(200).json({
            message: "Problem updated successfully",
            problem: newProblem
        });


    } catch (err) {
        console.error("CREATE PROBLEM ERROR:", err);
        res.status(500).json({ error: err.message });
    }
}

module.exports = { createProblem, updateProblem };
