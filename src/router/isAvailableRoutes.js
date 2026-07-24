import isAvailable from '../controller/isAvailable.js'
import express from 'express'
const router = express.Router()


router.patch("/isavailable/:isbn/:activity" , isAvailable)

export default router;