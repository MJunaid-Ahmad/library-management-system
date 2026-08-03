import express from 'express';
import { addBook, deleteBook, isAvailable, searchBooks, sortBooks, updateBook } from "../controller/bookController.js";
import { isAdmin, isLogin } from '../middleware/isLogin.js';
import uploadImage from "../middleware/uploadImage.js";

const router = express.Router() ;

router.post("/addbook" , isLogin , isAdmin , uploadImage ,  addBook)
router.delete("/deletebook/:isbn" , isLogin , isAdmin , deleteBook )
router.patch("/updatebook/:isbn" , isLogin , isAdmin , uploadImage, updateBook )
router.patch("/isavailable/:isbn/:activity" , isLogin , isAdmin , isAvailable)

router.get("/search" , isLogin  , searchBooks)
router.get("/sort" , isLogin , sortBooks)

export default router ; 