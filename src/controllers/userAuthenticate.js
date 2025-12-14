const validUser = require("../utils/validator")
const User = require("../models/users")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const redisClient = require("../config/redis")
// const Submission = require("../models/Submission")

const register = async (req, res) => {
    try {
        await validUser(req.body);

        req.body.password = await bcrypt.hash(req.body.password, 10);
        req.body.role = "user";

        const people = await User.create(req.body);
        const reply = {
            firstName: people.firstName,
            emailId: people.emailId,
            _id: people._id

        }

        const token = jwt.sign(
            { _id: people._id, role: people.role, emailId: people.emailId },
            process.env.JWT_KEY,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            user: reply,
            message: "User created successfully"
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


const login = async (req, res) => {

    try {
        const { emailId, password } = req.body;

        const people = await User.findOne({ emailId });
        if (!people) throw new Error("Invalid Credentials");

        const Isallowed = await bcrypt.compare(password, people.password);
        if (!Isallowed) throw new Error("Invalid Credentials")

        const reply = {
            firstName: people.firstName,
            emailId: people.emailId,
            _id: people._id

        }

        const token = jwt.sign({ _id: people._id, role: people.role, emailId: people.emailId }, process.env.JWT_KEY, { expiresIn: "1d" })

        res.cookie("token", token, {
            httpOnly: true, // prevents JS access
            secure: process.env.NODE_ENV === "production", // https only in prod
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.status(200).json({
            user: reply,
            message: "User Login Successfully"
        })
    } catch (err) {
        res.status(401).send("Error " + err)
    }

}

const getProfile = async (req, res) => {
    try {
        res.status(200).send(req.result)
    }
    catch (err) {
        res.status(400).send("Error " + err)
    }
}

const logout = async (req, res) => {
    try {
        // validate the token
        // token add kr denge Redis ke blocklist me
        const { token } = req.cookies;
        if (!token) throw new Error("Token is missing");

        // verify and decode token
        const payload = jwt.verify(token, process.env.JWT_KEY);

        // add token to Redis blocklist
        await redisClient.set(`token:${token}`, "Blocked");
        await redisClient.expireAt(`token:${token}`, payload.exp);

        // clear cookie
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        });

        res.status(200).send("Logout Successfully")

    } catch (err) {
        res.status(401).send("Error " + err.message);

    }
}

const adminRegister = async (req, res) => {
    try {

        // or 
        // if(req.result.role != admin) throw new Error("Invalid Credentials")

        await validUser(req.body);
        req.body.password = await bcrypt.hash(req.body.password, 10)
        
        const people = await User.create(req.body);

        const token = jwt.sign({ _id: people._id, role: people.role, emailId: people.emailId }, process.env.JWT_KEY, { expiresIn: "1d" })

        res.cookie("token", token, {
            httpOnly: true, // prevents JS access
            secure: process.env.NODE_ENV === "production", // https only in prod
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        res.status(201).send("Admin created successfully")
    } catch (err) {
        res.status(401).send("Error " + err)
    }
}

const deleteProfile = async (req, res) => {
    try {
        const userId = req.result._id;
        // user Schema se delete 
        await User.findByIdAndDelete(userId);
        // submission schema se bhi delete
        // await Submission.deleteMany({ userId })

        res.status(200).send("Profile Deleted Successfully")
    }
    catch (err) {
        res.status(400).send("Error " + err)
    }
}


module.exports = { register, login, getProfile, logout, adminRegister, deleteProfile }