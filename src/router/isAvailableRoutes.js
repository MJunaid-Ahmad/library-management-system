import isAvailable from '../controller/isAvailable.js'
import isAdmin from '../middleware/isAdmin.js'
import express from 'express'
const router = express.Router()


router.patch("/isavailable/:isbn/:activity" , isAdmin , isAvailable)

export default router;