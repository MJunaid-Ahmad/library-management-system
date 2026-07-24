import {registerUser , loginUser} from "../controller/userController.js";
import { validateUserData , validateLoginData} from "../middleware/validateUserData.js";
import express from 'express'
const router = express.Router() ;

router.post("/register" , validateUserData , registerUser)
router.post("/login" , validateLoginData , loginUser)

export default router;