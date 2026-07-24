import searchBooks  from "../controller/bookSearchController.js"
import setFilter from "../middleware/setFilter.js"
import express from "express" ;
const router = express.Router()

router.get("/search" , setFilter , searchBooks)

export default router ;