import type { Request, Response, NextFunction } from "express"
import { JwtService } from "@/utils/jwt"

declare global {
  namespace Express {
    interface Request {
      userId?: string
      email?: string
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid authorization header" })
    }

    const token = authHeader.slice(7)
    const payload = JwtService.verifyToken(token)
    req.userId = payload.userId
    req.email = payload.email
    next()
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" })
  }
}
