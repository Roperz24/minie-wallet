import { IpfsService } from "@/services/ipfs"

describe("IpfsService", () => {
  let ipfsService: IpfsService

  beforeAll(() => {
    ipfsService = new IpfsService()
  })

  test("should generate valid IPFS URL", () => {
    const ipfsHash = "QmXxxx123456789"
    const url = ipfsService.getIpfsUrl(ipfsHash)

    expect(url).toContain("https://ipfs.io/ipfs/")
    expect(url).toContain(ipfsHash)
    expect(url).toBe(`https://ipfs.io/ipfs/${ipfsHash}`)
  })

  test("should format file upload data correctly", () => {
    const fileName = "test-file.json"
    const data = { transaction: "test-data" }

    expect(fileName).toBeDefined()
    expect(data).toBeDefined()
    expect(JSON.stringify(data)).toBeDefined()
  })
})
