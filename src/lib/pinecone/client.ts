import { Pinecone } from "@pinecone-database/pinecone"
import { downloadFromS3 } from "../s3/server"
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"

export const getPineconeClient = () => {
  return new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!
  })
}

export async function loadS3IntoPinecone(file_key: string) {
  console.log("downloading s3 into file system")

  // TODO - Implement download from S3 bucket
  const file_name = await downloadFromS3(file_key)
  if (!file_name) {
    throw new Error("could not download from s3")
  }
  console.log("loading pdf into memory" + file_name)
  const loader = new PDFLoader(file_name)
  const pages = await loader.load()
}
