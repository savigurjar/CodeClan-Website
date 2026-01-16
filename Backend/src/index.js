// server.js
const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

// DB & Redis
const main = require("./config/db");
const redisClient = require("./config/redis");

// Routers
const authRouter = require("./routes/userAuth");
const problemRouter = require("./routes/problemCreator");
const submitRouter = require("./routes/submit");
const aiRouter = require("./routes/aiChatting")
const videoRouter = require("./routes/videoCreater");
const contestRouter = require("./routes/contestRoute");
const discussRouter = require("./routes/discussRoute");
      

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // frontend URL
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use("/submission", submitRouter);
app.use("/ai",aiRouter);
app.use("/video",videoRouter);
app.use("/contest", contestRouter);
app.use("/discuss", discussRouter);



// Serve React frontend (for production build)
app.use(express.static(path.join(__dirname, "client/build")));

// Catch-all route for React Router
// app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client/build", "index.html"));
// });

// Initialize DB + Redis + Server
const initializeConnection = async () => {
    try {
        await Promise.all([main(), redisClient.connect()]);
        console.log("Connected to DB and Redis");

        app.listen(process.env.PORT, () => {
            console.log(`Server listening on port ${process.env.PORT}`);
        });
    } catch (err) {
        console.log("Error Occurred:", err);
    }
};

initializeConnection();
