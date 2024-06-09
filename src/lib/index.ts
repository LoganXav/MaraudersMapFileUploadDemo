import axios from "axios"
import { writeFile, unlink } from "fs/promises"
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import {
  ArxivPaperNote,
  NOTES_TOOL_SCHEMA,
  NOTE_PROMPT,
  outputParser
} from "./prompts"
import { formatDocumentsAsString } from "langchain/util/document"
import { ChatOpenAI } from "@langchain/openai"

export async function convertPdfToDocuments(pdf: Buffer): Promise<any> {
  const randomName = Math.random().toString(36).substring(7)
  const pdfPath = `pdfs/${randomName}.pdf`
  await writeFile(pdfPath, pdf, "binary")

  const loader = new PDFLoader(pdfPath)
  const pages = await loader.load()

  /** Delete the temporary PDF file. */
  await unlink(pdfPath)
  return pages
}

export async function loadPdfFromUrl(url: string): Promise<Buffer> {
  const response = await axios({
    method: "GET",
    url,
    responseType: "arraybuffer"
  })
  return response.data
}

export async function generateNotes(documents: Array<any>): Promise<any> {
  const documentsAsString = formatDocumentsAsString(documents)
  // const model = new ChatOpenAI({
  //   modelName: "gpt-4-1106-preview",
  //   temperature: 0
  // })
  // const modelWithTools = model.bind({
  //   tools: [NOTES_TOOL_SCHEMA],
  //   tool_choice: "auto"
  // })
  // const chain = NOTE_PROMPT.pipe(modelWithTools).pipe(outputParser)
  // const response = await chain.invoke({
  //   paper: documentsAsString
  // })
  // return response

  return documentsAsString
}
