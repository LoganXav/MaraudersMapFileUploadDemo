import ChatComponent from "@/app/_components/chat-component"
import PDFViewer from "@/app/_components/pdf-viewer"
import { Textarea } from "@/components/common/textarea"
import { db } from "@/server/neon"
import { clients } from "@/server/neon/schema"
import { eq } from "drizzle-orm"

type Props = {
  params: {
    clientId: string
  }
}

export default async function BriefPage({ params }: Props) {
  const { clientId } = params
  const clientIdInt = parseInt(clientId, 10)

  const _client = await db
    .select()
    .from(clients)
    .where(eq(clients.id, clientIdInt))

  console.log(_client, "_client")

  return (
    <div className="grid lg:grid-cols-3 min-h-screen w-full">
      <div className="p-4 lg:col-span-1 min-h-[50vh] oveflow-scroll h-full">
        <PDFViewer pdfUrl={_client[0]?.pdfUrl || ""} />
      </div>
      <div className="lg:col-span-2 h-full">
        <ChatComponent clientId={clientIdInt} />
      </div>
    </div>
  )
}
