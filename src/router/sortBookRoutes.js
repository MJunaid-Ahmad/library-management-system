import sortBooks from '../controller/bookSortController.js'
import express from 'express'
const router = express.Router()

router.get("/sort" , sortBooks)

export default router; 