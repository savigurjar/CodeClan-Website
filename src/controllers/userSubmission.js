const Problem = require("../models/problem");
const Submission = require("../models/submission")
const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility")


const submitCode = async (req, res) => {
    try {
        const userId = req.result._id;
        const problemId = req.params.id;

        const { code, language } = req.body;

        if (!userId || !code || !problemId || !language) {
            return res.status(400).send("Sum field are missing");
        }

        // fetch probelm from db
        const problem = await Problem.findById(problemId);

        // testcases mil jayege hidden


        // 2. code userne bhej diya , store kra lenge db me and status code pending kr dege uske code pura code judge0 ko bhej denge fir jb jo bhi ans aayega db  me update kr denge
        const submittedResult = await Submission.create({
            userId,
            problemId,
            code,
            language,
            tesetCasesTotal: problem.hiddenTestCases.length,
            status: 'pending'
        })

        // judge0 ko code submit

        const languageId = getLanguageById(language)
        const submissions = problem.hiddenTestCases.map((testcase) => ({
            source_code: code,
            langauge_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }))


        const submitResult = await submitBatch(submissions)

        const resultToken = submitResult.map((value) => value.token)

        const testResult = await submitToken(resultToken)

        // submission update -> submmittedResult

        let testCasesPassed = 0;
        let runtime = 0;
        let memory = 0;
        let status = "accepted";
        let errorMessage = null;


        for (const test of testResult) {
            if (!test || !test.status_id) {
                status = "Judge0 Error";
                continue;
            }
            if (test.status_id === 3) {  // Accepted
                testCasesPassed++;
                runtime += parseFloat(test.time || 0);
                memory = Math.max(memory, test.memory || 0);

            } else if (test.status_id === 4) {
                status = "Wrong Answer";
                errorMessage = test.stderr;
            } else if (test.status_id === 5) {
                status = "Time Limit Exceeded";
                errorMessage = test.stderr;
            } else if (test.status_id === 6) {
                status = "Compilation Error";
                errorMessage = test.stderr;
            } else if (test.status_id === 7) {
                status = "Runtime Error";
                errorMessage = test.stderr;
            }
        }


        // store the result in database 


        submittedResult.status = status;
        submittedResult.testCasesPassed = testCasesPassed;
        submittedResult.errorMessage = errorMessage;
        submittedResult.runtime = runtime;
        submittedResult.memory = memory;


        // and upadtebyId se bhi kr skte h
        await submittedResult.save()

        if (!req.result.problemSolved.includes(problemId)) {
            req.result.problemSolved.push(problemId);
            await req.result.save();
        }

        const accepted = (status == 'accepted')
        res.status(201).json({
            accepted,
            totalTestCases: submittedResult.testCasesTotal,
            passedTestCases: testCasesPassed,
            runtime,
            memory
        });



    } catch (err) {
        res.status(500).send("Internal server error");
    }
}