import React from 'react'

export type Callback = (value: string | null) => void
export type EditingStatus = {
  editingCardId: string | null
  callback: Callback | null
}
const EditingContext = React.createContext<EditingStatus>({
  editingCardId: null,
  callback: null,
})

export default EditingContext
