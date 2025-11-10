import { ethers } from "ethers"
import { env } from "@/config/env"

export class BlockchainService {
  private provider: ethers.JsonRpcProvider

  constructor() {
    const rpcUrl = `https://eth-${env.NETWORK}.g.alchemy.com/v2/${env.ALCHEMY_API_KEY}`
    this.provider = new ethers.JsonRpcProvider(rpcUrl)
  }

  async getBalance(address: string): Promise<string> {
    const balance = await this.provider.getBalance(address)
    return ethers.formatEther(balance)
  }

  async getGasPrice(): Promise<string> {
    const gasPrice = await this.provider.getFeeData()
    return gasPrice?.gasPrice?.toString() || "0"
  }

  async sendTransaction(privateKey: string, toAddress: string, amount: string, data?: string): Promise<string> {
    const wallet = new ethers.Wallet(privateKey, this.provider)
    const tx = {
      to: toAddress,
      value: ethers.parseEther(amount),
      data: data || "0x",
    }
    const transaction = await wallet.sendTransaction(tx)
    await transaction.wait()
    return transaction.hash
  }

  async getTransactionStatus(hash: string): Promise<any> {
    const receipt = await this.provider.getTransactionReceipt(hash)
    return receipt
  }

  createWallet(): { address: string; privateKey: string; publicKey: string } {
    const wallet = ethers.Wallet.createRandom()
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      publicKey: wallet.publicKey,
    }
  }
}
