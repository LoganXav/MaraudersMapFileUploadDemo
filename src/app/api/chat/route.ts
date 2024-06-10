// import { convertPdfToDocuments, generateNotes, loadPdfFromUrl } from "@/lib"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    // const { paperUrl } = await req.json()
    // let pdfAsBuffer = await loadPdfFromUrl(paperUrl)

    // const documents = await convertPdfToDocuments(pdfAsBuffer)
    // const notes = await generateNotes(documents)

    return NextResponse.json(null)
  } catch (error) {
    console.error(error, "Error==============")
  }
}
