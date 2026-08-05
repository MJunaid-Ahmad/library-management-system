import express from 'express';
import { deleteUser, loginUser, logout, registerUser, toRefreshToken, updateUser } from "../controller/userController.js";
import { isAdmin, isLogin } from '../middleware/isLogin.js';
const router = express.Router() ;

router.post("/register" , registerUser)
router.post("/login" ,  loginUser)
router.delete("/delete/:id" , isLogin , isAdmin ,  deleteUser)
router.patch("/update/:id" , isLogin , isAdmin ,   updateUser)
router.post("/refresh-token" ,  toRefreshToken)
router.post("/logout" , isLogin ,  logout)

export default router;