const express = require("express");
const app = express();
require("dotenv").config();
const main = require("./config/db")
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/userAuth")
const redisClient = require("./config/redis")
const problemRouter = require("./routes/problemCreator")

app.use(express.json());
app.use(cookieParser())

app.use("/user", authRouter)
app.use("/problem", problemRouter)


const IntializeConnection = async () => {
    try {
        await Promise.all([main(), redisClient.connect()]);

        console.log("Connected to DB and Redis");

        app.listen(process.env.PORT, () => {
            console.log(`server listening at port ${process.env.PORT}`)
        })
    } catch (err) {
        console.log("Error Occured : " + err)
    }
}
IntializeConnection();


// main()
//     .then(async () => {
//         app.listen(process.env.PORT, () => {
//             console.log(`server listening at port ${process.env.PORT}`)
//         })
//     })
//     .catch(err => console.log("Error Occurred" + err))