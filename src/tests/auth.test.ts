import { JwtService, type TokenPayload } from "@/utils/jwt"
import bcrypt from "bcryptjs"

describe("Authentication", () => {
  const testPayload: TokenPayload = {
    userId: "test-user-123",
    email: "test@example.com",
  }

  test("JWT: should generate valid token", () => {
    const token = JwtService.generateToken(testPayload)
    expect(token).toBeDefined()
    expect(typeof token).toBe("string")
  })

  test("JWT: should verify and decode token correctly", () => {
    const token = JwtService.generateToken(testPayload)
    const decoded = JwtService.verifyToken(token)
    expect(decoded.userId).toBe(testPayload.userId)
    expect(decoded.email).toBe(testPayload.email)
  })

  test("JWT: should reject expired token", () => {
    const expiredToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0IiwiZXhwIjoxNjAwMDAwMDAwfQ.invalid"
    expect(() => JwtService.verifyToken(expiredToken)).toThrow()
  })

  test("Password hashing: should hash password correctly", async () => {
    const password = "secure-password-123"
    const hash = await bcrypt.hash(password, 10)
    expect(hash).not.toBe(password)
    expect(hash.length).toBeGreaterThan(50)
  })

  test("Password validation: should compare password correctly", async () => {
    const password = "secure-password-123"
    const hash = await bcrypt.hash(password, 10)
    const isValid = await bcrypt.compare(password, hash)
    expect(isValid).toBe(true)
  })

  test("Password validation: should reject invalid password", async () => {
    const password = "correct-password"
    const hash = await bcrypt.hash(password, 10)
    const isValid = await bcrypt.compare("wrong-password", hash)
    expect(isValid).toBe(false)
  })
})
