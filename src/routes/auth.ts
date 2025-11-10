import { Router } from "express"
import { PrismaClient } from "@prisma/client"
import { JwtService } from "@/utils/jwt"
import bcrypt from "bcryptjs"

const router = Router()
const prisma = new PrismaClient()

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { email, passwordHash },
    })

    const token = JwtService.generateToken({
      userId: user.id,
      email: user.email,
    })

    res.json({ token, user })
  } catch (error) {
    res.status(500).json({ error: "Registration failed" })
  }
})

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const token = JwtService.generateToken({
      userId: user.id,
      email: user.email,
    })

    res.json({ token, user })
  } catch (error) {
    res.status(500).json({ error: "Login failed" })
  }
})

export default router
