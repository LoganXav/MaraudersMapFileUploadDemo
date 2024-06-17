import { clsx, type ClassValue } from "clsx"
import { toast } from "sonner"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  )
}

export const parseNamesFromString = (namesString: string) => {
  return namesString.split(",").map((name) => name.trim())
}

export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder()
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes))
}

export function convertToAscii(inputString: string) {
  // remove non ascii characters
  const asciiString = inputString.replace(/[^\x00-\x7F]+/g, "")
  return asciiString
}

export function toastErrorMessage(message: string) {
  return toast.error(message)
}

export function toastSuccessMessage(message: string) {
  return toast.success(message)
}

export function toastInfoMessage(message: string) {
  return toast.info(message)
}
