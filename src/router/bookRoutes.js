import express from 'express';
import { addBook, deleteBook, isAvailable, searchBooks, sortBooks, updateBook } from "../controller/bookController.js";
import { isLogin , isAdmin } from '../middleware/isLogin.js';
import uploadImage from "../middleware/uploadImage.js";

const router = express.Router() ;

router.post("/addbook" , isAdmin , uploadImage ,  addBook)
router.delete("/deletebook/:isbn" , isAdmin , deleteBook )
router.patch("/updatebook/:isbn" , isAdmin , uploadImage, updateBook )
router.patch("/isavailable/:isbn/:activity" , isAdmin , isAvailable)

router.get("/search" , isLogin  , searchBooks)
router.get("/sort" , isLogin , sortBooks)

export default router ; 