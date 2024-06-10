import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import PDFLib from "pdf-lib"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  )
}

export const convertPdfToImage = async (file: any) => {
  console.log("dataURL")
  const pdfDoc = await PDFLib.readFile(file)
  const firstPage = await pdfDoc.getPage(1)
  const pageBytes = await firstPage.render({ type: "png" })

  const dataURL = `data:image/png;base64,${btoa(pageBytes)}`

  console.log(dataURL, "dataURL")
  return dataURL
}
