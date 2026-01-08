const Problem = require("../models/problem");
const Submission = require("../models/submission")
const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility")


const submitCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    const { code, language } = req.body;

    if (!userId || !code || !problemId || !language) {
      return res.status(400).send("Some fields are missing");
    }

    const problem = await Problem.findById(problemId);

    const submittedResult = await Submission.create({
      userId,
      problemId,
      code,
      language,
      tesetCasesTotal: problem.hiddenTestCases.length,
      status: "pending"
    });

    const languageId = getLanguageById(language);
    const submissions = problem.hiddenTestCases.map((tc) => ({
      source_code: code,
      language_id: languageId,
      stdin: tc.input,
      expected_output: tc.output
    }));

    const submitResult = await submitBatch(submissions);
    const tokens = submitResult.map((t) => t.token);
    const judgeResults = await submitToken(tokens);

    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = "accepted";

    const testResult = judgeResults.map((test, i) => {
      let tcStatus = test.status_id;
      if (tcStatus === 3) testCasesPassed++;
      runtime += parseFloat(test.time || 0);
      memory = Math.max(memory, test.memory || 0);

      if (![3].includes(tcStatus)) status = "failed";

      return {
        stdin: problem.hiddenTestCases[i].input,
        expected_output: problem.hiddenTestCases[i].output,
        stdout: test.stdout || "",
        status_id: test.status_id,
        runtime: parseFloat(test.time || 0),
        memory: test.memory || 0,
        error: test.stderr || test.compile_output || null,
        explanation: problem.hiddenTestCases[i].explanation || "",
      };
    });

    submittedResult.status = status;
    submittedResult.testCasesPassed = testCasesPassed;
    submittedResult.runtime = runtime;
    submittedResult.memory = memory;
    await submittedResult.save();

    if (!req.result.problemSolved.includes(problemId)) {
      req.result.problemSolved.push(problemId);
      await req.result.save();
    }

    res.status(201).json({
      accepted: status === "accepted",
      totalTestCases: submittedResult.tesetCasesTotal,
      passedTestCases: testCasesPassed,
      runtime,
      memory,
      testCases: testResult
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Execution failed" });
  }
};


const runCode = async (req, res) => {
  try {
    const { code, language } = req.body;
    const problem = await Problem.findById(req.params.id);

    const languageId = getLanguageById(language);
    const submissions = problem.hiddenTestCases.map(tc => ({
      source_code: code,
      language_id: languageId,
      stdin: tc.input,
      expected_output: tc.output
    }));

    const submitResult = await submitBatch(submissions);
    const tokens = submitResult.map(t => t.token);
    const judgeResults = await submitToken(tokens);

    const testCases = judgeResults.map((test, i) => ({
      stdin: problem.hiddenTestCases[i].input,
      expected_output: problem.hiddenTestCases[i].output,
      stdout: test.stdout || "",
      status_id: test.status_id,
      runtime: parseFloat(test.time || 0),
      memory: test.memory || 0,
      error: test.stderr || test.compile_output || null,
      explanation: problem.hiddenTestCases[i].explanation || ""
    }));

    res.status(201).json({
      success: testCases.every(t => t.status_id === 3),
      runtime: testCases.reduce((a,b) => a + b.runtime, 0),
      memory: Math.max(...testCases.map(t => t.memory)),
      testCases
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Execution failed" });
  }
};



module.exports = { submitCode, runCode }