import searchBooks  from "../controller/bookSearchController.js" ;
import isLogin from "../middleware/isLogin.js" ;
import setFilter from "../middleware/setFilter.js" ;
import express from "express" ;
const router = express.Router()

router.get("/search" , isLogin , setFilter , searchBooks)

export default router ;