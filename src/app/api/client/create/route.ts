import { loadS3IntoPinecone } from "@/server/pinecone/client"
import { NextResponse } from "next/server"

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json()
    const { client_name, file_key, file_name } = body
    await loadS3IntoPinecone(file_key)

    // TODO - Save to client record and file(key, url, name) DB using neonDB client and return clientId

    return NextResponse.json({})
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    )
  }
}
