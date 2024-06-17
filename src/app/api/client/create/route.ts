import { httpStatusCodesEnums } from "@/lib/status-codes-enums"
import { INTERNAL_SERVER_ERROR } from "@/lib/system-messages"
import { db } from "@/server/neon"
import { clients } from "@/server/neon/schema"
import { loadS3IntoPinecone } from "@/server/pinecone"
import { getS3Url } from "@/server/s3/upload"
import { NextResponse } from "next/server"

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json()
    const { client_name, file_key, file_name } = body

    await loadS3IntoPinecone(file_key)
    const client_id = await db
      .insert(clients)
      .values({
        fileKey: file_key,
        pdfName: file_name,
        pdfUrl: getS3Url(file_key),
        clientName: client_name
      })
      .returning({
        insertedId: clients.id
      })

    return NextResponse.json(
      {
        client_id: client_id[0].insertedId
      },
      { status: httpStatusCodesEnums.CREATED }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: INTERNAL_SERVER_ERROR },
      { status: httpStatusCodesEnums.INTERNAL_SERVER_ERROR }
    )
  }
}
