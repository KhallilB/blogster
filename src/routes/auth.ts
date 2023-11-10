import express from 'express'

import { register, login } from '../controllers/auth'

const router = express.Router()

// Prefix
router.use('/auth', router)

// Routes
router.post('/register', register)
router.post('/login', login)

export default router
