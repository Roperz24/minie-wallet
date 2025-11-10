# Mini Wallet Service

A production-grade Web3 wallet service built with TypeScript, Express, GraphQL, PostgreSQL, Alchemy, and IPFS integration for managing Ethereum wallets on Sepolia testnet.

## Architecture

\`\`\`
┌─────────────────┐
│   React UI      │
└────────┬────────┘
         │ GraphQL/REST
┌────────▼────────┐
│   Express API   │
│   + GraphQL     │
└────────┬────────┘
         │
┌────────▼────────┐        ┌──────────────┐
│   PostgreSQL    │        │    IPFS      │
│   + Prisma      │        │   Storage    │
└────────┬────────┘        └──────┬───────┘
         │                        │
┌────────▼────────────────────────▼─────┐
│     Alchemy Ethereum Sepolia API      │
│     (Blockchain Transactions)         │
└───────────────────────────────────────┘
\`\`\`

## Features

- User authentication with JWT
- Wallet creation and management
- Private key encryption (AES-256)
- Transaction signing and broadcasting
- IPFS file storage integration
- GraphQL API with full type safety
- REST API endpoints
- PostgreSQL database with Prisma ORM
- Docker containerization
- GitHub Actions CI/CD
- Comprehensive test coverage
- Security middleware (Helmet, CORS)

## Environment Variables

\`\`\`
DATABASE_URL=postgresql://user:password@localhost:5432/wallet_db
JWT_SECRET=your-jwt-secret-key
ENCRYPTION_KEY=your-32-byte-encryption-key
ALCHEMY_API_KEY=your-alchemy-api-key
IPFS_API_URL=https://ipfs.infura.io:5001
NODE_ENV=development
PORT=3000
NETWORK=sepolia
\`\`\`

## Setup

\`\`\`bash
npm install
npm run prisma:migrate
npm run dev
\`\`\`

## Docker

\`\`\`bash
docker-compose up -d
\`\`\`

## Testing

\`\`\`bash
npm test
npm test:watch
\`\`\`

## GraphQL Queries

```graphql
# Get user info
query {
  me {
    id
    email
    wallets {
      id
      address
      balance
    }
  }
}

# Get wallet balance
query {
  getBalance(address: "0x...")
}

# Create wallet
mutation {
  createWallet(name: "My Wallet") {
    id
    address
    publicKey
  }
}

# Send transaction
mutation {
  sendTransaction(
    walletId: "..."
    toAddress: "0x..."
    amount: "0.5"
  ) {
    id
    transactionHash
    status
  }
}
