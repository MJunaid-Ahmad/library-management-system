import {addBook , deleteBook , updateBook} from "../controller/bookController.js" ;
import uploadImage from "../utils/uploadImage.js"
import updatedData from "../middleware/updateData.js";
import validateBookData from "../middleware/validateBookData.js";
import isAdmin from "../middleware/isAdmin.js"
import express from 'express'

const router = express.Router() ;

router.post("/addbook" , isAdmin , uploadImage.single("coverImage")  , validateBookData ,  addBook)

router.delete("/deletebook/:isbn" , isAdmin , deleteBook )
router.patch("/updatebook/:isbn" , isAdmin , updatedData , updateBook )

export default router ; 