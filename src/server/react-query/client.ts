import axios from "axios"
import { useMutation } from "react-query"

interface createClientRecordProps {
  payload: {
    client_name: string
    file_key: string
    file_name: string
  }
}

export const useCreateClientRecordMutation = () => {
  const {
    mutate: createClientRecord,
    isLoading,
    error
  } = useMutation({
    mutationFn: async (payload: createClientRecordProps) => {
      const { data } = await axios.post("/api/client/create", payload)
      if (data?.status !== 200) {
        throw data?.error
      }
      return data
    }
  })

  return { createClientRecord, isLoading, error }
}
