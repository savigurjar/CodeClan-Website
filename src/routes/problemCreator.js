const express = require('express');
const problemRouter = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware")
const {createProblem} = require("../controllers/userProblem")
// create 
problemRouter.post("/create", adminMiddleware, createProblem)
// update
// problemRouter.patch("/:id", adminMiddleware, updateProblem)
// // delete
// problemRouter.delete("/:id", adminMiddleware, deleteProblem)


// // fetch
// problemRouter.get("/:id", getProblemById)
// problemRouter.get("/", getAllProblem)
// // problemSolved
// problemRouter.get("/user", solvedProblem)

module.exports = problemRouter;