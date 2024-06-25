import { Message, OpenAIStream, StreamingTextResponse } from "ai"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { db } from "@/server/neon"
import { clients } from "@/server/neon/schema"
import { chatPrompt } from "@/lib/prompts"
import {
  CLIENT_RECORD,
  INTERNAL_SERVER_ERROR,
  resourceMissingError
} from "@/lib/system-messages"
import { httpStatusCodesEnums } from "@/lib/status-codes-enums"
import { openai } from "@/server/openai"
import { getContext } from "@/server/embeddings"

export async function POST(req: Request) {
  try {
    const { messages, clientId } = await req.json()

    const _client = await db
      .select()
      .from(clients)
      .where(eq(clients.id, clientId))
    if (_client.length != 1) {
      return NextResponse.json(
        { error: resourceMissingError(CLIENT_RECORD) },
        { status: httpStatusCodesEnums.NOT_FOUND }
      )
    }
    const fileKey = _client[0].fileKey
    const lastMessage = messages[messages.length - 1]
    const context = await getContext(lastMessage.content, fileKey)

    const prompt = chatPrompt(context)

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        prompt,
        ...messages.filter((message: Message) => message.role === "user")
      ],
      stream: true
    })

    const stream = OpenAIStream(response, {
      onStart: async () => {
        // save user message into db
        // await db.insert(_messages).values({
        //   chatId,
        //   content: lastMessage.content,
        //   role: "user",
        // });
      },
      onCompletion: async (completion: any) => {
        // save ai message into db
        // await db.insert(_messages).values({
        //   chatId,
        //   content: completion,
        //   role: "system",
        // });
      }
    })
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: INTERNAL_SERVER_ERROR },
      { status: httpStatusCodesEnums.INTERNAL_SERVER_ERROR }
    )
  }
}
