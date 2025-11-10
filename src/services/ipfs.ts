import { create } from "ipfs-http-client"
import { env } from "@/config/env"

export class IpfsService {
  private client: any

  constructor() {
    this.client = create({
      url: env.IPFS_API_URL,
    })
  }

  async uploadFile(file: Buffer, fileName: string): Promise<string> {
    const result = await this.client.add({
      path: fileName,
      content: file,
    })
    return result.cid.toString()
  }

  async uploadJson(data: any, fileName: string): Promise<string> {
    const jsonBuffer = Buffer.from(JSON.stringify(data))
    const result = await this.client.add({
      path: fileName,
      content: jsonBuffer,
    })
    return result.cid.toString()
  }

  async retrieveFile(ipfsHash: string): Promise<Buffer> {
    const chunks = []
    for await (const chunk of this.client.cat(ipfsHash)) {
      chunks.push(chunk)
    }
    return Buffer.concat(chunks)
  }

  async retrieveJson(ipfsHash: string): Promise<any> {
    const buffer = await this.retrieveFile(ipfsHash)
    return JSON.parse(buffer.toString())
  }

  getIpfsUrl(hash: string): string {
    return `https://ipfs.io/ipfs/${hash}`
  }
}
