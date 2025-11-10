import { BlockchainService } from "@/services/blockchain"
import { ethers } from "ethers"

describe("BlockchainService", () => {
  let blockchainService: BlockchainService

  beforeAll(() => {
    blockchainService = new BlockchainService()
  })

  test("should create wallet with valid keys", () => {
    const wallet = blockchainService.createWallet()

    expect(wallet.address).toBeDefined()
    expect(wallet.privateKey).toBeDefined()
    expect(wallet.publicKey).toBeDefined()

    expect(wallet.address).toMatch(/^0x[a-fA-F0-9]{40}$/)
    expect(wallet.privateKey).toMatch(/^0x[a-fA-F0-9]{64}$/)
    expect(wallet.publicKey).toMatch(/^0x/)
  })

  test("should generate unique wallets", () => {
    const wallet1 = blockchainService.createWallet()
    const wallet2 = blockchainService.createWallet()

    expect(wallet1.address).not.toBe(wallet2.address)
    expect(wallet1.privateKey).not.toBe(wallet2.privateKey)
  })

  test("should validate Ethereum address format", () => {
    const wallet = blockchainService.createWallet()
    const isValidAddress = ethers.isAddress(wallet.address)
    expect(isValidAddress).toBe(true)
  })

  test("should validate private key format", () => {
    const wallet = blockchainService.createWallet()
    const isValidKey = wallet.privateKey.match(/^0x[a-fA-F0-9]{64}$/)
    expect(isValidKey).toBeTruthy()
  })
})
