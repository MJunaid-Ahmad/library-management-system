import express from 'express';
import { loginUser , registerUser, deleteUser , updateUser, toRefreshToken, logout,multipleResponse} from "../controller/userController.js";
import {isLogin , isAdmin} from '../middleware/isLogin.js'
const router = express.Router() ;

router.post("/register" , registerUser)
router.post("/login" ,  loginUser)
router.delete("/delete/:id" , isLogin , isAdmin ,  deleteUser)
router.patch("/update/:id" , isLogin , isAdmin ,   updateUser)
router.post("/refresh-token" ,  toRefreshToken)
router.post("/logout" , isLogin ,  logout)
router.get("/multi" ,  multipleResponse)

export default router;