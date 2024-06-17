"use client"
import { Button } from "./button"
import { ArrowLeftIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation"

type Props = { pdfUrl: string }

const PDFViewer = ({ pdfUrl }: Props) => {
  const router = useRouter()
  return (
    <>
      {pdfUrl ? (
        <iframe
          src={`https://docs.google.com/gview?url=${pdfUrl}&embedded=true`}
          className="w-full h-full rounded-md "
        ></iframe>
      ) : (
        <div className="h-full flex flex-col text-center items-center justify-center">
          <h3 className="text-4xl font-bold">No Brief Found.</h3>
          <p className="">Please go back and upload a client brief.</p>
          <Button className="mt-4" onClick={() => router.push("/")}>
            Go back <ArrowLeftIcon className="ml-1 w-4 h-4" />
          </Button>
        </div>
      )}
    </>
  )
}

export default PDFViewer
