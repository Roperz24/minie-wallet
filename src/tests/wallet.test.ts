import { BlockchainService } from "@/services/blockchain"

describe("BlockchainService", () => {
  let blockchainService: BlockchainService

  beforeAll(() => {
    blockchainService = new BlockchainService()
  })

  test("should create a random wallet", () => {
    const wallet = blockchainService.createWallet()
    expect(wallet.address).toBeDefined()
    expect(wallet.privateKey).toBeDefined()
    expect(wallet.publicKey).toBeDefined()
    expect(wallet.address).toMatch(/^0x/)
  })

  test("should validate Ethereum address format", () => {
    const wallet = blockchainService.createWallet()
    expect(wallet.address).toMatch(/^0x[a-fA-F0-9]{40}$/)
  })
})
