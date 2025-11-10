import { gql } from "apollo-server-express"

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    wallets: [Wallet!]!
    createdAt: String!
    updatedAt: String!
  }

  type Wallet {
    id: ID!
    address: String!
    name: String!
    balance: String!
    network: String!
    publicKey: String!
    createdAt: String!
    updatedAt: String!
    transactions: [Transaction!]!
  }

  type Transaction {
    id: ID!
    fromAddress: String!
    toAddress: String!
    amount: String!
    gasPrice: String!
    gasLimit: String!
    transactionHash: String
    status: String!
    type: String!
    ipfsHash: String
    metadata: String
    createdAt: String!
    updatedAt: String!
  }

  type IpfsFile {
    id: ID!
    ipfsHash: String!
    fileName: String!
    fileSize: Int!
    mimeType: String!
    url: String!
    createdAt: String!
  }

  type AuthResponse {
    token: String!
    user: User!
  }

  type Query {
    me: User!
    wallet(id: ID!): Wallet!
    wallets: [Wallet!]!
    transaction(id: ID!): Transaction!
    transactions(walletId: ID!): [Transaction!]!
    getBalance(address: String!): String!
    getGasPrice: String!
    ipfsFile(id: ID!): IpfsFile!
  }

  type Mutation {
    register(email: String!, password: String!): AuthResponse!
    login(email: String!, password: String!): AuthResponse!
    createWallet(name: String!): Wallet!
    renameWallet(id: ID!, name: String!): Wallet!
    deleteWallet(id: ID!): Boolean!
    sendTransaction(walletId: ID!, toAddress: String!, amount: String!, metadata: String): Transaction!
    uploadToIpfs(file: String!, fileName: String!): IpfsFile!
    attachIpfsToTransaction(transactionId: ID!, ipfsHash: String!): Transaction!
  }

  type Subscription {
    transactionUpdated(walletId: ID!): Transaction!
  }
`
