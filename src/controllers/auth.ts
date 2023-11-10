import { Request, Response } from 'express'
import { Document } from 'mongoose'
import jwt from 'jsonwebtoken'

import User from '../models/User'

// Registers a new user
export const register = async (req: Request, res: Response) => {
  const { email, password, username } = req.body

  const user = new User({
    email,
    password,
    username,
  })

  // Check if email or username already exists
  await User.find({ $or: [{ email }, { username }] })
    .then((users: Document[]) => {
      if (users.length > 0) {
        return res
          .status(400)
          .json({ message: 'Email or username already exists' })
      }
    })
    .catch((err: Error) => {
      return res.status(400).json(err)
    })

  try {
    // Save user
    const savedUser = await user.save()
    res
      .status(201)
      .json({ message: 'User registered successfully', user: savedUser })
  } catch (err) {
    res.status(400).json(err)
  }
}

// Logs in a user
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  // Check if email exists
  const user = await User.findOne({ email })

  if (!user) {
    return res.status(400).json({ message: 'Email does not exist' })
  }

  // Check if password is correct
  const validPassword = await user.comparePassword(password)
  if (!validPassword) {
    return res.status(400).json({ message: 'Invalid password' })
  }

  // Create and assign token
  const token = jwt.sign(
    { _id: user._id },
    process.env.JWT_SECRET_KEY as string,
    { expiresIn: process.env.JWT_EXPIRES_IN as string }
  )

  res.status(200).send({ message: 'Logged in successfully', token })
}
