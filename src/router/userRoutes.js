import express from 'express';
import { loginUser, registerUser , toRefreshToken } from "../controller/userController.js";
const router = express.Router() ;

router.post("/register" , registerUser)
router.post("/login" ,  loginUser)
router.post("/refresh-token" ,  toRefreshToken)

export default router;