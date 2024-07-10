import axios from "axios"
import { useMutation } from "react-query"
import { assignStaffArgsType, createClientRecordArgsType } from "../types"
import { Console } from "console"

export const useCreateClientRecordMutation = () => {
  const {
    mutate: createClientRecord,
    isLoading,
    error
  } = useMutation({
    mutationFn: async (payload: createClientRecordArgsType) => {
      const data = await axios.post("/api/client/create", payload)
      console.log(data, "CreateClientMutation Data");

      if (data?.status !== 201) {
        throw Error()
      }
      return data.data
    }
  })

  return { createClientRecord, isLoading, error }
}

export const useAssignStaffMutation = (
  onSuccess: (data: { result: string }) => void
) => {
  const {
    mutate: assignStaff,
    isLoading,
    error
  } = useMutation({
    mutationFn: async (payload: assignStaffArgsType) => {
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
