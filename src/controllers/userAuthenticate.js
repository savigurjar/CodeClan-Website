const validUser = require("../utils/validator")
const User = require("../models/users")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const redisClient = require("../config/redis")
const crypto = require("crypto");
// const Submission = require("../models/Submission")
const nodemailer = require("nodemailer");

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

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const people = await User.findById(req.result._id);
        if (!people) throw new Error("user not found");

        const isAllowed = await bcrypt.compare(oldPassword, people.password);
        if (!isAllowed) throw new Error("Old password is incorrect");

        people.password = await bcrypt.hash(newPassword, 10);
        await people.save();

        res.status(200).send("Password changed successfully");
    } catch (err) {
        res.status(400).send("Error " + err)
    }
}

const forgetPassword = async (req, res) => {
    try {
        const { emailId } = req.body;

        const people = await User.findOne({ emailId });
        if (!people) {
            return res.status(200).send("If email exists, reset link sent");
        }

        const resetToken = crypto.randomBytes(32).toString("hex");

        people.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        people.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);


        await people.save();

        // send email here
        console.log(`Reset URL: http://localhost:3000/reset-password/${resetToken}`);
        console.log("RAW TOKEN:", resetToken);
        console.log("HASHED TOKEN:", people.resetPasswordToken);
        console.log("EXPIRES AT:", people.resetPasswordExpire);


        res.status(200).send("Reset password link sent to email");
    } catch (err) {
        res.status(400).send("Error " + err.message);
    }

}

const resetPassword = async (req, res) => {
    try {
        console.log("INCOMING TOKEN:", req.params.token);

        // hash incoming token
        const resetToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        console.log("HASHED INCOMING TOKEN:", resetToken);

        // find user with matching token and unexpired
        const people = await User.findOne({
            resetPasswordToken: resetToken,
            resetPasswordExpire: { $gt: new Date() } // ensure Date type
        });

        if (!people) throw new Error("Invalid or expired token");

        // hash new password
        people.password = await bcrypt.hash(req.body.password, 10);

        // clear reset token fields
        people.resetPasswordToken = undefined;
        people.resetPasswordExpire = undefined;

        await people.save();

        res.status(200).send("Password reset successfully");
    } catch (err) {
        res.status(400).send("Error " + err.message);
    }
};

const getAllUsers = async (req, res) => {
    try {
        // Pagination query params (default: page 1, limit 10)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Find users excluding password and reset token fields
        const users = await User.find({}, '-password -resetPasswordToken -resetPasswordExpire')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); // latest users first

        const totalUsers = await User.countDocuments();

        res.status(200).json({
            success: true,
            page,
            limit,
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            users
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};





module.exports = { register, login, getProfile, logout, adminRegister, deleteProfile, changePassword, forgetPassword, resetPassword ,getAllUsers}