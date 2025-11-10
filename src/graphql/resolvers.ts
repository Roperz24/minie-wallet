import { PrismaClient } from "@prisma/client"
import { BlockchainService } from "@/services/blockchain"
import { IpfsService } from "@/services/ipfs"
import { EncryptionService } from "@/utils/encryption"
import { JwtService } from "@/utils/jwt"
import { env } from "@/config/env"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()
const blockchainService = new BlockchainService()
const ipfsService = new IpfsService()
const encryptionService = new EncryptionService(env.ENCRYPTION_KEY)

export const resolvers = {
  Query: {
    me: async (_: any, __: any, { userId }: any) => {
      return prisma.user.findUnique({
        where: { id: userId },
        include: { wallets: true },
      })
    },
    wallet: async (_: any, { id }: any, { userId }: any) => {
      const wallet = await prisma.wallet.findFirst({
        where: { id, userId },
      })
      if (!wallet) throw new Error("Wallet not found")
      return wallet
    },
    wallets: async (_: any, __: any, { userId }: any) => {
      return prisma.wallet.findMany({
        where: { userId },
        include: { transactions: true },
      })
    },
    getBalance: async (_: any, { address }: any) => {
      return blockchainService.getBalance(address)
    },
    getGasPrice: async () => {
      return blockchainService.getGasPrice()
    },
  },
  Mutation: {
    register: async (_: any, { email, password }: any) => {
      const existingUser = await prisma.user.findUnique({ where: { email } })
      if (existingUser) throw new Error("User already exists")

      const passwordHash = await bcrypt.hash(password, 10)
      const user = await prisma.user.create({
        data: { email, passwordHash },
      })

      const token = JwtService.generateToken({ userId: user.id, email: user.email })
      return { token, user }
    },
    login: async (_: any, { email, password }: any) => {
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) throw new Error("User not found")

      const isValidPassword = await bcrypt.compare(password, user.passwordHash)
      if (!isValidPassword) throw new Error("Invalid password")

      const token = JwtService.generateToken({ userId: user.id, email: user.email })
      return { token, user }
    },
    createWallet: async (_: any, { name }: any, { userId }: any) => {
      const { address, privateKey, publicKey } = blockchainService.createWallet()
      const encryptedPrivateKey = encryptionService.encrypt(privateKey)

      return prisma.wallet.create({
        data: {
          userId,
          address,
          name,
          encryptedPrivateKey,
          publicKey,
          network: env.NETWORK,
        },
      })
    },
    sendTransaction: async (_: any, { walletId, toAddress, amount, metadata }: any, { userId }: any) => {
      const wallet = await prisma.wallet.findFirst({
        where: { id: walletId, userId },
      })
      if (!wallet) throw new Error("Wallet not found")

      const decryptedPrivateKey = encryptionService.decrypt(wallet.encryptedPrivateKey)
      const txHash = await blockchainService.sendTransaction(decryptedPrivateKey, toAddress, amount)

      return prisma.transaction.create({
        data: {
          walletId,
          userId,
          type: "transfer",
          fromAddress: wallet.address,
          toAddress,
          amount,
          gasPrice: "0",
          gasLimit: "21000",
          transactionHash: txHash,
          status: "confirmed",
          metadata,
        },
      })
    },
    uploadToIpfs: async (_: any, { file, fileName }: any, { userId }: any) => {
      const buffer = Buffer.from(file, "base64")
      const ipfsHash = await ipfsService.uploadFile(buffer, fileName)

      return prisma.ipfsFile.create({
        data: {
          userId,
          ipfsHash,
          fileName,
          fileSize: buffer.length,
          mimeType: "application/octet-stream",
        },
      })
    },
  },
}
