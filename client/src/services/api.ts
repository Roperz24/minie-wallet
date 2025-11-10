import { gql } from "@apollo/client"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000"

export const getAuthToken = () => localStorage.getItem("auth_token")
export const setAuthToken = (token: string) => localStorage.setItem("auth_token", token)
export const clearAuthToken = () => localStorage.removeItem("auth_token")

export const apiCall = async (endpoint: string, options?: RequestInit) => {
  const token = getAuthToken()
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options?.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }

  return response.json()
}

export const authService = {
  register: (email: string, password: string) =>
    apiCall("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  login: (email: string, password: string) =>
    apiCall("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
}

export const walletService = {
  getWallets: () => apiCall("/api/wallets"),

  getWallet: (id: string) => apiCall(`/api/wallets/${id}`),

  createWallet: (name: string) =>
    apiCall("/api/wallets", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),
}

export const GraphQL_QUERIES = {
  GET_ME: gql`
    query GetMe {
      me {
        id
        email
        wallets {
          id
          address
          name
          balance
          network
          createdAt
        }
      }
    }
  `,

  GET_WALLETS: gql`
    query GetWallets {
      wallets {
        id
        address
        name
        balance
        network
        transactions {
          id
          status
          createdAt
        }
      }
    }
  `,

  GET_WALLET: gql`
    query GetWallet($id: ID!) {
      wallet(id: $id) {
        id
        address
        name
        balance
        network
        transactions {
          id
          fromAddress
          toAddress
          amount
          status
          transactionHash
          createdAt
        }
      }
    }
  `,

  GET_BALANCE: gql`
    query GetBalance($address: String!) {
      getBalance(address: $address)
    }
  `,

  GET_GAS_PRICE: gql`
    query GetGasPrice {
      getGasPrice
    }
  `,
}

export const GraphQL_MUTATIONS = {
  CREATE_WALLET: gql`
    mutation CreateWallet($name: String!) {
      createWallet(name: $name) {
        id
        address
        name
        balance
        publicKey
      }
    }
  `,

  SEND_TRANSACTION: gql`
    mutation SendTransaction(
      $walletId: ID!
      $toAddress: String!
      $amount: String!
      $metadata: String
    ) {
      sendTransaction(
        walletId: $walletId
        toAddress: $toAddress
        amount: $amount
        metadata: $metadata
      ) {
        id
        transactionHash
        status
        createdAt
      }
    }
  `,

  UPLOAD_TO_IPFS: gql`
    mutation UploadToIpfs($file: String!, $fileName: String!) {
      uploadToIpfs(file: $file, fileName: $fileName) {
        id
        ipfsHash
        fileName
        url
      }
    }
  `,
}
