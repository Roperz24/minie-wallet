import jwt from "jsonwebtoken"
import { env } from "@/config/env"

export interface TokenPayload {
  userId: string
  email: string
  iat?: number
  exp?: number
}

export class JwtService {
  static generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRY,
    })
  }

  static verifyToken(token: string): TokenPayload {
    return jwt.verify(token, env.JWT_SECRET) as TokenPayload
  }

  static decodeToken(token: string): TokenPayload | null {
    return jwt.decode(token) as TokenPayload | null
  }
}
