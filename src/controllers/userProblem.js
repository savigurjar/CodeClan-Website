const Problem = require('../models/problem')
const { getLanguageById ,submitBatch} = require("../utils/problemUtility")
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

        for (const { language, completeCode } of referenceSolution) {

            //  source_code:
            // language_id:
            // stdin:
            // expectedOutput

            const languageId = getLanguageById(language)

            //   create batch all testcases 
            const submissions = visibleTestCases.map((input, output) => ({
                source_code: completeCode,
                language_id: languageId,
                stdin: input,
                expected_output: output
            }))
            // submission array create hojayega 

            const submitResult = await submitBatch(submissions)

        }

    } catch (err) {
        res.status(500).json({ error: 'server error' })
    }
}