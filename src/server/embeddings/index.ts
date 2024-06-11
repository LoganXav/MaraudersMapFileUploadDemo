import { openai } from "../openai"

export async function getEmbeddings(text: string) {
  try {
    console.log(openai, "openai========================")
    const response = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: text.replace(/\n/g, " ")
    })
    console.log(
      response,
      "response===========+++++++++++++++++++++============="
    )

    const result = await response.json()
    return result.data[0].embedding as number[]
  } catch (error) {
    console.log("Error calling openai embeddings api", error)
    throw error
  }
}
