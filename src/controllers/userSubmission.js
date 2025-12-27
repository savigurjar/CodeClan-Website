const Problem = require("../models/problem")
const Submission = require("../models/submission")
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
 const submittedResult = await S






    } catch (err) {

    }
}