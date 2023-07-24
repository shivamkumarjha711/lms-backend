import { Router } from "express";
import { changePassword, forgotPassword, register, login, logout, getProfile, resetPassword, updateUser } from '../controllers/user.controller.js'
import { isLoggedin } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const userRoutes = Router();

userRoutes.post('/register', upload.single("avatar") , register);
userRoutes.post('/login', login);
userRoutes.get('/logout', logout);
userRoutes.get('/me', isLoggedin , getProfile);
userRoutes.post('/reset', forgotPassword);
userRoutes.post('/reset/:resetToken', resetPassword);
userRoutes.post('/change-password', isLoggedin, changePassword);
userRoutes.put('/update', isLoggedin, upload.single("avatar") , updateUser)

export default userRoutes;

