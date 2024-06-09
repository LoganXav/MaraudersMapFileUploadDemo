import { Pinecone } from "@pinecone-database/pinecone"

export const getPineconeClient = () => {
  return new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!
  })
}

export async function loadS3IntoPinecone(file_key: string) {}
