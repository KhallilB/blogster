import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../types'

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (authHeader) {
    const token = authHeader.split(' ')[1]
    console.log(token)
    jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string,
      (err: any, user: any) => {
        if (err) {
          return res.sendStatus(403)
        }

        req.user = user as User
        next()
      }
    )
  } else {
    res.sendStatus(401)
  }
}

export default checkAuth
