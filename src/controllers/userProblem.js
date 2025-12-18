const Problem = require('../models/problem')
const { getLanguageById } = require("../utils/problemUtility")
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


        }

    } catch (err) {
     res.status(500).json({error:'server error'})
    }
}