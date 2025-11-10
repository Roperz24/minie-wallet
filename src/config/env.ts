import dotenv from "dotenv"

dotenv.config()

export const env = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret-key",
  JWT_EXPIRY: process.env.JWT_EXPIRY || "24h",
  ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY || "",
  IPFS_API_URL: process.env.IPFS_API_URL || "https://ipfs.infura.io:5001",
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || "dev-encryption-key-32bytes",
  NETWORK: process.env.NETWORK || "sepolia",
}
