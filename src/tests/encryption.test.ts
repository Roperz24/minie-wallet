import { EncryptionService } from "@/utils/encryption"

describe("EncryptionService", () => {
  let encryptionService: EncryptionService

  beforeAll(() => {
    encryptionService = new EncryptionService("test-secret-key-for-testing-purposes-32")
  })

  test("should encrypt and decrypt text", () => {
    const originalText = "my-private-key-12345"
    const encrypted = encryptionService.encrypt(originalText)
    const decrypted = encryptionService.decrypt(encrypted)

    expect(encrypted).not.toBe(originalText)
    expect(decrypted).toBe(originalText)
  })

  test("should produce different ciphertexts for same plaintext", () => {
    const text = "test-data"
    const encrypted1 = encryptionService.encrypt(text)
    const encrypted2 = encryptionService.encrypt(text)

    expect(encrypted1).not.toBe(encrypted2)
    expect(encryptionService.decrypt(encrypted1)).toBe(text)
    expect(encryptionService.decrypt(encrypted2)).toBe(text)
  })
})
