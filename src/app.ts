import express from 'express'

import authRoutes from './routes/auth'
import blogRoutes from './routes/blog'

const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api', [authRoutes, blogRoutes])

export default app
