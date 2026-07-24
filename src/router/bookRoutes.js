import {addBook , deleteBook , updateBook} from "../controller/bookController.js" ;
import updatedData from "../middleware/updateData.js";
import validateBookData from "../middleware/validateBookData.js";
import express from 'express'

const router = express.Router() ;

router.post("/addbook" , validateBookData ,  addBook)
router.delete("/deletebook/:isbn" , deleteBook)
router.patch("/updatebook/:isbn" , updatedData , updateBook)



export default router ; 