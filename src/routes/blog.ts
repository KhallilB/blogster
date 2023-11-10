import express from 'express'

import checkAuth from '../middleware/checkAuth'

import {
  createBlog,
  getBlog,
  getAllBlogs,
  getBlogsWithTags,
  getBlogsWithAuthor,
  updateBlog,
  deleteBlog,
} from '../controllers/blog'

const router = express.Router()

// Prefix
router.use('/blog', router)

// Routes
router.post('/create', checkAuth, createBlog)
router.get('/:id', getBlog)
router.get('/', getAllBlogs)
router.post('/tags', getBlogsWithTags)
router.get('/author/:id', getBlogsWithAuthor)
router.put('/:id', checkAuth, updateBlog)
router.delete('/:id', checkAuth, deleteBlog)

export default router
