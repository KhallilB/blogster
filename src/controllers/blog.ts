import { Request, Response } from 'express'

import Blog from '../models/Blog'

// Create a new blog
export const createBlog = async (req: Request, res: Response) => {
  const { title, content, tags } = req.body
  const author = req.user?._id

  const blog = new Blog({
    title,
    content,
    author,
    tags,
    likes: 0,
  })

  try {
    const savedBlog = await blog.save()
    res
      .status(201)
      .json({ message: 'Blog created successfully', blog: savedBlog })
  } catch (err) {
    res.status(400).json(err)
  }
}

// Get specific blog
export const getBlog = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const blog = await Blog.findById(id)
    res.status(200).json({ message: 'Blog found', blog })
  } catch (err) {
    res.status(400).json(err)
  }
}

// Get all blogs
export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find()
    res.status(200).json({ message: 'Blogs found', blogs })
  } catch (err) {
    res.status(400).json(err)
  }
}

// Get blogs with tag
export const getBlogsWithTags = async (req: Request, res: Response) => {
  const { tags } = req.body
  try {
    let blogTags = tags
    if(blogTags.length === 0) return res.status(400).json({ message: 'No tags provided' })
    // If tags not an array, convert to array
    if(!Array.isArray(tags)) blogTags = [tags]
  
    const blogs = await Blog.findBlogsWithTags(tags)
    res.status(200).json({ message: 'Blogs found', blogs })
  } catch (err) {
    res.status(400).json(err)
  }
}

// Get blogs with author
export const getBlogsWithAuthor = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const blogs = await Blog.findBlogsWithAuthor(id)
    res.status(200).json({ message: 'Blogs found', blogs })
  } catch (err) {
    res.status(400).json(err)
  }
}

// Update blog
export const updateBlog = async (req: Request, res: Response) => {
  const { id } = req.params
  const { title, content, tags } = req.body
  const user = req.user?._id

  try {
    const blog = await Blog.findById(id)

    // Check if user is author of blog
    if (blog?.author.toString() !== user?.toString()) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    // Check if blog exists
    if (!blog) {
      return res.status(400).json({ message: 'Blog not found' })
    }

    // Update blog
    blog.title = title ?? blog.title
    blog.content = content ?? blog.content
    blog.tags = tags ?? blog.tags

    const updatedBlog = await blog.save()

    res.status(200).json({ message: 'Blog updated', blog: updatedBlog })
  } catch (err) {
    res.status(400).json(err)
  }
}

// Delete blog
export const deleteBlog = async (req: Request, res: Response) => {
  const { id } = req.params
  const user = req.user?._id

  try {
    const blog = await Blog.findById(id)

    // Check if user is author of blog
    if (blog?.author.toString() !== user?.toString()) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    // Check if blog exists
    if (!blog) {
      return res.status(400).json({ message: 'Blog not found' })
    }

    await blog.deleteOne({ _id: id })

    res.status(200).json({ message: 'Blog deleted' })
  } catch (err) {
    res.status(400).json(err)
  }
}
