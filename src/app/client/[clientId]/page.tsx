import BriefChat from "@/components/chat/brief-chat"
import PDFViewer from "@/components/common/pdf-viewer"
import { db } from "@/server/neon"
import { clients } from "@/server/neon/schema"
import { eq } from "drizzle-orm"

type PageProps = {
  params: {
    clientId: string
  }
}

export default async function BriefPage({ params }: PageProps) {
  const { clientId } = params
  const clientIdInt = parseInt(clientId, 10)

  const _client = await db
    .select()
    .from(clients)
    .where(eq(clients.id, clientIdInt))

  return (
    <div className="grid lg:grid-cols-3 min-h-screen w-full">
      <div className="p-4 lg:col-span-1 min-h-[50vh] oveflow-scroll h-full">
        <PDFViewer pdfUrl={_client[0]?.pdfUrl} />
      </div>
      <div className="lg:col-span-2 h-full">
        <BriefChat clientId={clientIdInt} />
      </div>
    </div>
  )
}
