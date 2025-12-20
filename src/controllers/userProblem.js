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
                expected_output: testcase.output.trim()
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

module.exports = { createProblem };
