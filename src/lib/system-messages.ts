// Server Errors
export const INTERNAL_SERVER_ERROR = "Internal server error"

// Resource Names
export const CLIENT_NAME = "Client name"
export const CLIENT_RECORD = "Client record"
export const DATABASE_URL = "Database url"

// Generic Errors
export const SOMETHING_WENT_WRONG = "Something went wrong! Please try again."

// File Errors
export const FILE_TOO_LARGE_ERROR =
  "File too large. Please upload a smaller file."
export const FILE_MISSING_ERROR = "No file selected."
export const FILE_DOWNLOAD_ERROR = "Could not download file."

export function resourceCreationSuccess(resource: string) {
  return `A new ${resource} has been created.`
}

export function resourceCreationError(resource: string) {
  return `Error creating ${resource}`
}

export function resourceMissingError(resource: string) {
  return `${resource} not found.`
}
