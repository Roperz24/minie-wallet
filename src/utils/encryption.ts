import crypto from "crypto"

const algorithm = "aes-256-cbc"

export class EncryptionService {
  private key: Buffer

  constructor(encryptionKey: string) {
    this.key = crypto.scryptSync(encryptionKey, "salt", 32)
  }

  encrypt(text: string): string {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(algorithm, this.key, iv)
    let encrypted = cipher.update(text)
    encrypted = Buffer.concat([encrypted, cipher.final()])
    return iv.toString("hex") + ":" + encrypted.toString("hex")
  }

  decrypt(text: string): string {
    const parts = text.split(":")
    const iv = Buffer.from(parts[0], "hex")
    const encrypted = Buffer.from(parts[1], "hex")
    const decipher = crypto.createDecipheriv(algorithm, this.key, iv)
    let decrypted = decipher.update(encrypted)
    decrypted = Buffer.concat([decrypted, decipher.final()])
    return decrypted.toString()
  }
}
