export interface User {
  id: string
  email: string
  wallets: Wallet[]
  createdAt: string
  updatedAt: string
}

export interface Wallet {
  id: string
  address: string
  name: string
  balance: string
  network: string
  publicKey: string
  createdAt: string
  updatedAt: string
  transactions: Transaction[]
}

export interface Transaction {
  id: string
  fromAddress: string
  toAddress: string
  amount: string
  gasPrice: string
  gasLimit: string
  transactionHash: string | null
  status: string
  type: string
  ipfsHash: string | null
  metadata: string | null
  createdAt: string
  updatedAt: string
}

export interface IpfsFile {
  id: string
  ipfsHash: string
  fileName: string
  fileSize: number
  mimeType: string
  url: string
  createdAt: string
}

export interface AuthResponse {
  token: string
  user: User
}
