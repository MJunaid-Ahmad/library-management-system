import sortBooks from '../controller/bookSortController.js'
import isLogin from "../middleware/isLogin.js" ;
import express from 'express'
const router = express.Router()

router.get("/sort" , isLogin , sortBooks)

export default router; 