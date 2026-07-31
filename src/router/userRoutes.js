import express from 'express';
import { loginUser, registerUser , toRefreshToken , logout } from "../controller/userController.js";
const router = express.Router() ;

router.post("/register" , registerUser)
router.post("/login" ,  loginUser)
router.post("/refresh-token" ,  toRefreshToken)
router.post("/logout" ,  logout)

export default router;