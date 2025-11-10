import { Router } from "express"
import { PrismaClient } from "@prisma/client"
import { BlockchainService } from "@/services/blockchain"
import { EncryptionService } from "@/utils/encryption"
import { authMiddleware } from "@/middleware/auth"
import { env } from "@/config/env"

const router = Router()
const prisma = new PrismaClient()
const blockchainService = new BlockchainService()
const encryptionService = new EncryptionService(env.ENCRYPTION_KEY)

router.use(authMiddleware)

router.get("/", async (req, res) => {
  try {
    const wallets = await prisma.wallet.findMany({
      where: { userId: req.userId },
      include: { transactions: true },
    })
    res.json(wallets)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch wallets" })
  }
})

router.post("/", async (req, res) => {
  try {
    const { name } = req.body
    const { address, privateKey, publicKey } = blockchainService.createWallet()
    const encryptedPrivateKey = encryptionService.encrypt(privateKey)

    const wallet = await prisma.wallet.create({
      data: {
        userId: req.userId!,
        address,
        name,
        encryptedPrivateKey,
        publicKey,
        network: env.NETWORK,
      },
    })

    res.status(201).json(wallet)
  } catch (error) {
    res.status(500).json({ error: "Failed to create wallet" })
  }
})

router.get("/:id", async (req, res) => {
  try {
    const wallet = await prisma.wallet.findFirst({
      where: { id: req.params.id, userId: req.userId },
    })

    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found" })
    }

    const balance = await blockchainService.getBalance(wallet.address)
    await prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance },
    })

    res.json({ ...wallet, balance })
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch wallet" })
  }
})

export default router
