import express from 'express';
import { loginUser, logout, registerUser, toRefreshToken } from "../controller/userController.js";
const router = express.Router() ;

router.post("/register" , registerUser)
router.post("/login" ,  loginUser)
router.post("/refresh-token" ,  toRefreshToken)
router.post("/logout" ,  logout)

export default router;