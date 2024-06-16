import { Configuration, OpenAIApi } from "openai-edge"
import { Message, OpenAIStream, StreamingTextResponse } from "ai"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { db } from "@/server/neon"
import { clients } from "@/server/neon/schema"
import { getContext } from "@/server/context"

export const runtime = "edge"

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(config)

// Fetch the staff
// Tell the llm to recognize the staff skills needed to work on generating a pitch to the brand
// pass the staff to the llm along with their skills and ask the llm to choose with one staff member from every department whose skill best matches the skills needed for the pitch
// NOTE - only return the names of these staff members

export async function POST(req: Request) {
  try {
    const { messages, clientId } = await req.json()

    const _client = await db
      .select()
      .from(clients)
      .where(eq(clients.id, clientId))
    if (_client.length != 1) {
      return NextResponse.json(
        { error: "Client Record not found" },
        { status: 404 }
      )
    }
    const fileKey = _client[0].fileKey
    const lastMessage = messages[messages.length - 1]
    const context = await getContext(lastMessage.content, fileKey)

    const prompt = {
      role: "system",
      content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
      The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
      AI is a well-behaved and well-mannered individual.
      AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
      AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
      AI assistant is a big fan of Pinecone and Vercel.
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK
      AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
      If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
      AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
      AI assistant will not invent anything that is not drawn directly from the context.
      `
    }

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
  }
}
