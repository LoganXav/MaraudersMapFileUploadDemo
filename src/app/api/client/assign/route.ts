import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi
} from "openai-edge"
import { Message, OpenAIStream, StreamingTextResponse } from "ai"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { db } from "@/server/neon"
import { clients, staff } from "@/server/neon/schema"
import { getContext } from "@/server/context"

export const runtime = "edge"

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(config)

export async function POST(req: Request) {
  try {
    const { clientId } = await req.json()

    const _client = await db
      .select()
      .from(clients)
      .where(eq(clients.id, clientId))
    if (_client.length !== 1) {
      return NextResponse.json(
        { error: "Client Record not found" },
        { status: 404 }
      )
    }
    const fileKey = _client[0].fileKey
    const context = await getContext("Generate a pitch for the client", fileKey)

    // Fetch the staff data from the database
    const _staff = await db.select().from(staff)

    const staffInfo = _staff.map((member) => ({
      name: `${member.firstName} ${member.lastName}`,
      department: member.department,
      skills: member.skills
    }))

    console.log(staffInfo, "staffInfo")

    const staffInfoString = JSON.stringify(staffInfo)

    const prompt = {
      role: "system",
      content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
      AI assistant will play an important role of assigning staff members to work on a client pitch given a brief document.
      AI assistant will analyze the client briefs and identify the skills needed to generate th pitch.
      [Brief Context Starts Here]
      ${context}
      [Brief Context Ends Here]
      Here is the list of staff and their skills:
      ${staffInfoString}
      
      Match the skills needed for the pitch to the skills of the fetched staff members.
      NOTE - AI assistant will choose exactly one staff member from each distinct department whose skills best match the skills needed for the pitch.
      AI assistant will return only the names of these staff members as a single string.
      `
    }

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [prompt as any]
    })

    const completion = await response.json()
    const result = completion.choices[0].message.content

    return NextResponse.json({ result })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}
