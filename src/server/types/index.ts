export interface createClientRecordArgsType {
  payload: {
    client_name: string
    file_key: string
    file_name: string
  }
}

export interface assignStaffArgsType {
  clientId: number | string
}
