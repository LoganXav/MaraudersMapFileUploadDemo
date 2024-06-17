import { openai } from "../openai"
import { getMatchesFromEmbeddings } from "../pinecone"

export async function getEmbeddings(text: string) {
  try {
    const response = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: text.replace(/\n/g, " ")
    })

    const result = await response.json()
    return result.data[0].embedding as number[]
  } catch (error) {
    console.log("Error calling openai embeddings api", error)
    throw error
  }
}

export async function getContext(query: string, fileKey: string) {
  const queryEmbeddings = await getEmbeddings(query)
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey)

  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score > 0.7
  )

  type Metadata = {
    text: string
    pageNumber: number
  }

  let docs = qualifyingDocs.map((match) => (match.metadata as Metadata).text)
  // 5 vectors
  return docs.join("\n").substring(0, 3000)
}
