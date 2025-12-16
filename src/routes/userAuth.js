const express = require('express');
const authRouter = express.Router();
const { register, login, logout ,getProfile,adminRegister,deleteProfile,changePassword,forgetPassword,resetPassword,getAllUsers} = require("../controllers/userAuthenticate")
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
authRouter.post('/forgetPassword',forgetPassword);
// reset password
// authRouter.js
authRouter.post('/resetPassword/:token', resetPassword);  // kebab-case
authRouter.get('/admin/users', adminMiddleware, getAllUsers);

module.exports = authRouter;