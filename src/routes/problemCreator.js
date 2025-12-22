const express = require('express');
const problemRouter = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware")
const userMiddleware = require("../middleware/userMiddleware")
const { createProblem,updateProblem } = require("../controllers/userProblem")
// create 
problemRouter.post("/create", adminMiddleware, createProblem)
// update
problemRouter.put("/update/:id", adminMiddleware, updateProblem)
// // delete
// problemRouter.delete("/delete/:id", adminMiddleware, deleteProblem)


// // fetch
// problemRouter.get("/getProblemById/:id",userMiddleware, getProblemById)
// problemRouter.get("/getAllProblem",userMiddleware, getAllProblem)
// // problemSolved
// problemRouter.get("/ProblemSolvedByUser",userMiddleware, solvedProblem)

module.exports = problemRouter;