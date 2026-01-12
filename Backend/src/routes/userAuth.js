const express = require('express');
const authRouter = express.Router();
const { register, login, logout ,getProfile,updateProfile,adminRegister,deleteProfile,changePassword,forgotPassword,resetPassword,getAllUsers} = require("../controllers/userAuthenticate")
const userMiddleware = require("../middleware/userMiddleware")
const adminMiddleware = require("../middleware/adminMiddleware")

// register
authRouter.post('/register', register)
authRouter.post('/login', login);
authRouter.post('/logout', userMiddleware, logout);
authRouter.get('/getProfile',userMiddleware,getProfile);
authRouter.post('/admin/register',adminMiddleware,adminRegister)
authRouter.delete('/deleteProfile',userMiddleware,deleteProfile)
// login
// logout
// getprofile
// change password
authRouter.post('/changePassword',userMiddleware,changePassword);
// forgot password
authRouter.post('/forgot-password',forgotPassword);
// reset password
// authRouter.js
authRouter.post('/reset-password/:token', resetPassword);  // kebab-case
authRouter.get('/admin/users', adminMiddleware, getAllUsers);
// delete profile
authRouter.delete('/deleteProfile',userMiddleware,deleteProfile)
authRouter.put("/updateProfile", userMiddleware, updateProfile);


authRouter.get("/check", userMiddleware, (req, res) => {
    try {
        const reply = {
            firstName: req.result.firstName,
            emailId: req.result.emailId,
             role: req.result.role,
            _id: req.result._id
        }
        res.status(200).json({
            user: reply,
            message: "Valid User" //  Fixed typo: messgae -> message
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message //  Only send message, not full error object
        });
    }
});
module.exports = authRouter;