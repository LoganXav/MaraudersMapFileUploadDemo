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
      const data = await axios.post("/api/client/create", payload)

      if (data?.status !== 200) {
        throw Error()
      }
      return data.data
    }
  })

  return { createClientRecord, isLoading, error }
}

export const useAssignStaffMutation = (onSuccess: any) => {
  const {
    mutate: assignStaff,
    isLoading,
    error
  } = useMutation({
    mutationFn: async (payload: { clientId: number | string }) => {
      const data = await axios.post("/api/client/assign", payload)

      if (data?.status !== 200) {
        throw Error()
      }
      return data.data
    },
    onSuccess
  })

  return { assignStaff, isLoading, error }
}
