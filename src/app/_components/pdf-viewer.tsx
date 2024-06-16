import React from "react"

type Props = { pdfUrl: string }

const PDFViewer = ({ pdfUrl }: Props) => {
  console.log(pdfUrl)
  return (
    <>
      {pdfUrl && (
        <iframe
          src={`https://docs.google.com/gview?url=${pdfUrl}&embedded=true`}
          className="w-full h-full rounded-md "
        ></iframe>
      )}
    </>
  )
}

export default PDFViewer
