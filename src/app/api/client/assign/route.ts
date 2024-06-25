import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { db } from "@/server/neon"
import { clients, staff } from "@/server/neon/schema"
import {
  CLIENT_RECORD,
  INTERNAL_SERVER_ERROR,
  resourceMissingError
} from "@/lib/system-messages"
import { httpStatusCodesEnums } from "@/lib/status-codes-enums"
import { assignPrompt } from "@/lib/prompts"
import { openai } from "@/server/openai"
import { getContext } from "@/server/embeddings"

export async function POST(req: Request) {
  try {
    const { clientId } = await req.json()

    const _client = await db
      .select()
      .from(clients)
      .where(eq(clients.id, clientId))
    if (_client.length !== 1) {
      return NextResponse.json(
        { error: resourceMissingError(CLIENT_RECORD) },
        { status: httpStatusCodesEnums.NOT_FOUND }
      )
    }
    const fileKey = _client[0].fileKey
    const context = await getContext("Summarize the entire brief", fileKey)

    const _staff = await db.select().from(staff)
    const staffInfoRecord = _staff.map((member) => ({
      name: `${member.firstName} ${member.lastName}`,
      department: member.department,
      skills: member.skills
    }))

    const staffInfo = JSON.stringify(staffInfoRecord)

    const prompt = assignPrompt(context, staffInfo)

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [prompt as any]
    })

    const completion = await response.json()
    const result = completion.choices[0].message.content

    return NextResponse.json({ result })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: INTERNAL_SERVER_ERROR },
      { status: httpStatusCodesEnums.INTERNAL_SERVER_ERROR }
    )
  }
}
