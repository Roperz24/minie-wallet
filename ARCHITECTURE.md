# Mini Wallet Service - Architecture Guide

## System Overview

The Mini Wallet Service is a production-grade Web3 wallet management system built with modern, scalable technologies.

### Technology Stack

- **Backend**: Express.js + GraphQL (Apollo Server)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Blockchain**: Ethereum (Alchemy RPC)
- **Storage**: IPFS (Infura)
- **Authentication**: JWT + bcrypt
- **Encryption**: AES-256-CBC
- **Container**: Docker + Docker Compose
- **CI/CD**: GitHub Actions

## Architecture Diagram

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                       Frontend (React)                       │
│  - Authentication UI (Login/Register)                       │
│  - Wallet Dashboard                                         │
│  - Transaction Management                                  │
│  - File Upload                                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ GraphQL/REST APIs
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    Backend (Express/GraphQL)                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  GraphQL Server                                      │   │
│  │  - Queries: me, wallet, wallets, transactions       │   │
│  │  - Mutations: createWallet, sendTransaction         │   │
│  │  - Type Definitions & Resolvers                     │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  REST API Routes                                     │   │
│  │  - /api/auth/register, /api/auth/login              │   │
│  │  - /api/wallets (CRUD)                              │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Middleware & Services                              │   │
│  │  - Auth Middleware (JWT verification)               │   │
│  │  - BlockchainService (Wallet creation, tx signing)  │   │
│  │  - IpfsService (File upload/retrieval)              │   │
│  │  - EncryptionService (Private key encryption)       │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────┬─────────────┬──────────────┬────────────────────┘
             │             │              │
             │             │              │
┌────────────▼──┐ ┌────────▼─────┐ ┌────▼──────────┐
│  PostgreSQL   │ │ Alchemy API  │ │  IPFS (Infura)│
│  (Prisma ORM) │ │  (Ethereum)  │ │  (Storage)    │
└───────────────┘ └──────────────┘ └───────────────┘
\`\`\`

## Database Schema

### User Table
- `id` (CUID Primary Key)
- `email` (Unique)
- `passwordHash` (bcrypt hashed)
- `createdAt` / `updatedAt`

### Wallet Table
- `id` (CUID Primary Key)
- `userId` (Foreign Key)
- `address` (Ethereum address)
- `name` (User-defined)
- `encryptedPrivateKey` (AES-256 encrypted)
- `publicKey`
- `balance` (Cached ETH balance)
- `network` (sepolia by default)

### Transaction Table
- `id` (CUID Primary Key)
- `walletId` (Foreign Key)
- `userId` (Foreign Key)
- `type` (transfer, contract interaction, etc.)
- `fromAddress` / `toAddress`
- `amount` (in Wei, stored as string)
- `transactionHash`
- `status` (pending, confirmed, failed)
- `ipfsHash` (Optional, for file attachments)
- `metadata` (JSON metadata)

### IpfsFile Table
- `id` (CUID Primary Key)
- `userId` (Foreign Key)
- `ipfsHash` (Unique content hash)
- `fileName`
- `fileSize`
- `mimeType`
- `transactionId` (Optional, link to transaction)

### ApiKey Table
- `id` (CUID Primary Key)
- `key` (Unique)
- `name`
- `userId` (Optional, for user-specific keys)
- `isActive`
- `lastUsed`
- `expiresAt`

## Security Architecture

### Authentication Flow
1. User registers/logs in with email + password
2. Password hashed with bcrypt (10 rounds)
3. JWT token generated (24h expiry by default)
4. Token stored in localStorage (client-side)
5. Token sent in Authorization header for subsequent requests

### Private Key Protection
1. User creates wallet via blockchain service
2. Private key encrypted with AES-256-CBC
3. Encrypted key stored in database
4. Decrypted only when needed for transaction signing
5. Never exposed to client

### API Security
- Helmet middleware for HTTP header hardening
- CORS configured for trusted origins
- Input validation on all endpoints
- Rate limiting recommended for production
- Environment variables for sensitive config

## Deployment Architecture

### Docker Compose Stack
- `postgres`: PostgreSQL 16 with health checks
- `pgadmin`: Database admin UI (port 5050)
- `api`: Express server (port 3000)

### GitHub Actions CI/CD
1. **Test**: Run unit tests with coverage
2. **Lint**: ESLint checks
3. **Build**: TypeScript compilation
4. **Deploy**: Automatic deployment on main branch (placeholder)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Wallets
- `GET /api/wallets` - List user wallets
- `POST /api/wallets` - Create new wallet
- `GET /api/wallets/:id` - Get wallet details

### GraphQL Endpoint
- `POST /graphql` - GraphQL API

## GraphQL API Reference

### Queries
\`\`\`graphql
query GetMe {
  me {
    id
    email
    wallets {
      id
      address
      name
      balance
    }
  }
}

query GetWallets {
  wallets {
    id
    address
    name
    balance
  }
}

query GetBalance($address: String!) {
  getBalance(address: $address)
}
